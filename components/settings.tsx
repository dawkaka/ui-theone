import { FormEvent, MouseEventHandler, useRef, useState } from "react"
import Modal from "react-modal";
import { IoMdClose } from "react-icons/io";
import styles from "./styles/settings.module.css"
import { FaCaretDown } from "react-icons/fa";

const modalStyles: Modal.Styles = {
    overlay: {
        zIndex: 1,
        backgroundColor: "rgba(0,0,0,0.75)",
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
                    <SettingInputItem title="Username" type="text" submit={changeUserName} />
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
        <form onSubmit={change}>
            <div tabIndex={0} className={styles.settingItemHeader} onClick={showInputs}>
                <p>{title}</p>
                <div ref={iconRef}>
                    <FaCaretDown />
                </div>
            </div>
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