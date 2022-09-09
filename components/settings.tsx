import { ChangeEvent, FormEvent, MouseEventHandler, useEffect, useRef, useState } from "react"
import Modal from "react-modal";
import { IoMdClose } from "react-icons/io";
import styles from "./styles/settings.module.css"
import { FaCaretDown } from "react-icons/fa";

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

    const changeUserName = (newName: string) => {
        console.log(newName)
    }

    const themeChange = (e: ChangeEvent<HTMLInputElement>) => {
        const val = e.currentTarget.value
        const modals = document.querySelectorAll(".ReactModal__Content")
        window.localStorage.setItem("Theme", val)
        if (val == "Dark") {
            document.querySelector("body")!.className = "dark"
            document.documentElement.style.colorScheme = "dark"
            for (let modal of Array.from(modals)) {
                modal.classList.add("dark")
            }
        } else {
            document.querySelector("body")!.className = "light"
            document.documentElement.style.colorScheme = "light"
            for (let modal of Array.from(modals)) {
                modal.classList.remove("dark")
            }
        }
    }

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
                    <SettingInputItem title="Password" type="text" submit={changeUserName} />
                    <SettingInputItem title="Email" type="text" submit={changeUserName} />
                    <SettingRadio title="Language" options={["English", "Español"]} value="English" handleChange={langChange} />
                    <SettingRadio title="Theme" options={["Light", "Dark"]} value="Light" handleChange={themeChange} />
                </section>
            </div>
        </Modal>
    )
}



const SettingInputItem: React.FunctionComponent<{ type: string, title: string, submit: (val: string) => void }> = ({ type, title, submit }) => {
    const [val, setVal] = useState("")
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
                    <input type={type} value={val} placeholder={`Current ${title.toLocaleLowerCase()}`} />
                    : null
                }
                <input type={type} value={val} placeholder={`New ${title.toLocaleLowerCase()}`} />
                {title.toLocaleLowerCase() === "password" ?
                    <input type={type} value={val} placeholder={`Repeat ${title.toLocaleLowerCase()}`} />
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
                <div>
                    {
                        options.map((option, indx) => (
                            <div key={option}>
                                <input type="radio" id={option} value={option} name={title} onChange={change} checked={option === val} />
                                <label htmlFor={option} style={{ backgroundColor: `var(--${indx})` }}>{option}</label>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}