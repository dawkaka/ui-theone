import { ChangeEvent, FormEvent, MouseEventHandler, useEffect, useRef, useState } from "react"
import Modal from "react-modal";
import { IoMdClose } from "react-icons/io";
import styles from "./styles/settings.module.css"
import { FaCaretDown } from "react-icons/fa";
import { useRouter } from "next/router";

Modal.setAppElement("body")

const modalStyles: Modal.Styles = {
    overlay: {
        zIndex: 1,
        backgroundColor: "var(--modal-overlay)",
        paddingInline: "var(--gap)",
        display: "flex",
        flexDirection: "column",
        margin: 0
    },
    content: {
        alignSelf: "center",
        position: "relative",
        padding: 0,
        margin: 0,
        overflow: "hidden",
        justifyContent: "center",
        display: "flex",
        backgroundColor: "var(--background)",
        flexDirection: "column",
        alignItems: "center",
        left: 0,
        border: "none",
    }
}

export const UserSettings: React.FunctionComponent<{ open: boolean, close: () => void }> = ({ open, close }) => {
    const { locale } = useRouter()
    const [theme, setTheme] = useState("Light")
    console.log(locale)

    const changeUserName = (newName: string) => {
        console.log(newName)
    }

    const themeChange = (e: ChangeEvent<HTMLInputElement>) => {
        const val = e.currentTarget.value
        window.localStorage.setItem("Theme", val)
        if (val == "Dark") {
            document.querySelector("body")!.className = "dark"
            document.documentElement.style.colorScheme = "dark"
        } else {
            document.querySelector("body")!.className = "light"
            document.documentElement.style.colorScheme = "light"
        }
    }
    useEffect(() => {
        const theme = window.localStorage.getItem("Theme")
        if (theme === "Dark") {
            setTheme(theme)
        }
    })

    const langChange = (e: ChangeEvent<HTMLInputElement>) => {
        console.log(e.currentTarget.value)
    }

    return (
        <Modal
            isOpen={open}
            onRequestClose={close}
            style={modalStyles}
        >

            <div className={styles.modalBody}>
                <div className={styles.requestHeader}>
                    <div className={styles.backIcon} onClick={close}>
                        <IoMdClose size={25} color="var(--accents-6)" />
                    </div>
                    <p>Account Settings</p>
                    <div
                        className={styles.nextContainer}
                        style={{ backgroundColor: "transparent" }}
                    >
                        <p style={{ whiteSpace: "pre-wrap" }}>{" "}</p>
                    </div>
                </div>
                <section className={styles.modalContent}>
                    <SettingInputItem title="User name" type="text" submit={changeUserName} />
                    <SettingInputItem title="Password" type="password" submit={changeUserName} />
                    <SettingInputItem title="Email" type="text" submit={changeUserName} />
                    <SettingRadio title="Language" options={["en_English", "es_Español", "fr_French"]} value={locale!} handleChange={langChange} />
                    <SettingRadio title="Theme" options={["Light", "Dark"]} value={theme} handleChange={themeChange} />
                    <div className={styles.dangerousActionContainer}>
                        <button>Logout</button>
                        <button>Delete account</button>
                    </div>
                </section>
            </div>
        </Modal>
    )
}



const SettingInputItem: React.FunctionComponent<{ type: string, title: string, submit: (val: string) => void }> = ({ type, title, submit }) => {
    const [val, setVal] = useState("")
    const [currentPassword, setCurrentPassword] = useState("")
    const [rNewPassword, setRNewPassword] = useState("")
    const iconRef = useRef<HTMLDivElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const change = (e: FormEvent) => {
        e.preventDefault()
        submit(val)
    }
    const showInputs = () => {
        iconRef.current!.classList.toggle(`${styles.show}`)
        containerRef.current!.classList.toggle(`${styles.expand}`)
    }
    return (
        <form onSubmit={change} className={styles.itemContainer}>
            <button className={styles.settingItemHeader} onClick={showInputs}>
                <p>{title}</p>
                <div ref={iconRef}>
                    <FaCaretDown />
                </div>
            </button>
            <div ref={containerRef} className={styles.inputContainer}>
                {title.toLocaleLowerCase() === "password" ?
                    <input type={type} value={currentPassword} placeholder={`Current ${title.toLocaleLowerCase()}`} onChange={(e) => setCurrentPassword(e.currentTarget.value)} />
                    : null
                }
                <input type={type} value={val} placeholder={`New ${title.toLocaleLowerCase()}`} onChange={(e) => setVal(e.currentTarget.value)} />
                {title.toLocaleLowerCase() === "password" ?
                    <input type={type} value={rNewPassword} placeholder={`Repeat ${title.toLocaleLowerCase()}`} onChange={(e) => setRNewPassword(e.currentTarget.value)} />
                    : null
                }
                <button>Change</button>
            </div>
        </form>
    )
}

const SettingRadio: React.FunctionComponent<{
    title: "Theme" | "Language"; options: string[];
    value: string; handleChange: (e: ChangeEvent<HTMLInputElement>) => void
}> = ({ title, options, value, handleChange }) => {
    const [val, setVal] = useState(value)
    const iconRef = useRef<HTMLDivElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    const change = (e: ChangeEvent<HTMLInputElement>) => {
        setVal(e.currentTarget.value)
        handleChange(e)
    }

    const showInputs = () => {
        iconRef.current!.classList.toggle(`${styles.show}`)
        containerRef.current!.classList.toggle(`${styles.expand}`)
    }


    return (
        <div className={styles.itemContainer} role="form">
            <button className={styles.settingItemHeader} onClick={showInputs}>
                <p>{title}</p>
                <div ref={iconRef}>
                    <FaCaretDown />
                </div>
            </button>
            <div ref={containerRef} className={styles.inputContainer}>
                {
                    options.map((option, indx) => {
                        const v = title === "Language" ? option.split("_")[0] : option
                        const lab = title === "Language" ? option.split("_")[1] : option
                        return (
                            <div key={option} className={styles.inputContainerInner}>
                                <input type="radio" id={option} value={v} name={title} onChange={change} checked={v === val} />
                                <label htmlFor={option} style={{ background: `var(--${indx})` }}>{lab}</label>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}