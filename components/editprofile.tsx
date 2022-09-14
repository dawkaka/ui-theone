import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react"
import { IoMdClose } from "react-icons/io"
import Modal from "react-modal"
import styles from "./styles/edit.module.css"
import tr from "../i18n/locales/components/editprofile.json"
import { ErrCodes, Langs } from "../types"
import { useRouter } from "next/router"
import { isRealName } from "../libs/validators"

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
        backgroundColor: "black",
        justifyContent: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        left: 0,
        border: "none",
    }
}
const EditCouple: React.FunctionComponent<{ open: boolean, close: () => void }> = ({ open, close }) => {


    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        close()
    }
    const router = useRouter()
    const locale = router.locale || "en"
    const localeTr = tr[locale as Langs]

    return (
        <Modal
            isOpen={open}
            onRequestClose={close}
            style={modalStyles}
        >
            <form className={styles.modalBody} onSubmit={handleSubmit}>
                <div className={styles.requestHeader}>
                    <div className={styles.backIcon} onClick={close}>
                        <IoMdClose size={25} color="var(--accents-6)" />
                    </div>
                    <p>{localeTr.editcp}</p>
                    <div
                        onClick={() => { }}
                        className={styles.nextContainer}
                    >
                        <button>{localeTr.done}</button>
                    </div>
                </div>
                <section className={styles.modalContent}>
                    <div className={styles.editItem}>
                        <label htmlFor="bio">{localeTr.bio.title}</label>
                        <textarea id="bio" className={styles.bio} placeholder={localeTr.bio.placeholder}>
                        </textarea>
                    </div>
                    <div className={styles.editItem}>
                        <label htmlFor="status">{localeTr.status.title}</label>
                        <input type="text" id="status" />
                    </div>
                    <div className={styles.editItem}>
                        <label htmlFor="date">{localeTr.drb.title}</label>
                        <input type="date" id="date" pattern="yyy-mm-d" />
                    </div>
                    <div className={styles.editItem}>
                        <label htmlFor="contact">{localeTr.contact.title}</label>
                        <input type="url" id="contact" placeholder="example@gmail.com" />
                    </div>

                </section>
            </form>
        </Modal >
    )
}

export const EditUser: React.FunctionComponent<{ open: boolean, close: () => void }> = ({ open, close }) => {
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setErrMode(true)
        if (fNameErrs.length !== 0 || lNameErrs.length !== 0) return
        close()
    }

    const router = useRouter()
    const locale = router.locale || "en"
    const localeTr = tr[locale as Langs]

    const [fNameErrs, setFNameErrs] = useState<ErrCodes>([])
    const [lNameErrs, setLNameErrs] = useState<ErrCodes>([])
    const [errMode, setErrMode] = useState(false)
    const bioRef = useRef("")

    const handleFirst = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.currentTarget.value
        const errs = isRealName(value)
        setFNameErrs(errs)
    }

    const handleLastName = (e: ChangeEvent<HTMLInputElement>) => {
        setLNameErrs(isRealName(e.currentTarget.value))
    }

    const handleBio = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const target = e.currentTarget
        const len = target.value.length
        if (len > 255) {
            target.value = bioRef.current
            return
        }
        target.nextSibling!.textContent = len + "/255"
        bioRef.current = target.value
    }

    return (
        <Modal
            isOpen={open}
            onRequestClose={close}
            style={modalStyles}
        >
            <form className={styles.modalBody} onSubmit={handleSubmit}>
                <div className={styles.requestHeader}>
                    <div className={styles.backIcon} onClick={close}>
                        <IoMdClose size={25} color="var(--accents-6)" />
                    </div>
                    <p>{localeTr.editup}</p>
                    <div
                        onClick={() => { }}
                        className={styles.nextContainer}
                    >
                        <button>{localeTr.done}</button>
                    </div>
                </div>
                <section className={styles.modalContent}>
                    <div className={styles.editItem}>
                        <label htmlFor="first">{localeTr.firstname.title}*</label>
                        <input type="text" id="first" name="first_name" required placeholder={localeTr.firstname.placeholder} onChange={handleFirst} />
                        <div className={styles.errorsContainer}>
                            {
                                fNameErrs.map(val => {
                                    return <p key={val} style={{ color: errMode ? "var(--error)" : "" }}>{localeTr.nameErrs[val]}</p>
                                })
                            }
                        </div>
                    </div>
                    <div className={styles.editItem}>
                        <label htmlFor="last">{localeTr.lastname.title}*</label>
                        <input type="text" id="last" name="last_name" required placeholder={localeTr.lastname.placeholder} onChange={handleLastName} />
                        <div className={styles.errorsContainer}>
                            {
                                lNameErrs.map(val => {
                                    return <p key={val} style={{ color: errMode ? "var(--error)" : "" }}>{localeTr.nameErrs[val]}</p>
                                })
                            }
                        </div>
                    </div>
                    <div className={styles.editItem}>
                        <label htmlFor="last">{localeTr.dob.title}*</label>
                        <input type="date" id="last" required name="date_of_birth" />
                    </div>
                    <div className={styles.editItem}>
                        <label htmlFor="bio">{localeTr.bio.title}</label>
                        <textarea
                            id="bio"
                            className={styles.bio}
                            onChange={handleBio}
                            placeholder={localeTr.bio.placeholder}
                            name="bio">
                        </textarea>
                        <p id="bioCounter" style={{ alignSelf: "flex-end", fontSize: "small", color: "var(--accents-6)" }}>10/500</p>
                    </div>
                    <div className={styles.editItem}>
                        <label htmlFor="contact">{localeTr.contact.title}</label>
                        <input type="url" id="contact" placeholder="example@gmail.com" name="contact" />
                    </div>

                </section>
            </form>
        </Modal>
    )
}

export default EditCouple