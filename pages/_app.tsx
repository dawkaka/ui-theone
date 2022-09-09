import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useEffect } from "react"

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const modals = document.querySelectorAll(".ReactModal__Content")
    const val = window.localStorage.getItem("Theme")
    if (val === "Dark") {
      document.querySelector("body")!.className = "dark"
      document.documentElement.style.colorScheme = "dark"
      for (let modal of Array.from(modals)) {
        modal.classList.add("dark")
      }
    } else if (val === "Light") {
      document.querySelector("body")!.className = "light"
      document.documentElement.style.colorScheme = "light"
      for (let modal of Array.from(modals)) {
        modal.classList.remove("dark")
      }
    }
  }, [])
  return <Component {...pageProps} />
}

export default MyApp
