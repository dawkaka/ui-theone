import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useEffect } from "react"
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import axios from "axios";
import { ToasContext } from "../components/context";
import { Toast } from "../components/mis";

const queryClient = new QueryClient()
axios.defaults.withCredentials = true
function MyApp({ Component, pageProps }: AppProps) {
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


  return (
    <ToasContext.Provider value={null}>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
        <Toast message="Hello world" type="NEUTRAL" resetMessage={() => { }} />
      </QueryClientProvider >
    </ToasContext.Provider>
  )
}

export default MyApp
