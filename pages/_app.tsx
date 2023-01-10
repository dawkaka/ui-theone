import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useEffect, useMemo, useState } from "react"
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import axios from "axios";
import { ToasContext } from "../components/context";
import { Toast } from "../components/mis";
import Router from "next/router";

const queryClient = new QueryClient()
axios.defaults.withCredentials = true

function MyApp({ Component, pageProps }: AppProps) {
  const [message, setMessage] = useState("")
  const [type, setType] = useState<"ERROR" | "SUCCESS" | "NEUTRAL">("NEUTRAL")
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0)
  let loadTimeout: NodeJS.Timeout
  let timer: NodeJS.Timer

  useEffect(() => {
    const strt = new Date();
    const start = () => {
      loadTimeout = setTimeout(() => {
        setLoading(true)
        setProgress(0);
        timer = setInterval(() => {
          setProgress(Math.min((new Date().getMilliseconds() - strt.getMilliseconds()) / 2000, 0.9));
        }, 10);
      }, 100)

    };
    const end = () => {
      clearTimeout(loadTimeout)
      setLoading(false);
      clearInterval(timer);
      setProgress(1);
    };
    Router.events.on("routeChangeStart", start);
    Router.events.on("routeChangeComplete", end);
    Router.events.on("routeChangeError", end);
    return () => {
      Router.events.off("routeChangeStart", start);
      Router.events.off("routeChangeComplete", end);
      Router.events.off("routeChangeError", end);
    };
  }, []);

  useEffect(() => {
    const val = window.localStorage.getItem("theme")
    if (val === "dark") {
      document.querySelector("body")!.className = "dark"
      document.documentElement.style.colorScheme = "dark"
    } else {
      document.querySelector("body")!.className = "light"
      document.documentElement.style.colorScheme = "light"
    }
  }, []);

  const notify = useMemo(() => ({
    notify: (message: string, type: "SUCCESS" | "NEUTRAL" | "ERROR") => {
      setMessage(message)
      setType(type)
    }
  }), [])


  return (
    <ToasContext.Provider value={notify}>
      <QueryClientProvider client={queryClient}>
        <div>
          {
            loading && (
              <div className="progress-bar">
                <div style={{ width: `${progress * 100}%` }} />
              </div>
            )
          }
          <Component {...pageProps} />
          <Toast message={message} type={type} resetMessage={() => setMessage("")} />
        </div>
      </QueryClientProvider >
    </ToasContext.Provider>
  )
}

export default MyApp
