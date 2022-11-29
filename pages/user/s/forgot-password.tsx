import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { useRouter } from "next/router"
import { FormEvent, useState } from "react"
import { CheckMark, Loading } from "../../../components/mis"
import { BASEURL } from "../../../constants"
import styles from '../../../styles/loginsignup.module.css'
import tr from "../../../i18n/locales/misc.json"
import { Langs } from "../../../types"
export default function ForgotPassword() {
    const router = useRouter()
    const locale = router.locale || "en"
    const localeTr = tr[locale as Langs]
    const [email, setEmail] = useState("")
    const [response, setResponse] = useState("")
    const mutation = useMutation(
        () => axios.post(`${BASEURL}/user/request-password-reset/${email}`),
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
        mutation.mutate()
    }
    return (
        <div style={{ paddingTop: "20vh", paddingInline: "var(--gap)", width: "100vw", height: "100vh", backgroundColor: "var(--success)" }}>
            <div style={{ marginInline: "auto", backgroundColor: "var(--background)", borderRadius: "var(--radius-small)", boxShadow: "0 0 5px -1px var(--accents-5)", padding: "var(--gap) var(--gap-double)", maxWidth: "500px" }}>
                <h1 style={{ marginBottom: "var(--gap)" }}>{localeTr.forgotpassword.header}</h1>
                <p>{localeTr.forgotpassword.text}</p>
                {
                    response !== "" ? response === "SUCCESS" ?
                        <div style={{ textAlign: "center", marginTop: "var(--gap)", display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--gap-half)" }}>
                            <CheckMark size={50} />
                            <p>{localeTr.forgotpassword.success}</p>
                        </div>
                        :
                        <p style={{ color: "red", marginTop: "var(--gap)" }}>{localeTr.forgotpassword.somethingwentwrong}</p>
                        :
                        null
                }
                {
                    response === "SUCCESS" ? null : <form onSubmit={submit} style={{ marginTop: "var(--gap)", display: "flex", flexDirection: "column" }}>

                        <div className={styles.formItem}>
                            <label htmlFor="reset-email">{localeTr.forgotpassword.input.label}<span style={{ color: "red" }}>*</span></label>
                            <input
                                type="email"
                                placeholder={localeTr.forgotpassword.input.placeholder}
                                id="reset-email"
                                value={email}
                                onChange={(e) => setEmail(e.currentTarget.value)}
                                required />
                        </div>
                        <button style={{ padding: "var(--gap-half) var(--gap)", fontSize: "16px", display: "flex", justifyContent: "center" }}>{mutation.isLoading ? <Loading size="medium" color="white" /> : localeTr.forgotpassword.requestpasswordreset}</button>
                    </form>
                }
            </div>
        </div >
    )
}