import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useEffect } from "react"

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const val = window.localStorage.getItem("Theme")
    if (val === "Dark") {
      document.querySelector("body")!.className = "dark"
      document.documentElement.style.colorScheme = "dark"
    } else if (val === "Light") {
      document.querySelector("body")!.className = "light"
      document.documentElement.style.colorScheme = "light"
    }
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      // dark mode
      document.querySelector("body")!.className = "dark"
      document.documentElement.style.colorScheme = "dark"
    }
  }, [])
  return <Component {...pageProps} />
}

export default MyApp
