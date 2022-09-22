import { NextPage } from "next";
import Link from "next/link";
import { ChangeEvent, FormEvent, FormEventHandler, useRef, useState } from "react";
import { isEmail, isPassword, isRealName, isUserName } from "../libs/validators";
import styles from "../styles/loginsignup.module.css"
import { ErrCodes, Langs, Signup } from "../types";
import tr from "../i18n/locales/signuplogin.json"
import { useRouter } from "next/router";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

const Signup: NextPage = () => {
    const router = useRouter()
    const locale = router.locale || "en"
    const localeTr = tr[locale as Langs]

    const [step, setStep] = useState(true)
    const [updateUi, setUpdateUi] = useState(false)
    const [errMode, setErrMode] = useState(false)

    const dataRef = useRef<Signup>({
        first_name: "",
        last_name: "",
        email: "",
        date_of_birth: "",
        user_name: "",
        password: "",
        repeat_password: ""
    })

    const errRef = useRef<{
        first_nameErrs: ErrCodes,
        last_nameErrs: ErrCodes,
        emailErrs: ErrCodes,
        date_of_birthErrs: ErrCodes,
        uNameErrs: ErrCodes,
        passwordErrs: ErrCodes,
        repeat_passwordErrs: ErrCodes
    }>({
        first_nameErrs: [],
        last_nameErrs: [],
        emailErrs: [],
        date_of_birthErrs: [],
        uNameErrs: [],
        passwordErrs: [],
        repeat_passwordErrs: []
    })

    const next = (e: FormEvent) => {
        e.preventDefault()
        if (hasErrors()) {
            return
        }
        setStep(false)
    }

    const hasErrors = () => {
        let f = errRef.current.first_nameErrs.length < 1
        let l = errRef.current.last_nameErrs.length < 1
        let e = errRef.current.emailErrs.length < 1
        let d = errRef.current.date_of_birthErrs.length < 1
        if (!f || !l || !e || !d) {
            return true
        }
        f = dataRef.current.first_name !== ""
        l = dataRef.current.last_name !== ""
        e = dataRef.current.email !== ""
        d = dataRef.current.date_of_birth !== ""
        if (!f || !l || !e || !d) {
            return true
        }
        return false
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
                errRef.current.first_nameErrs = errs
                dataRef.current.first_name = value
                break;
            case "last_name":
                errs = isRealName(value)
                errRef.current.last_nameErrs = errs
                dataRef.current.last_name = value
                break;
            case "email":
                errs = isEmail(value)
                errRef.current.emailErrs = errs
                dataRef.current.email = value
                break;
            case "date_of_birth":
                dataRef.current.date_of_birth = value + "T00:00:00Z"
                break;
            case "user_name":
                errs = isUserName(value)
                errRef.current.uNameErrs = errs
                dataRef.current.user_name = value
                break;
            case "password":
                errs = isPassword(value)
                errRef.current.passwordErrs = errs
                dataRef.current.password = value
                break;
            case "repeat_password":
                if (dataRef.current.password !== value) {
                    errRef.current.repeat_passwordErrs = [0]
                } else {
                    errRef.current.repeat_passwordErrs = []
                }
                dataRef.current.repeat_password = value
                break;
            default:
                break;
        }
        setUpdateUi(!updateUi)
    }

    const mutation = useMutation((data: Signup) => {
        const dataJSON = JSON.stringify(data)
        console.log(dataJSON)
        return axios.post("http://localhost:8080/user/u/signup", dataJSON)
    })

    const signup = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        mutation.mutate(dataRef.current)
    }

    return (
        <div className={styles.pageMain}>
            <main className={styles.main}>
                <div className={styles.deco}></div>
                <div className={styles.formContainer}>
                    <h2 style={{ textAlign: "center" }}>{localeTr.singup}</h2>
                    <div className={styles.indicatorsContainer}>
                        {mutation.isLoading && <p>shipping</p>}
                        <form className={styles.form} onSubmit={signup}>
                            {mutation.isError && (
                                <div>
                                    {mutation.error instanceof AxiosError ? mutation.error.response?.data.errors?.map((err: string) => <p style={{ fontSize: 12, color: "red" }}>{err}</p>) : null}
                                </div>
                            )}
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
                                                value={dataRef.current.first_name}
                                                onChange={handleInputs}
                                            />
                                            <div className={styles.errorsContainer}>
                                                {
                                                    errRef.current.first_nameErrs.map(val => {
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
                                                value={dataRef.current.last_name}
                                                onChange={handleInputs}
                                            />
                                            <div className={styles.errorsContainer}>
                                                {
                                                    errRef.current.last_nameErrs.map(val => {
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
                                            <label htmlFor="date_of_birth">{localeTr.dob.title}</label>
                                            <input
                                                type="date"
                                                name="date_of_birth"
                                                onChange={handleInputs}
                                            />
                                            <div className={styles.errorsContainer}>
                                                {
                                                    errRef.current.date_of_birthErrs.map(val => {
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
                                                value={dataRef.current.user_name}
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
                                                value={dataRef.current.repeat_password}
                                                onChange={handleInputs}
                                            />
                                            <div className={styles.errorsContainer}>
                                                {
                                                    errRef.current.repeat_passwordErrs.map(val => {
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