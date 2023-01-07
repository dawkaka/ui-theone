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

export const useUser = () => {
    const [user, setUser] = useState({ id: "", hasPartner: false })
    useEffect(() => {
        document.cookie.split(";").forEach(cookie => {
            const cc = cookie.trim().split("=")
            if (cc[0] === "user_ID") {
                setUser({ hasPartner: localStorage.getItem("hasPartner") !== null, id: cc[1] })
            }
        })
    }, [])
    return user
}

export const useToggle = () => {
    const [on, setOn] = useState(false)
    const off = () => {
        setOn(prv => !prv)
    }
    return { on, off }
}