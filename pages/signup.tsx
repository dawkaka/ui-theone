import { NextPage } from "next";
import Link from "next/link";
import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { isEmail, isPassword, isRealName, isUserName } from "../libs/validators";
import styles from "../styles/loginsignup.module.css"
import { ErrCodes, Langs } from "../types";
import tr from "../i18n/locales/signuplogin.json"
import { useRouter } from "next/router";

const Signup: NextPage = () => {
    const router = useRouter()
    const locale = router.locale || "en"
    const localeTr = tr[locale as Langs]

    const [step, setStep] = useState(true)
    const [updateUi, setUpdateUi] = useState(false)
    const [errMode, setErrMode] = useState(false)

    const dataRef = useRef({
        fName: "",
        lName: "",
        email: "",
        dob: "",
        userName: "",
        password: "",
        repeatPassword: ""
    })

    const errRef = useRef<{
        fNameErrs: ErrCodes,
        lNameErrs: ErrCodes,
        emailErrs: ErrCodes,
        dobErrs: ErrCodes,
        uNameErrs: ErrCodes,
        passwordErrs: ErrCodes,
        repeatPasswordErrs: ErrCodes
    }>({
        fNameErrs: [],
        lNameErrs: [],
        emailErrs: [],
        dobErrs: [],
        uNameErrs: [],
        passwordErrs: [],
        repeatPasswordErrs: []
    })

    const next = (e: FormEvent) => {
        e.preventDefault()
        if (hasErrors()) {
            return
        }
        setStep(false)
    }

    const hasErrors = () => {
        let f = errRef.current.fNameErrs.length < 1
        let l = errRef.current.lNameErrs.length < 1
        let e = errRef.current.emailErrs.length < 1
        let d = errRef.current.dobErrs.length < 1
        if (!f || !l || !e || !d) {
            return true
        }
        f = dataRef.current.fName !== ""
        l = dataRef.current.lName !== ""
        e = dataRef.current.email !== ""
        d = dataRef.current.dob !== ""
        if (!f || !l || !e || !d) {
            return true
        }
        return false
    }

    const signup = (e: FormEvent) => {
        e.preventDefault()
    }

    const back = (e: FormEvent) => {
        e.preventDefault()
        setStep(true)
    }

    const handleInputs = (e: ChangeEvent<HTMLInputElement>) => {
        const targ = e.currentTarget.name
        const value = e.currentTarget.value
        switch (targ) {
            case "first_name":
                let errs = isRealName(value)
                errRef.current.fNameErrs = errs
                dataRef.current.fName = value
                break;
            case "last_name":
                errs = isRealName(value)
                errRef.current.lNameErrs = errs
                dataRef.current.lName = value
                break;
            case "email":
                errs = isEmail(value)
                errRef.current.emailErrs = errs
                dataRef.current.email = value
                break;
            case "dob":
                dataRef.current.dob = value
                break;
            case "user_name":
                errs = isUserName(value)
                errRef.current.uNameErrs = errs
                dataRef.current.userName = value
                break;
            case "password":
                errs = isPassword(value)
                errRef.current.passwordErrs = errs
                dataRef.current.password = value
                break;
            case "repeat_password":
                if (dataRef.current.password !== value) {
                    errRef.current.repeatPasswordErrs = [0]
                } else {
                    errRef.current.repeatPasswordErrs = []
                }
                dataRef.current.repeatPassword = value
                break;
            default:
                break;
        }
        setUpdateUi(!updateUi)
    }

    return (
        <div className={styles.pageMain}>
            <main className={styles.main}>
                <div className={styles.deco}></div>
                <div className={styles.formContainer}>
                    <h2 style={{ textAlign: "center" }}>{localeTr.singup}</h2>
                    <div className={styles.indicatorsContainer}>
                        <form className={styles.form}>
                            {
                                step ? (
                                    <>
                                        <div className={styles.formItem}>
                                            <label htmlFor="firstname">{localeTr.firstname.title}</label>
                                            <input
                                                type="text"
                                                placeholder={localeTr.firstname.placeholder}
                                                name="first_name"
                                                required
                                                value={dataRef.current.fName}
                                                onChange={handleInputs}
                                            />
                                            <div className={styles.errorsContainer}>
                                                {
                                                    errRef.current.fNameErrs.map(val => {
                                                        return <p key={val} style={{ color: errMode ? "var(--error)" : "" }}>{localeTr.nameErrs[val]}</p>
                                                    })
                                                }
                                            </div>
                                        </div>
                                        <div className={styles.formItem}>
                                            <label htmlFor="lastname">{localeTr.lastname.title}</label>
                                            <input
                                                type="text"
                                                placeholder={localeTr.lastname.placeholder}
                                                name="last_name"
                                                required
                                                value={dataRef.current.lName}
                                                onChange={handleInputs}
                                            />
                                            <div className={styles.errorsContainer}>
                                                {
                                                    errRef.current.lNameErrs.map(val => {
                                                        return <p key={val} style={{ color: errMode ? "var(--error)" : "" }}>{localeTr.nameErrs[val]}</p>
                                                    })
                                                }
                                            </div>
                                        </div>
                                        <div className={styles.formItem}>
                                            <label htmlFor="email">{localeTr.email.title}</label>
                                            <input
                                                type="email"
                                                placeholder={localeTr.email.placeholder}
                                                name="email"
                                                value={dataRef.current.email}
                                                onChange={handleInputs}
                                            />
                                            <div className={styles.errorsContainer}>
                                                {
                                                    errRef.current.emailErrs.map(val => {
                                                        return <p key={val} style={{ color: errMode ? "var(--error)" : "" }}>{localeTr.email.errors[val]}</p>
                                                    })
                                                }
                                            </div>
                                        </div>
                                        <div className={styles.formItem}>
                                            <label htmlFor="dob">{localeTr.dob.title}</label>
                                            <input
                                                type="date"
                                                name="dob"
                                                onChange={handleInputs}
                                            />
                                            <div className={styles.errorsContainer}>
                                                {
                                                    errRef.current.dobErrs.map(val => {
                                                        return <p key={val} style={{ color: errMode ? "var(--error)" : "" }}>{localeTr.nameErrs[val]}</p>
                                                    })
                                                }
                                            </div>
                                        </div>
                                        <div style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            gap: "var(--gap-quarter)",
                                            marginTop: "40px"
                                        }}>
                                            <p>{localeTr.hasAccount} <Link href={"/login"} shallow><a style={{ color: "var(--success)" }}>{localeTr.login}</a></Link></p>
                                            <button onClick={next} style={{ opacity: hasErrors() ? .5 : 1 }}>{localeTr.next}</button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className={styles.formItem}>
                                            <label htmlFor="firstname">{localeTr.username.title}</label>
                                            <input
                                                type="text"
                                                placeholder={localeTr.username.placeholder}
                                                name="user_name"
                                                value={dataRef.current.userName}
                                                onChange={handleInputs}
                                            />
                                            <div className={styles.errorsContainer}>
                                                {
                                                    errRef.current.uNameErrs.map(val => {
                                                        return <p key={val} style={{ color: errMode ? "var(--error)" : "" }}>{localeTr.username.errors[val]}</p>
                                                    })
                                                }
                                            </div>
                                        </div>
                                        <div className={styles.formItem}>
                                            <label htmlFor="lastname" placeholder="Enter last name">{localeTr.password.title}</label>
                                            <input
                                                type="password"
                                                placeholder={localeTr.password.placeholder}
                                                name="password"
                                                required
                                                value={dataRef.current.password}
                                                onChange={handleInputs}
                                            />
                                            <div className={styles.errorsContainer}>
                                                {
                                                    errRef.current.passwordErrs.map(val => {
                                                        return <p key={val} style={{ color: errMode ? "var(--error)" : "" }}>{localeTr.password.errors[val]}</p>
                                                    })
                                                }
                                            </div>
                                        </div>
                                        <div className={styles.formItem}>
                                            <label htmlFor="email">{localeTr.repeatpassword.title}</label>
                                            <input
                                                type="password"
                                                placeholder={localeTr.repeatpassword.placeholder}
                                                name="repeat_password"
                                                required
                                                value={dataRef.current.repeatPassword}
                                                onChange={handleInputs}
                                            />
                                            <div className={styles.errorsContainer}>
                                                {
                                                    errRef.current.repeatPasswordErrs.map(val => {
                                                        return <p key={val} style={{ color: errMode ? "var(--error)" : "" }}>{localeTr.repeatpassword.errors[val]}</p>
                                                    })
                                                }
                                            </div>
                                        </div>

                                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "40px" }}>
                                            <button
                                                onClick={back}
                                                style={{
                                                    color: "var(--success)",
                                                    backgroundColor: "transparent",
                                                    border: "var(--border)"
                                                }}>{localeTr.back}</button>
                                            <button
                                                style={{ paddingBlock: "var(--gap-half)" }}
                                                onClick={signup}
                                            >
                                                {localeTr.singup}
                                            </button>
                                        </div>
                                    </>
                                )
                            }
                        </form>
                    </div>
                </div>
            </main >
        </div >
    )
}

export default Signup