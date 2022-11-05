import { ChangeEvent, FormEvent, MouseEventHandler, useContext, useEffect, useMemo, useRef, useState } from "react"
import Modal from "react-modal";
import { IoMdClose } from "react-icons/io";
import styles from "./styles/settings.module.css"
import { FaCaretDown } from "react-icons/fa";
import { useRouter } from "next/router";
import tr from "../i18n/locales/components/settings.json"
import { Langs, MutationResponse } from "../types"
import { Theme } from "emoji-picker-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError, AxiosResponse } from "axios";
import { BASEURL } from "../constants";
import { isPassword } from "../libs/validators";
import { Prompt } from "./prompt";
import { ToasContext } from "./context";
import { Loading } from "./mis";
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
    const notify = useContext(ToasContext)
    const queryclient = useQueryClient()

    const locale = router.locale || "en"
    const localeTr = tr[locale as Langs]

    const changeNameMutation = useMutation<AxiosResponse, AxiosError<any, any>, { user_name: string }>(
        (data) => {
            return axios.put(`${BASEURL}/user/name`, JSON.stringify(data))
        },
        {
            onSuccess: (data) => {
                const { message, type } = data.data as MutationResponse
                notify!.notify(message, type)
                queryclient.invalidateQueries(["startup"])
            },
            onError: (err) => {
                notify!.notify(err.response?.data.message, "ERROR")
            }
        }
    )

    const changeName = (newName: string) => {
        if (newName.length < 4 || changeNameMutation.isLoading) return
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



    const langMutation = useMutation<AxiosResponse, AxiosError<any, any>, string>(
        (lang) => {
            return axios.patch(`${BASEURL}/user/settings/language/${lang}`)
        },
        {
            onSuccess: (data) => {
                const { message, type } = data.data as MutationResponse
                notify!.notify(message, type)
            },
            onError: (err) => {
                notify!.notify(err.response?.data.message, "ERROR")
            }
        }
    )


    const langChange = (lang: string) => {
        router.replace("/user/[name]", asPath, { locale: lang })
        langMutation.mutate(lang)
    }

    const passwordMutation = useMutation<AxiosResponse, AxiosError<any, any>, { current: string, new: string, repeat: string }>(
        (data) => {
            return axios.put(`${BASEURL}/user/password`, JSON.stringify(data))
        },
        {
            onSuccess: (data) => {
                const { message, type } = data.data as MutationResponse
                notify!.notify(message, type)
            },
            onError: (err) => {
                notify!.notify(err.response?.data.message, "ERROR")
            }
        }
    )

    const changePassword = (current: string, newP?: string, repeat?: string) => {
        if (!newP || !repeat) return
        passwordMutation.mutate({ current, repeat, new: newP })
    }

    const emailMutation = useMutation<AxiosResponse, AxiosError<any, any>, { email: string }>(
        (data) => {
            return axios.put(`${BASEURL}/user/email`, JSON.stringify(data))
        },
        {
            onSuccess: (data) => {
                const { message, type } = data.data as MutationResponse
                notify!.notify(message, type)
            },
            onError: (err) => {
                notify!.notify(err.response?.data.message, "ERROR")
            }
        }
    )

    const changeEmail = (email: string) => {
        emailMutation.mutate({ email })
    }

    const statusMutation = useMutation<AxiosResponse, AxiosError<any, any>, string>(
        (status) => {
            return axios.put(`${BASEURL}/user/request-status/${status}`)
        },
        {
            onSuccess: (data) => {
                const { message, type } = data.data as MutationResponse
                notify!.notify(message, type)
            },
            onError: (err) => {
                notify!.notify(err.response?.data.message, "ERROR")
            }
        }
    )
    const logout = useMutation<AxiosResponse, AxiosError<any, any>>(
        () => {
            return axios.post(`${BASEURL}/user/logout`)
        },
        {
            onSuccess: (data) => {
                const { message, type } = data.data as MutationResponse
                notify!.notify(message, type)

            },
            onError: (err) => {
                notify!.notify(err.response?.data.message, "ERROR")
            }
        }
    )
    return (
        <Modal
            closeTimeoutMS={200}
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
                        isChanging={changeNameMutation.isLoading}
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
                        isChanging={passwordMutation.isLoading}
                    />
                    <SettingInputItem
                        type="email"
                        title={localeTr.email.title}
                        placeholder={localeTr.email.placehoder}
                        actionTitle={localeTr.change}
                        submit={changeEmail}
                        isChanging={emailMutation.isLoading}
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
                    title={localeTr.deleteacc.title}
                    message={localeTr.deleteacc.message}
                    actionText={localeTr.deleteacc.actiontext}
                    cancelText={localeTr.deleteacc.canceltext} dangerAction={true} open={prOpen}
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
            closeTimeoutMS={200}
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
    close: () => void,
    married: boolean
}> = ({ open, close, married }) => {
    const router = useRouter()
    const locale = router.locale || "en"
    const localeTr = tr[locale as Langs]
    const [prOpen, setPrOpen] = useState(false)
    const notify = useContext(ToasContext)


    const changeNameMutation = useMutation<AxiosResponse, AxiosError<any, any>, { couple_name: string }>(
        (data) => {
            return axios.post(`${BASEURL}/couple/name`, JSON.stringify(data))
        },
        {
            onSuccess: (data) => {
                const { message, type } = data.data as MutationResponse
                notify!.notify(message, type)
            },
            onError: (err) => {
                notify?.notify(err.response?.data.message, "ERROR")
            }
        }
    )

    const changeCoupleName = (newName: string) => {
        if (newName.length < 4 || changeNameMutation.isLoading) return
        changeNameMutation.mutate({ couple_name: newName })
    }


    const statusMutation = useMutation<AxiosResponse, AxiosError<any, any>, string>(
        (val) => {
            return axios.post(`${BASEURL}/couple/status/${val}`)
        },
        {
            onSuccess: (data) => {
                const { message, type } = data.data as MutationResponse
                notify!.notify(message, type)
            },
            onError: (err) => {
                notify?.notify(err.response?.data.message, "ERROR")
            }
        }
    )

    const statusChange = (val: string) => {
        statusMutation.mutate(val)
    }


    const breakFastMutation = useMutation<AxiosResponse, AxiosError<any, any>>(
        () => {
            return axios.post(`${BASEURL}/couple/break-up`)
        },
        {
            onSuccess: (data) => {
                const { message, type } = data.data as MutationResponse
                notify!.notify(message, type)
            },
            onError: (err) => {
                notify?.notify(err.response?.data.message, "ERROR")
            }
        }
    )

    return (
        <Modal
            closeTimeoutMS={200}
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
                        isChanging={changeNameMutation.isLoading}
                    />
                    {/* <SettingRadio
                        title={localeTr.visibility.title}
                        options={[{ value: "public", label: localeTr.visibility.public }, { value: "private", label: localeTr.visibility.private }]}
                        value={visibility} handleChange={visibilityChange}
                    /> */}
                    <SettingRadio
                        title={localeTr.married.title}
                        options={[{ value: "YES", label: localeTr.married.yes }, { value: "NO", label: localeTr.married.no }]}
                        value={married ? "YES" : "NO"} handleChange={statusChange}
                    />

                    <div className={styles.dangerousActionContainer}>
                        <button style={{ backgroundColor: "var(--error)", color: "white" }} onClick={() => setPrOpen(true)}>{localeTr.edoncast}</button>
                    </div>
                </section>
                <Prompt
                    title={localeTr.breakup.title}
                    message={localeTr.breakup.message}
                    actionText={localeTr.breakup.actiontext}
                    cancelText={localeTr.breakup.canceltext}
                    dangerAction={true}
                    open={prOpen}
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
    isChanging: boolean,
    actionTitle: string
}> = ({ placeholder, type, title, submit, actionTitle, placeholderCurrent, placeholderRepeat, isChanging }) => {
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
        } else {
            submit(val)
        }
    }

    const inputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setVal(e.currentTarget.value)
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
                <input type={type} value={val} placeholder={placeholder} onChange={inputChange} />
                {
                    placeholderRepeat ?
                        <input type={type} value={rNewPassword} placeholder={placeholderRepeat} onChange={(e) => setRNewPassword(e.currentTarget.value)} />
                        :
                        null
                }
                {isChanging ? <Loading size="small" color="var(--success)" /> : <button onClick={change}>{actionTitle}</button>}
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