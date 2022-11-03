//6362f09b8efff794bd0ac691
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { useRouter } from "next/router"
import { FormEvent, useState } from "react"
import { CheckMark, Loading } from "../../components/mis"
import { BASEURL } from "../../constants"
import styles from "../../styles/loginsignup.module.css"

export default function ResetPassword() {
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
            <div style={{ marginInline: "auto", backgroundColor: "var(--background)", borderRadius: "var(--radius-small)", boxShadow: "0 0 5px -1px var(--accents-5)", padding: "var(--gap) var(--gap-double)", maxWidth: "500px" }}>
                <h1 style={{ marginBottom: "var(--gap)" }}>Reset Password!</h1>
                <p>Enter new password to be  associated with your account</p>
                {
                    response !== "" ? response === "SUCCESS" ?
                        <div style={{ textAlign: "center", marginTop: "var(--gap)", display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--gap-half)" }}>
                            <CheckMark size={50} />
                            <p>Password has been reset successfully </p>
                            <button style={{ padding: "var(--gap-quarter) var(--gap)" }} onClick={() => replace("/login")}>Login</button>
                        </div>
                        :
                        <p style={{ color: "red", marginTop: "var(--gap)" }}>Something went wrong, check your  and try button again</p>
                        :
                        null
                }
                {
                    response === "SUCCESS" ? null : <form onSubmit={submit} style={{ marginTop: "var(--gap)", display: "flex", flexDirection: "column" }}>

                        <div className={styles.formItem}>
                            <label>Password<span style={{ color: "red" }}>*</span></label>
                            <input
                                type="password"
                                placeholder={"Enter password"}
                                value={password}
                                onChange={(e) => setPassword(e.currentTarget.value)}
                                name="password" required />
                        </div>
                        <div className={styles.formItem}>
                            <label>Repeat password<span style={{ color: "red" }}>*</span></label>
                            <input
                                type="password"
                                placeholder="Repeat password"
                                value={rpassword}
                                onChange={(e) => setRPassword(e.currentTarget.value)}
                                name="password" required />
                        </div>
                        <button style={{ padding: "var(--gap-half) var(--gap)", fontSize: "16px", display: "flex", justifyContent: "center" }}>{mutation.isLoading ? <Loading size="medium" color="white" /> : "Reset password"}</button>
                    </form>
                }
            </div>
        </div >
    )
}