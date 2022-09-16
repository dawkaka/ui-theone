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
        setStep(false)
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
                errs = isRealName(value)
                errRef.current.dobErrs = errs
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
                    errRef.current.repeatPasswordErrs = [1]
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
                    <h2 style={{ textAlign: "center" }}>Signup</h2>
                    <div className={styles.indicatorsContainer}>
                        <form className={styles.form}>
                            {
                                step ? (
                                    <>
                                        <div className={styles.formItem}>
                                            <label htmlFor="firstname">First name</label>
                                            <input
                                                type="text"
                                                placeholder="Enter first name"
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
                                            <label htmlFor="lastname" placeholder="Enter last name">Last name</label>
                                            <input
                                                type="text"
                                                placeholder="Enter last name"
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
                                            <label htmlFor="email">Email</label>
                                            <input
                                                type="email"
                                                placeholder="Enter email"
                                                name="email" required
                                                value={dataRef.current.email}
                                                onChange={handleInputs}
                                            />
                                            <div className={styles.errorsContainer}>
                                                {
                                                    errRef.current.emailErrs.map(val => {
                                                        return <p key={val} style={{ color: errMode ? "var(--error)" : "" }}>{localeTr.nameErrs[val]}</p>
                                                    })
                                                }
                                            </div>
                                        </div>
                                        <div className={styles.formItem}>
                                            <label htmlFor="dob">Birth date</label>
                                            <input
                                                type="date"
                                                name="date_of_birth"
                                                value={dataRef.current.dob}
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
                                            <p>Already have an account ? <Link href={"/login"} shallow><a style={{ color: "var(--success)" }}>Login</a></Link></p>
                                            <button onClick={next}>Next</button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className={styles.formItem}>
                                            <label htmlFor="firstname">User name</label>
                                            <input
                                                type="text"
                                                placeholder="Choose user name"
                                                name="user_name"
                                                value={dataRef.current.userName}
                                                onChange={handleInputs}
                                            />
                                            <div className={styles.errorsContainer}>
                                                {
                                                    errRef.current.uNameErrs.map(val => {
                                                        return <p key={val} style={{ color: errMode ? "var(--error)" : "" }}>{localeTr.nameErrs[val]}</p>
                                                    })
                                                }
                                            </div>
                                        </div>
                                        <div className={styles.formItem}>
                                            <label htmlFor="lastname" placeholder="Enter last name">Password</label>
                                            <input
                                                type="password"
                                                placeholder="Enter password"
                                                name="password"
                                                required
                                                value={dataRef.current.password}
                                                onChange={handleInputs}
                                            />
                                            <div className={styles.errorsContainer}>
                                                {
                                                    errRef.current.passwordErrs.map(val => {
                                                        return <p key={val} style={{ color: errMode ? "var(--error)" : "" }}>{localeTr.nameErrs[val]}</p>
                                                    })
                                                }
                                            </div>
                                        </div>
                                        <div className={styles.formItem}>
                                            <label htmlFor="email">Repeat password</label>
                                            <input
                                                type="password"
                                                placeholder="Repeat password"
                                                name="repeat_password"
                                                required
                                                value={dataRef.current.repeatPassword}
                                                onChange={handleInputs}
                                            />
                                            <div className={styles.errorsContainer}>
                                                {
                                                    errRef.current.repeatPasswordErrs.map(val => {
                                                        return <p key={val} style={{ color: errMode ? "var(--error)" : "" }}>{localeTr.nameErrs[val]}</p>
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
                                                }}>Back</button>
                                            <button
                                                style={{ paddingBlock: "var(--gap-half)" }}
                                                onClick={signup}
                                            >
                                                Sign up
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