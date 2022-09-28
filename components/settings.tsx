import { ChangeEvent, FormEvent, MouseEventHandler, useEffect, useMemo, useRef, useState } from "react"
import Modal from "react-modal";
import { IoMdClose } from "react-icons/io";
import styles from "./styles/settings.module.css"
import { FaCaretDown } from "react-icons/fa";
import { useRouter } from "next/router";
import tr from "../i18n/locales/components/settings.json"
import { Langs } from "../types"
import { Theme } from "emoji-picker-react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { BASEURL } from "../constants";
import { isPassword } from "../libs/validators";
import { Prompt } from "./prompt";
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
    const [theme, setTheme] = useState<Theme>(Theme.LIGHT)
    const [prOpen, setPrOpen] = useState(false)

    const locale = router.locale || "en"
    const localeTr = tr[locale as Langs]

    const changeNameMutation = useMutation(
        (data: { user_name: string }) => {
            return axios.put(`${BASEURL}/user/name`, JSON.stringify(data))
        },
        {
            onSuccess: (data) => {
                console.log(data)
            },
            onError: (err) => {
                console.log(err)
            }
        }
    )

    const changeName = (newName: string) => {
        changeNameMutation.mutate({ user_name: newName })
    }

    const themeChange = (val: string) => {
        window.localStorage.setItem("theme", val)
        if (val === "dark") {
            document.querySelector("body")!.className = "dark"
            document.documentElement.style.colorScheme = "dark"
        } else {
            document.querySelector("body")!.className = "light"
            document.documentElement.style.colorScheme = "light"
        }
    }

    useEffect(() => {
        const theme = window.localStorage.getItem("theme")
        if (theme === "dark") {
            setTheme(Theme.DARK)
        }
    }, [])



    const langMutation = useMutation(
        (lang: string) => {
            return axios.patch(`${BASEURL}/user/settings/language/${lang}`)
        },
        {
            onSuccess: (data) => {
                console.log(data)
            },
            onError: (err) => {
                console.log(err)
            }
        }
    )

    const langChange = (lang: string) => {
        document.cookie = `NEXT_LOCALE=${lang};${1000 * 60 * 60 * 24 * 40};path=/`
        router.replace("/user/[name]", asPath, { locale: lang })
        langMutation.mutate(lang)
    }

    const passwordMutation = useMutation(
        (data: { current: string, new: string, repeat: string }) => {
            return axios.put(`${BASEURL}/user/password`, JSON.stringify(data))
        },
        {
            onSuccess: (data) => {
                console.log(data)
            },
            onError: (err) => {
                console.log(err)
            }
        }
    )

    const changePassword = (current: string, newP?: string, repeat?: string) => {
        if (!newP || !repeat) return
        passwordMutation.mutate({ current, repeat, new: newP })
    }

    const emailMutation = useMutation(
        (data: { email: string }) => {
            return axios.put(`${BASEURL}/user/email`, JSON.stringify(data))
        },
        {
            onSuccess: (data) => {
                console.log(data)
            },
            onError: (err) => {
                console.log(err)
            }
        }
    )

    const changeEmail = (email: string) => {
        emailMutation.mutate({ email })
    }

    const statusMutation = useMutation(
        (status: string) => {
            return axios.put(`${BASEURL}/user/request-status/${status}`)
        },
        {
            onSuccess: (data) => {
                console.log(data)
            },
            onError: (err) => {
                console.log(err)
            }
        }
    )
    const logout = useMutation(
        () => {
            return axios.post(`${BASEURL}/user/logout`)
        },
        {
            onSuccess: (data) => {
                console.log(data);

            },
            onError: (err) => {
                console.log(err);

            }
        }
    )
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
                        submit={changeName}
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
                        submit={changePassword}
                    />
                    <SettingInputItem
                        type="email"
                        title={localeTr.email.title}
                        placeholder={localeTr.email.placehoder}
                        actionTitle={localeTr.change}
                        submit={changeEmail}
                    />
                    <SettingRadio title={localeTr.opentorequest.title} options={[{ value: "ON", label: localeTr.opentorequest.yes }, { value: "OFF", label: localeTr.opentorequest.no }]} value={"ON"} handleChange={statusMutation.mutate} />
                    <SettingRadio title={localeTr.language.title} options={[{ value: "en", label: "English" }, { value: "es", label: "Español" }]} value={locale} handleChange={langChange} />
                    <SettingRadio title={localeTr.theme.title} options={[{ value: "light", label: localeTr.theme.light }, { value: "dark", label: localeTr.theme.dark }]} value={theme} handleChange={themeChange} />
                    <div className={styles.dangerousActionContainer}>
                        <button onClick={() => logout.mutate()}>{localeTr.logout}</button>
                        <button style={{ backgroundColor: "var(--error)", color: "white" }} onClick={() => setPrOpen(true)}>{localeTr.deleteacount}</button>
                    </div>
                </section>
                <Prompt
                    message="This action can't be reversed, Are you sure you want to delete your account"
                    dangerAction={true} open={prOpen}
                    acceptFun={() => { }}
                    close={() => setPrOpen(false)}
                />
            </div>
        </Modal>
    )
}

export const CoupleReportModal: React.FunctionComponent<{
    open: boolean,
    close: () => void
}> = ({ open, close }) => {
    const router = useRouter()
    const locale = router.locale || "en"
    const localeTr = tr[locale as Langs]
    return (
        <Modal
            isOpen={open}
            onRequestClose={close}
            style={modalStyles}
        >
            <div className={`${styles.modalBody} ${styles.editModal}`}>
                <div className={styles.requestHeader}>
                    <div className={styles.backIcon} onClick={close}>
                        <IoMdClose size={20} color="var(--accents-6)" />
                    </div>
                    <p>{localeTr.reportcouple}</p>
                    <button onClick={() => console.log("done")}
                        className={styles.saveButton}
                    >
                        {localeTr.send}
                    </button>
                </div>
                <ul className={`${styles.modalContent} ${styles.report}`}>
                    <li className={styles.reportItem}>
                        <input type="checkbox" id="adult" value={"adult content"}
                            className={styles.reportInput} />
                        <label htmlFor="adult">{localeTr.reports["1"]}</label>
                    </li>
                    <li className={styles.reportItem}>
                        <input type="checkbox" value={"adult content"}
                            id="harassment"
                            className={styles.reportInput} />
                        <label htmlFor="harassment">{localeTr.reports["2"]}</label>
                    </li>
                    <li className={styles.reportItem}>
                        <input type="checkbox" value={"adult content"}
                            id="violence"
                            className={styles.reportInput} />
                        <label htmlFor="violence">{localeTr.reports["3"]}</label>
                    </li>
                    <li className={styles.reportItem}>
                        <input type="checkbox" value={"adult content"}
                            id="fake"
                            className={styles.reportInput} />
                        <label htmlFor="fake">{localeTr.reports["4"]}</label>
                    </li>
                </ul>
            </div>
        </Modal>
    )
}

export const CoupleSettings: React.FunctionComponent<{
    open: boolean,
    close: () => void
}> = ({ open, close }) => {
    const router = useRouter()
    const locale = router.locale || "en"
    const localeTr = tr[locale as Langs]
    const visibility = "public"
    const [prOpen, setPrOpen] = useState(false)

    const changeNameMutation = useMutation(
        (data: { couple_name: string }) => {
            return axios.post(`${BASEURL}/couple/name`, JSON.stringify(data))
        },
        {
            onSuccess: (data) => {
                console.log(data)
            },
            onError: (err) => {
                console.log(err)
            }
        }
    )

    const changeCoupleName = (newName: string) => {
        changeNameMutation.mutate({ couple_name: newName })
    }

    const visibilityChange = (val: string) => {
        console.log(val);
    }

    const breakFastMutation = useMutation(
        () => {
            return axios.post(`${BASEURL}/couple/break-up`)
        },
        {
            onSuccess: (data) => {
                console.log(data)
            },
            onError: (err) => {
                console.log(err)
            }
        }
    )

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
                    <p>{localeTr.coupleheader}</p>
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
                        title={localeTr.couplename.title}
                        submit={changeCoupleName}
                        placeholder={localeTr.couplename.placehoder}
                        actionTitle={localeTr.change}
                    />
                    <SettingRadio
                        title={localeTr.visibility.title}
                        options={[{ value: "public", label: localeTr.visibility.public }, { value: "private", label: localeTr.visibility.private }]}
                        value={visibility} handleChange={visibilityChange}
                    />

                    <div className={styles.dangerousActionContainer}>
                        <button style={{ backgroundColor: "var(--error)", color: "white" }} onClick={() => setPrOpen(true)}>{localeTr.edoncast}</button>
                    </div>
                </section>
                <Prompt
                    message="Are you sure you want to deactivate couple profile"
                    dangerAction={true} open={prOpen}
                    acceptFun={breakFastMutation.mutate}
                    close={() => setPrOpen(false)}
                />
            </div>
        </Modal>
    )
}



const SettingInputItem: React.FunctionComponent<{
    type: string, title: string,
    submit: (val: string, val2?: string, val3?: string) => void,
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

    const showInputs = () => {
        iconRef.current!.classList.toggle(`${styles.show}`)
        containerRef.current!.classList.toggle(`${styles.expand}`)
    }

    const change = () => {
        if (type === "password") {
            submit(currentPassword, val, rNewPassword)
            return
        }
        submit(val)
    }
    return (
        <form onSubmit={(e) => e.preventDefault()} className={styles.itemContainer}>
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
                <button onClick={change}>{actionTitle}</button>
            </div>
        </form>
    )
}

const SettingRadio: React.FunctionComponent<{
    title: string,
    options: { value: string, label: string }[],
    value: string,
    handleChange: (val: string) => void
}> = ({ title, options, value, handleChange }) => {
    const [val, setVal] = useState(value)
    const iconRef = useRef<HTMLDivElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    const change = (e: ChangeEvent<HTMLInputElement>) => {
        setVal(e.currentTarget.value)
        handleChange(e.currentTarget.value)
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
                        return (
                            <div key={option.value} className={styles.inputContainerInner}>
                                <input type="radio" id={option.value} value={option.value} name={title} onChange={change} checked={val === option.value} />
                                <label htmlFor={option.value} style={{ background: `var(--${indx})` }}>{option.label}</label>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}