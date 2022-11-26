import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { useRouter } from "next/router"
import { useEffect, useRef, useState } from "react"
import { CheckMark, Loading } from "../../components/mis"
import { BASEURL } from "../../constants"



export default function VerifyEmail() {
    const router = useRouter()
    const [id, setID] = useState("")
    const [response, setResponse] = useState("")
    const mutation = useMutation(
        () => axios.post(`${BASEURL}/user/resend-verification-link/${id}`),
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
        if (router.query.id) {
            setID(router.query.id as string)
            router.replace('/r/verify-email', undefined, { shallow: true });
        }
    }, [router.query])

    return (
        <div>
            <div style={{ paddingTop: "20vh", paddingInline: "var(--gap)", width: "100vw", height: "100vh", backgroundColor: "var(--success)" }}>
                <div style={{ marginInline: "auto", backgroundColor: "var(--background)", borderRadius: "var(--radius-small)", boxShadow: "0 0 5px -1px var(--accents-5)", padding: "var(--gap) var(--gap-double)", maxWidth: "500px" }}>
                    <h1 style={{ marginBottom: "var(--gap-double)", textAlign: "center" }}>Email Verification Link</h1>

                    <div style={{ textAlign: "center", marginTop: "var(--gap)", display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--gap)" }}>
                        <CheckMark size={50} />
                        <p>Check your email and click on the verification link to verify the email, make sure to check your spam as well the link might be in there</p>
                        <button style={{ padding: "var(--gap-half) var(--gap)" }} onClick={() => router.replace("/r/home")}>Resend link</button>
                    </div>
                </div>
            </div >

        </div>
    )
}