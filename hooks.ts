import { Theme } from "emoji-picker-react"
import { useEffect, useState } from "react"


export const useTheme = () => {
    const [theme, setTheme] = useState<Theme>(Theme.LIGHT)
    useEffect(() => {
        const t = localStorage.getItem("theme")
        if (t === "dark") {
            setTheme(Theme.DARK)
        }
    }, [])
    return theme
}