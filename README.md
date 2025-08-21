# Agent-X – AI-Powered Course Manager

Welcome to **Agent-X**, an AI-powered web application for managing courses with a smart agentic assistant! Create, view, and interact with your courses using a modern UI and Google Gemini-powered backend.

---

## Features

✅ **AI Agent Integration** – Use Google Gemini to interpret user requests and perform UI actions or chat!
✅ **Modern Web UI** – Built with Next.js and Tailwind CSS for a beautiful, responsive experience.
✅ **Course Management** – Create, view, and manage courses easily.
✅ **Full-Stack** – FastAPI backend, React/Next.js frontend, and seamless API communication.

---

## How To Install?

### 1⃣ Clone the Repository
```powershell
git clone https://github.com/pkp-git/Agent-X.git
cd Agent-X
```

### 2⃣ Set Up Environment Variables
- Create a `.env` file in the root directory.
- Add your Google Gemini API key:
  ```env
  GEMINI_API_KEY="your_gemini_api_key_here"
  ```

### 3⃣ Install Python Dependencies
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### 4⃣ Install Node.js Dependencies
```powershell
cd app
npm install
```

### 5⃣ Run the Backend (FastAPI)
```powershell
uvicorn agent:app --reload
```

### 6⃣ Run the Frontend (Next.js)
```powershell
cd app
npm run dev
```

### 7⃣ Open in Browser
Go to **http://localhost:3000** to use the app!

---

## How It Works

1⃣ The user interacts with the web UI to create or view courses.
2⃣ The AI agent (Google Gemini) interprets user requests and can perform UI actions or chat.
3⃣ The backend (FastAPI) processes requests and communicates with the Gemini API.
4⃣ The frontend (Next.js) displays a modern, interactive interface.

---

## Contributing

💡 Have ideas or improvements? Found a bug? Fork the repo, make your changes, and submit a **pull request**!

---

## 📜 License

📝 This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for more details.

---

## Acknowledgements

Thanks to the open-source community for the amazing tools and libraries!
