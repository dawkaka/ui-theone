import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react"
import { IoMdClose } from "react-icons/io"
import Modal from "react-modal"
import styles from "./styles/edit.module.css"
import tr from "../i18n/locales/components/editprofile.json"
import { EditCouple, EditUser as EditU, EditUserT, ErrCodes, Langs } from "../types"
import { useRouter } from "next/router"
import { isRealName } from "../libs/validators"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios, { AxiosError } from "axios"
import { BASEURL } from "../constants"

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

    const router = useRouter()
    const locale = router.locale || "en"
    const localeTr = tr[locale as Langs]

    const website = useRef("")
    const drb = useRef("")
    const [bio, setBio] = useState("")

    const mutation = useMutation(
        (data: EditCouple) => {
            return axios.put(`${BASEURL}/couple`, JSON.stringify(data))
        },
        {
            onSuccess: (data) => {
                console.log(data.data)
                close()
            },
            onError: (err: AxiosError) => {
                console.log(err.response)
            }
        }
    )

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        mutation.mutate({ bio: bio, website: website.current, date_commenced: drb.current })
    }

    const handleBio = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value
        if (value.length > 255) return
        setBio(value)
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
                    <p>{localeTr.editcp}</p>
                    <div
                        className={styles.nextContainer}
                    >
                        <button>{localeTr.done}</button>
                    </div>
                </div>
                <section className={styles.modalContent}>
                    <div className={styles.editItem}>
                        <label htmlFor="bio">{localeTr.bio.title}</label>
                        <textarea id="bio" className={styles.bio}
                            placeholder={localeTr.bio.placeholder}
                            onChange={handleBio}
                            value={bio}
                        >
                        </textarea>
                        <p id="bioCounter" style={{
                            alignSelf: "flex-end",
                            fontSize: "small",
                            color: "var(--accents-6)"
                        }}>{bio.length}/255</p>
                    </div>
                    <div className={styles.editItem}>
                        <label htmlFor="date">{localeTr.drb.title}</label>
                        <input type="date" id="date" pattern="yyy-mm-d" name="date_relationship_begun" onChange={(e) => drb.current = e.target.value + "T00:00:00Z"} />
                    </div>
                    <div className={styles.editItem}>
                        <label htmlFor="contact">{localeTr.contact.title}</label>
                        <input type="url" id="contact" placeholder="example@gmail.com" name="website" onChange={(e) => website.current = e.target.value} />
                    </div>

                </section>
            </form>
        </Modal >
    )
}

export const EditUser: React.FunctionComponent<EditUserT> = ({ open, close, first_name, last_name, website, bio, dob }) => {
    const queryClient = useQueryClient()
    const router = useRouter()
    const locale = router.locale || "en"
    const localeTr = tr[locale as Langs]

    const [firstName, setFirstName] = useState(first_name)
    const [lastName, setLastName] = useState(last_name)
    const [fNameErrs, setFNameErrs] = useState<ErrCodes>([])
    const [lNameErrs, setLNameErrs] = useState<ErrCodes>([])
    const [errMode, setErrMode] = useState(false)

    dob = new Date(dob).toLocaleString('en-CA').substring(0, 10)
    const bioRef = useRef(bio)
    const dateRef = useRef(dob)
    const webRef = useRef(website)

    const mutation = useMutation(
        (data: EditU) => {
            return axios.put(`${BASEURL}/user`, JSON.stringify(data))
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["profile", { name: router.query.name }])
                close()
            }
        }
    )

    const handleFirst = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.currentTarget.value
        const errs = isRealName(value)
        setFNameErrs(errs)
        setFirstName(value)
    }

    const handleLastName = (e: ChangeEvent<HTMLInputElement>) => {
        setLNameErrs(isRealName(e.currentTarget.value))
        setLastName(e.currentTarget.value)
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

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setErrMode(true)
        if (fNameErrs.length !== 0 || lNameErrs.length !== 0) return
        mutation.mutate({ first_name: firstName, last_name: lastName, bio: bioRef.current, date_of_birth: dateRef.current + "T00:00:00Z", website: webRef.current })
    }

    return (
        <Modal
            isOpen={open}
            onRequestClose={close}
            style={modalStyles}
        >
            <form className={styles.modalBody} onSubmit={handleSubmit} id="form">
                <div className={styles.requestHeader}>
                    <div className={styles.backIcon} onClick={close}>
                        <IoMdClose size={25} color="var(--accents-6)" />
                    </div>
                    <p>{localeTr.editup}</p>
                    <div
                        className={styles.nextContainer}
                    >
                        <button>{localeTr.done}</button>
                    </div>
                </div>
                <section className={styles.modalContent}>
                    <div className={styles.editItem}>
                        <label htmlFor="first">{localeTr.firstname.title}*</label>
                        <input type="text" id="first" name="first_name" required
                            placeholder={localeTr.firstname.placeholder} onChange={handleFirst}
                            defaultValue={first_name}
                        />
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
                        <input type="text" id="last" name="last_name"
                            required placeholder={localeTr.lastname.placeholder}
                            onChange={handleLastName}
                            defaultValue={last_name}
                        />
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
                        <input type="date" id="last" required name="date_of_birth"
                            onChange={(e) => dateRef.current = e.target.value}
                            defaultValue={dob}
                        />
                    </div>
                    <div className={styles.editItem}>
                        <label htmlFor="bio">{localeTr.bio.title}</label>
                        <textarea
                            id="bio"
                            className={styles.bio}
                            onChange={handleBio}
                            placeholder={localeTr.bio.placeholder}
                            name="bio"
                            defaultValue={bio}
                        >
                        </textarea>
                        <p id="bioCounter" style={{
                            alignSelf: "flex-end",
                            fontSize: "small",
                            color: "var(--accents-6)"
                        }}>0/255</p>
                    </div>
                    <div className={styles.editItem}>
                        <label htmlFor="contact">{localeTr.contact.title}</label>
                        <input
                            type="url" id="contact" placeholder="example@gmail.com"
                            name="website"
                            onChange={(e) => webRef.current = e.target.value}
                            defaultValue={website}
                        />
                    </div>

                </section>
            </form>
        </Modal>
    )
}

export default EditCouple