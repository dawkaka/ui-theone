//6362f09b8efff794bd0ac691
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { useRouter } from "next/router"
import { FormEvent, useState } from "react"
import { CheckMark, Loading } from "../../components/mis"
import { BASEURL } from "../../constants"
import styles from "../../styles/loginsignup.module.css"
import tr from "../../i18n/locales/misc.json"
import { Langs } from "../../types"
import Head from "next/head"

export default function ResetPassword() {
    const router = useRouter()
    const locale = router.locale || "en"
    const localeTr = tr[locale as Langs]
    const [password, setPassword] = useState("")
    const [rpassword, setRPassword] = useState("")
    const [response, setResponse] = useState("")
    const { query, replace } = useRouter()
    const mutation = useMutation(
        (data: { password: string }) => axios.post(`${BASEURL}/user/reset-password/${query.id}`, JSON.stringify(data)),
        {
            onSuccess: () => {
                setResponse("SUCCESS")
            },
            onError: () => {
                setResponse("ERROR")
            }
        })
    const submit = (e: FormEvent) => {
        if (mutation.isLoading) return
        e.preventDefault()
        mutation.mutate({ password: password })
    }
    return (
        <div style={{ paddingTop: "20vh", paddingInline: "var(--gap)", width: "100vw", height: "100vh", backgroundColor: "var(--success)" }}>
            <Head>
                <title>{localeTr.resetpassword.header}</title>
                <meta name="robots" content="noindex,nofollow" />
            </Head>
            <div style={{ marginInline: "auto", backgroundColor: "var(--background)", borderRadius: "var(--radius-small)", boxShadow: "0 0 5px -1px var(--accents-5)", padding: "var(--gap) var(--gap-double)", maxWidth: "500px" }}>
                <h1 style={{ marginBottom: "var(--gap)" }}>{localeTr.resetpassword.header}</h1>
                <p>{localeTr.resetpassword.text}</p>
                {
                    response !== "" ? response === "SUCCESS" ?
                        <div style={{ textAlign: "center", marginTop: "var(--gap)", display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--gap-half)" }}>
                            <CheckMark size={50} />
                            <p>{localeTr.resetpassword.passwordresetted}</p>
                            <button style={{ padding: "var(--gap-quarter) var(--gap)" }} onClick={() => replace("/login")}>{localeTr.resetpassword.login}</button>
                        </div>
                        :
                        <p style={{ color: "red", marginTop: "var(--gap)" }}>{localeTr.resetpassword.somethingwentwrong}</p>
                        :
                        null
                }
                {
                    response === "SUCCESS" ? null : <form onSubmit={submit} style={{ marginTop: "var(--gap)", display: "flex", flexDirection: "column" }}>

                        <div className={styles.formItem}>
                            <label>{localeTr.resetpassword.first.label}<span style={{ color: "red" }}>*</span></label>
                            <input
                                type="password"
                                placeholder={localeTr.resetpassword.first.placeholder}
                                value={password}
                                onChange={(e) => setPassword(e.currentTarget.value)}
                                name="password" required />
                        </div>
                        <div className={styles.formItem}>
                            <label>{localeTr.resetpassword.second.label}<span style={{ color: "red" }}>*</span></label>
                            <input
                                type="password"
                                placeholder={localeTr.resetpassword.second.placeholder}
                                value={rpassword}
                                onChange={(e) => setRPassword(e.currentTarget.value)}
                                name="password" required />
                        </div>
                        <button style={{ padding: "var(--gap-half) var(--gap)", fontSize: "16px", display: "flex", justifyContent: "center" }}>{mutation.isLoading ? <Loading size="medium" color="white" /> : localeTr.resetpassword.resetpassword}</button>
                    </form>
                }
            </div>
        </div >
    )
}