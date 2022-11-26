import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { CheckMark, Loading } from "../../../components/mis"
import { BASEURL } from "../../../constants"



export default function VerifyEmail() {
    const router = useRouter()
    const [response, setResponse] = useState("")
    const mutation = useMutation(
        () => axios.post(`${BASEURL}/user/verify-signup/${router.query.id}`),
        {
            onSuccess: () => {
                setResponse("SUCCESS")
            },
            onError: () => {
                setResponse("ERROR")
            }
        }
    )

    useEffect(() => {
        mutation.mutate()
    }, [])

    return (
        <div>
            <div style={{ paddingTop: "20vh", paddingInline: "var(--gap)", width: "100vw", height: "100vh", backgroundColor: "var(--success)" }}>
                <div style={{ marginInline: "auto", backgroundColor: "var(--background)", borderRadius: "var(--radius-small)", boxShadow: "0 0 5px -1px var(--accents-5)", padding: "var(--gap) var(--gap-double)", maxWidth: "500px" }}>
                    <h1 style={{ marginBottom: "var(--gap-double)", textAlign: "center" }}>Verify Email</h1>
                    {
                        response !== "" && response === "SUCCESS" ?
                            <div style={{ textAlign: "center", marginTop: "var(--gap)", display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--gap)" }}>
                                <CheckMark size={50} />
                                <p>Email verified</p>
                                <button style={{ padding: "var(--gap-half) var(--gap)" }} onClick={() => router.replace("/r/home")}>Go to homepage</button>
                            </div>
                            :
                            <div style={{ textAlign: "center", marginTop: "var(--gap)", display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--gap)" }}>

                                <p style={{ color: "red", marginTop: "var(--gap)" }}>
                                    Something went wrong. This email may have been verified already or the link is invalid/expired
                                </p>
                                <button style={{ padding: "var(--gap-half) var(--gap)" }} onClick={() => router.replace("/r/home")}>Check if email is verified</button>
                            </div>
                    }
                    {
                        response === "" ? <div style={{ display: "flex", justifyContent: "center" }}><Loading color="var(--success)" size="large" /></div>
                            : null
                    }
                </div>
            </div >

        </div>
    )
}