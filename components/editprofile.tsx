import { FormEvent, useEffect, useState } from "react"
import { IoMdClose } from "react-icons/io"
import Modal from "react-modal"
import styles from "./styles/edit.module.css"
import tr from "../i18n/locales/components/editprofile.json"
import { Langs } from "../types"
import { useRouter } from "next/router"

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
                        <input type="text" id="first" required placeholder={localeTr.firstname.placeholder} />

                    </div> <div className={styles.editItem}>
                        <label htmlFor="last">{localeTr.lastname.title}*</label>
                        <input type="text" id="last" required placeholder={localeTr.lastname.placeholder} />
                    </div>
                    <div className={styles.editItem}>
                        <label htmlFor="last">{localeTr.dob.title}*</label>
                        <input type="date" id="last" required />
                    </div>
                    <div className={styles.editItem}>
                        <label htmlFor="bio">{localeTr.bio.title}</label>
                        <textarea id="bio" className={styles.bio} placeholder={localeTr.bio.placeholder}>
                        </textarea>
                    </div>
                    <div className={styles.editItem}>
                        <label htmlFor="contact">{localeTr.contact.title}</label>
                        <input type="url" id="contact" placeholder="example@gmail.com" />
                    </div>

                </section>
            </form>
        </Modal>
    )
}

export default EditCouple