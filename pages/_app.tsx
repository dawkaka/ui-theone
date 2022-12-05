import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useEffect, useMemo, useState } from "react"
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import axios from "axios";
import { ToasContext } from "../components/context";
import { Toast } from "../components/mis";
import { BsTypeStrikethrough } from "react-icons/bs";
import Head from "next/head";

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
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta charSet="utf-8" />
        <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
        <meta httpEquiv="content-type" content="text/html; charset=UTF-8" />
        <meta name="referrer" content="always" />
        <meta httpEquiv="X-UA-Compatible" />
        <meta name="twitter:data1" content="" />
        <meta name="twitter:label1" content="Prime Couples" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:description" content="" /><meta property="og:description" content="" />
        <meta name="twitter:image" content="https://www.primecouples.com/primecouplesOG.jpg" />
        <meta name="twitter:image:src" content="https://www.primecouples.com/primecouplesOG.jpg" /><meta name="twitter:image:alt" content="Prime Couples" />
        <meta property="og:image" content="https://www.primecouples.com/primecouplesOG.jpg" /><meta property="twitter:url" content="" />
        <meta property="og:url" content="" />
      </Head>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
        <Toast message={message} type={type} resetMessage={() => setMessage("")} />
      </QueryClientProvider >
    </ToasContext.Provider>
  )
}

export default MyApp
