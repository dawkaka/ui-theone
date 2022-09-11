import { ChangeEvent, FormEvent, MouseEventHandler, useEffect, useRef, useState } from "react"
import Modal from "react-modal";
import { IoMdClose } from "react-icons/io";
import styles from "./styles/settings.module.css"
import { FaCaretDown } from "react-icons/fa";
import { useRouter } from "next/router";
import tr from "../i18n/locales/components/settings.json"
import { Langs } from "../types"
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
    const router = useRouter()
    const { pathname, asPath } = router
    const [theme, setTheme] = useState("Light")

    const locale = router.locale || "en"
    const localeTr = tr[locale as Langs]

    const changeUserName = (newName: string) => {
        console.log(newName)
    }

    const themeChange = (e: ChangeEvent<HTMLInputElement>) => {
        const val = e.currentTarget.value
        window.localStorage.setItem("Theme", val)
        if (val == "Dark" || val == "Oscuro") {
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
        const lang = e.currentTarget.value
        document.cookie = `NEXT_LOCALE=${lang};${1000 * 60 * 60 * 24 * 40};path=/`
        router.replace("/user/[name]", asPath, { locale: lang })
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
                    <p>{localeTr.header}</p>
                    <div
                        className={styles.nextContainer}
                        style={{ backgroundColor: "transparent" }}
                    >
                        <p style={{ whiteSpace: "pre-wrap" }}>{" "}</p>
                    </div>
                </div>
                <section className={styles.modalContent}>
                    <SettingInputItem
                        type="text"
                        title={localeTr.username.title}
                        submit={changeUserName}
                        placeholder={localeTr.username.placehoder}
                        actionTitle={localeTr.change}
                    />
                    <SettingInputItem
                        type="password"
                        title={localeTr.password.title}
                        placeholder={localeTr.password.new}
                        actionTitle={localeTr.change}
                        placeholderCurrent={localeTr.password.current}
                        placeholderRepeat={localeTr.password.repeat}
                        submit={changeUserName}
                    />
                    <SettingInputItem
                        type="email"
                        title={localeTr.email.title}
                        placeholder={localeTr.email.placehoder}
                        actionTitle={localeTr.change}
                        submit={changeUserName}
                    />
                    <SettingRadio title={localeTr.language.title} options={["en_English", "es_Español"]} value={locale === "en" ? 0 : 1} handleChange={langChange} lang />
                    <SettingRadio title={localeTr.theme.title} options={[localeTr.theme.light, localeTr.theme.dark]} value={theme === "light" ? 0 : 1} handleChange={themeChange} />
                    <div className={styles.dangerousActionContainer}>
                        <button>{localeTr.logout}</button>
                        <button style={{ backgroundColor: "var(--error)", color: "white" }}>{localeTr.deleteacount}</button>
                    </div>
                </section>
            </div>
        </Modal>
    )
}



const SettingInputItem: React.FunctionComponent<{
    type: string, title: string,
    submit: (val: string) => void,
    placeholderCurrent?: string,
    placeholderRepeat?: string
    placeholder: string,
    actionTitle: string
}> = ({ placeholder, type, title, submit, actionTitle, placeholderCurrent, placeholderRepeat }) => {
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
                {
                    placeholderCurrent ?
                        <input type={type} value={currentPassword} placeholder={placeholderCurrent} onChange={(e) => setCurrentPassword(e.currentTarget.value)} />
                        :
                        null
                }
                <input type={type} value={val} placeholder={placeholder} onChange={(e) => setVal(e.currentTarget.value)} />
                {
                    placeholderRepeat ?
                        <input type={type} value={rNewPassword} placeholder={placeholderRepeat} onChange={(e) => setRNewPassword(e.currentTarget.value)} />
                        :
                        null
                }
                <button>{actionTitle}</button>
            </div>
        </form>
    )
}

const SettingRadio: React.FunctionComponent<{
    title: string,
    options: string[],
    value: number,
    lang?: boolean;
    handleChange: (e: ChangeEvent<HTMLInputElement>) => void
}> = ({ title, options, value, handleChange, lang }) => {
    const [val, setVal] = useState(value)
    const iconRef = useRef<HTMLDivElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    const change = (e: ChangeEvent<HTMLInputElement>, indx: number) => {
        setVal(indx)
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
                        const v = lang ? option.split("_")[0] : option
                        const lab = lang ? option.split("_")[1] : option
                        return (
                            <div key={option} className={styles.inputContainerInner}>
                                <input type="radio" id={option} value={v} name={title} onChange={(e) => change(e, indx)} checked={val === indx} />
                                <label htmlFor={option} style={{ background: `var(--${indx})` }}>{lab}</label>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}