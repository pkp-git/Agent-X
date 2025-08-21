import { useState, useRef, useEffect } from "react";

export default function AgentWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [conversationMode, setConversationMode] = useState(false); // Track if mic should auto-restart
  const recognitionRef = useRef(null);
  const conversationModeRef = useRef(conversationMode);

  useEffect(() => {
    conversationModeRef.current = conversationMode;
  }, [conversationMode]);

  // --- Agentic Action Handler ---
  function handleAgentAction(action) {
    function findElement(selector) {
      // Try querySelector first
      let el = null;
      try {
        el = document.querySelector(selector);
      } catch {}
      if (el) return el;
      // Fallback: try name attribute
      if (selector.startsWith("[name='") && selector.endsWith("']")) {
        const name = selector.slice(7, -2);
        el = document.querySelector(`[name='${name}']`);
        if (el) return el;
      }
      // Fallback: try by label/text content for buttons/links
      const matchText = selector.match(/:(?:contains|text)\('(.+)'\)/);
      if (matchText) {
        const text = matchText[1].trim().toLowerCase();
        // Try button
        el = Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim().toLowerCase() === text);
        if (el) return el;
        // Try link
        el = Array.from(document.querySelectorAll('a')).find(a => a.textContent.trim().toLowerCase() === text);
        if (el) return el;
      }
      return null;
    }
    try {
      switch (action.action) {
        case "fillorupdate": {
          const el = findElement(action.selector);
          if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA")) {
            el.value = action.value;
            el.dispatchEvent(new Event("input", { bubbles: true }));
          }
          break;
        }
        case "append": {
          const el = findElement(action.selector);
          if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA")) {
            el.value = (el.value || "") + (action.value || "");
            el.dispatchEvent(new Event("input", { bubbles: true }));
          }
          break;
        }
        case "clear": {
          const el = findElement(action.selector);
          if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA")) {
            el.value = "";
            el.dispatchEvent(new Event("input", { bubbles: true }));
          }
          break;
        }
        case "click": {
          const el = findElement(action.selector);
          if (el) el.click();
          break;
        }
        case "highlight": {
          const el = findElement(action.selector);
          if (el) {
            // Add a visible yellow glow and a short flash animation
            el.style.transition = "box-shadow 0.2s, background 0.2s";
            el.style.boxShadow = "0 0 0 4px #ffe066, 0 0 10px 2px #ffd700";
            el.style.backgroundColor = "#fffbe6";
            setTimeout(() => {
              el.style.boxShadow = "";
              el.style.backgroundColor = "";
            }, 1200);
          }
          break;
        }
        // Add more actions as needed
        default:
          console.warn("Unknown action:", action);
      }
    } catch (e) {
      console.error("Agent action error:", e);
    }
  }

  // --- AI Message Handler ---
  function handleAIResponse(text) {
    // Try to parse as JSON action
    let action = null;
    let isJson = false;
    try {
      action = JSON.parse(text);
      if (action && typeof action === "object") {
        isJson = true;
      }
    } catch (e) {}
    if (action && action.action) {
      handleAgentAction(action);
    }
    setMessages((prev) => [...prev, { sender: "ai", text }]);
    if (!isJson) {
      // Text-to-speech for chat responses only
      if (typeof window !== "undefined" && window.speechSynthesis) {
        const utter = new window.SpeechSynthesisUtterance(text);
        utter.lang = "en-US";
        utter.onend = () => {
          // After TTS completes, if conversationMode is on, restart mic
          if (conversationModeRef.current) {
            handleMicClick(true); // pass true to indicate auto-restart
          }
        };
        window.speechSynthesis.speak(utter);
      }
    } else {
      // For JSON/action responses, if in conversation mode, restart mic (no TTS)
      if (conversationModeRef.current) {
        handleMicClick(true);
      }
    }
  }

  // --- Speech-to-Text Handler ---
  // If auto is true, don't toggle conversationMode, just start listening
  const handleMicClick = (auto = false) => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser.');
      return;
    }
    let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.interimResults = false;
      recognitionRef.current.maxAlternatives = 1;
    }
    // Always assign handlers before starting
    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setListening(false);
      if (conversationModeRef.current) {
        // Auto-send in conversation mode
        setInput("");
        setMessages((prev) => [...prev, { sender: "user", text: transcript }]);
        // Get the latest schema from the global variable
        const schema = typeof window !== "undefined" ? window.__PAGE_SCHEMA || [] : [];
        fetch("http://localhost:8000/api/agent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: transcript, schema }),
        })
          .then(res => res.json())
          .then(data => handleAIResponse(data.text))
          .catch(() => handleAIResponse("[Error contacting AI backend]"));
      } else {
        setInput(transcript);
      }
    };
    recognitionRef.current.onerror = () => setListening(false);
    recognitionRef.current.onend = () => setListening(false);
    setListening(true);
    recognitionRef.current.start();
    if (!auto) {
      setConversationMode((prev) => !prev); // Toggle conversation mode only on manual click
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    setInput("");
    try {
      // Get the latest schema from the global variable
      const schema = typeof window !== "undefined" ? window.__PAGE_SCHEMA || [] : [];
      const res = await fetch("http://localhost:8000/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, schema }),
      });
      const data = await res.json();
      handleAIResponse(data.text);
    } catch (e) {
      handleAIResponse("[Error contacting AI backend]");
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          borderRadius: "50%",
          width: "60px",
          height: "60px",
          background: "#0070f3",
          color: "#fff",
          border: "none",
          fontSize: "24px",
        }}
      >
        💬
      </button>

      {/* Chat Window */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: "90px",
            right: "20px",
            width: "300px",
            height: "400px",
            background: "#FFFDEB", // cream color
            color: "#111", // black text
            border: "1px solid #ccc",
            borderRadius: "8px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              flex: 1,
              padding: "10px",
              overflowY: "auto",
            }}
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  textAlign: msg.sender === "user" ? "right" : "left",
                  margin: "5px 0",
                }}
              >
                <span
                  style={{
                    background: msg.sender === "user" ? "#0070f3" : "#f5f5dc", // user: blue, ai: light cream
                    color: msg.sender === "user" ? "#fff" : "#111", // user: white, ai: black
                    padding: "5px 10px",
                    borderRadius: "12px",
                    display: "inline-block",
                  }}
                >
                  {msg.text}
                </span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", borderTop: "1px solid #ccc", alignItems: "center", gap: "6px" }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{ flex: 1, padding: "10px", border: "none" }}
              placeholder={listening ? "Listening..." : "Type a message or use the mic..."}
              disabled={listening}
              onKeyDown={e => { if (e.key === "Enter") sendMessage(); }}
            />
            <button
              onClick={() => handleMicClick(false)}
              style={{
                background: conversationMode ? "#10b981" : listening ? "#fbbf24" : "#e5e7eb",
                border: "none",
                borderRadius: "50%",
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                fontSize: "18px",
                color: conversationMode ? "#fff" : listening ? "#fff" : "#111",
                transition: "background 0.2s"
              }}
              title={conversationMode ? "Conversational mode ON" : listening ? "Listening..." : "Speak"}
              disabled={listening}
            >
              <span role="img" aria-label="mic">🎤</span>
            </button>
            <button onClick={sendMessage} style={{ padding: "10px" }} disabled={listening || !input.trim()}>
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}
