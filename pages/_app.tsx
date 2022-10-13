import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useEffect, useMemo, useState } from "react"
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import axios from "axios";
import { ToasContext } from "../components/context";
import { Toast } from "../components/mis";
import { BsTypeStrikethrough } from "react-icons/bs";

const queryClient = new QueryClient()
axios.defaults.withCredentials = true
function MyApp({ Component, pageProps }: AppProps) {
  const [message, setMessage] = useState("")
  const [type, setType] = useState<"ERROR" | "SUCCESS" | "NEUTRAL">("NEUTRAL")


  useEffect(() => {
    const val = window.localStorage.getItem("theme")
    if (val === "dark") {
      document.querySelector("body")!.className = "dark"
      document.documentElement.style.colorScheme = "dark"
    } else {
      document.querySelector("body")!.className = "light"
      document.documentElement.style.colorScheme = "light"
    }
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      // dark mode
      document.querySelector("body")!.className = "dark"
      document.documentElement.style.colorScheme = "dark"
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
        <Component {...pageProps} />
        <Toast message={message} type={type} resetMessage={() => setMessage("")} />
      </QueryClientProvider >
    </ToasContext.Provider>
  )
}

export default MyApp
