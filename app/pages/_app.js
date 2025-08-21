
import "../styles/globals.css";
import { CoursesProvider } from "../context/CoursesContext";
import AgentWidget from "../components/AgentWidget";
import { useEffect } from "react";
import { useRouter } from "next/router";

// Make schema globally accessible
if (typeof window !== "undefined") {
  window.__PAGE_SCHEMA = [];
}

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    // Dynamically import getPageSchema to avoid SSR issues
    let getPageSchema;
    import("../components/getPageSchema").then(mod => {
      getPageSchema = mod.default || mod.getPageSchema || mod;
      if (typeof getPageSchema === "function") {
        window.__PAGE_SCHEMA = getPageSchema();
        console.log("[PAGE_SCHEMA]", window.__PAGE_SCHEMA);
      }
    });
    // On route change, update schema
    const handleRouteChange = () => {
      if (typeof getPageSchema === "function") {
        window.__PAGE_SCHEMA = getPageSchema();
        console.log("[PAGE_SCHEMA]", window.__PAGE_SCHEMA);
      }
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router]);

  return (
    <CoursesProvider>
      <Component {...pageProps} />
      <AgentWidget />
    </CoursesProvider>
  );
}