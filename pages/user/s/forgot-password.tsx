import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { FormEvent, useState } from "react"
import { Loading } from "../../../components/mis"
import { BASEURL } from "../../../constants"
import styles from '../../../styles/loginsignup.module.css'

export default function ForgotPassword() {
    const [email, setEmail] = useState("")
    const [response, setResponse] = useState("")
    const mutation = useMutation(
        () => axios.post(`${BASEURL}/user/request-password-reset/${email}`),
        {
            onSuccess: () => {

            },
            onError: () => {

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
                <h1 style={{ marginBottom: "var(--gap)" }}>Forgot password?</h1>
                <p>Enter email associated with your account and we will send you a link to reset your password</p>
                {
                    response !== "" ? response === "SUCCESS" ?
                        <p>A password reset link has been sent to your email, click on it to change your password</p>
                        :
                        <p>Something went wrong, click the "Request password reset" button again</p>
                        :
                        null
                }
                <form onSubmit={submit} style={{ marginTop: "var(--gap)", display: "flex", flexDirection: "column" }}>

                    <div className={styles.formItem}>
                        <label htmlFor="reset-email">Email<span style={{ color: "red" }}>*</span></label>
                        <input
                            type="email"
                            placeholder={"Enter email"}
                            id="reset-email"
                            value={email}
                            onChange={(e) => setEmail(e.currentTarget.value)}
                            required />
                    </div>
                    <button style={{ padding: "var(--gap-half) var(--gap)", fontSize: "16px", display: "flex", justifyContent: "center" }}>{mutation.isLoading ? <Loading size="medium" color="white" /> : "Request password reset"}</button>
                </form>
            </div>
        </div >
    )
}