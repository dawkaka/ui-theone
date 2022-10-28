import React, { FormEvent, useState } from "react";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import styles from "../styles/loginsignup.module.css"
import { Langs } from "../types";
import tr from "../i18n/locales/signuplogin.json"
import { BASEURL } from "../constants";
import { Loading } from "../components/mis";

const Login: NextPage = () => {
    const [emailOrUsername, setEmailOrUserName] = useState("")
    const [password, setPassword] = useState("")
    const router = useRouter()
    const locale = router.locale || "en"
    const localeTr = tr[locale as Langs]

    const hasErrors = password === "" || emailOrUsername === "" ? true : false

    const mutation = useMutation((data: { user_name_or_email: string, password: string }) => {
        const d = JSON.stringify(data)
        return axios.post(`${BASEURL}/user/u/login`, d)
    })

    const login = (e: FormEvent) => {
        e.preventDefault()
        if (hasErrors || mutation.isLoading) return
        mutation.mutate({ user_name_or_email: emailOrUsername, password: password })
    }
    return (
        <div className={styles.pageMain}>
            <main className={styles.main}>
                <div className={styles.deco}></div>
                <div className={styles.formContainer}>
                    <h2 style={{ textAlign: "center" }}>{localeTr.login}</h2>
                    <div className={styles.indicatorsContainer}>
                        <form className={styles.form} onSubmit={login}>
                            {mutation.isError && mutation.error instanceof AxiosError ? <p style={{ color: "red", fontSize: "14px", marginBottom: "10px" }}>{mutation.error.response?.data.message}</p> : null}

                            <div className={styles.formItem}>
                                <label>{localeTr.usernameoremail.title}</label>
                                <input type="text" placeholder={localeTr.usernameoremail.placeholder} name="user_name_or_email" required value={emailOrUsername}
                                    onChange={(e) => setEmailOrUserName(e.currentTarget.value)} />
                            </div>
                            <div className={styles.formItem}>
                                <label>{localeTr.password.title}</label>
                                <input
                                    type="password"
                                    placeholder={localeTr.password.placeholder}
                                    value={password}
                                    onChange={(e) => setPassword(e.currentTarget.value)}
                                    name="password" required />
                                <small style={{ color: "var(--success)" }}>{localeTr.forgotpassword}</small>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", marginTop: "40px", gap: "var(--gap)" }}>
                                <button
                                    style={{ paddingBlock: "var(--gap-half)", opacity: hasErrors ? .5 : 1, display: "flex", justifyContent: "center" }}
                                >
                                    {mutation.isLoading ? <Loading color="white" size="small" /> : localeTr.login}
                                </button>
                                <p>{localeTr.hasnoaccount} <Link href={"/signup"} shallow><a style={{ color: "var(--success)" }}>{localeTr.singup}</a></Link></p>
                            </div>

                        </form>
                    </div>
                </div>
            </main >
        </div >
    )
}

export default Login