import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useRef, useState } from "react"
import { CheckMark, Loading } from "../../components/mis"
import { BASEURL } from "../../constants"



export default function VerifyEmail() {
    const router = useRouter()
    const [id, setID] = useState("")
    const [response, setResponse] = useState("")
    const [time, setTime] = useState(30)

    useEffect(() => {
        if (router.query.id) {
            setID(router.query.id as string)
            router.replace('/r/verify-email', undefined, { shallow: true });
        }
    }, [router.query])

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
        const timerId = setInterval(() => setTime(time - 1), 1000);
        if (time <= 0) {
            setTime(0)
            clearInterval(timerId)
        }
        return () => clearInterval(timerId);
    }, [time])

    const resendEmail = () => {
        if (time > 0) return
        mutation.mutate()
    }

    return (
        <div>
            <div style={{ paddingTop: "20vh", paddingInline: "var(--gap)", width: "100vw", height: "100vh", backgroundColor: "var(--success)" }}>
                <div style={{ marginInline: "auto", backgroundColor: "var(--background)", borderRadius: "var(--radius-small)", boxShadow: "0 0 5px -1px var(--accents-5)", padding: "var(--gap) var(--gap-double)", maxWidth: "500px" }}>
                    <h1 style={{ marginBottom: "var(--gap-double)", textAlign: "center" }}>Email Verification Link</h1>

                    <div style={{ textAlign: "center", marginTop: "var(--gap)", display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--gap)" }}>
                        {response === "SUCCESS" ?
                            <>
                                <CheckMark size={50} />
                                <h4>Link resent</h4>
                                <p>If you still can't find the email, try signing up again and double check when entering the email</p>
                            </>
                            :
                            null
                        }
                        {
                            response === "ERROR" ?
                                <>
                                    <p>Something went wrong, trying signing up again.</p>
                                    <Link href="/signup"><a>Sign up</a></Link>
                                </> : null
                        }
                        {
                            response === "" ?
                                <>
                                    <p>Check your email and click on the verification link to verify the email, make sure to check your spam as well the link might be in there</p>
                                    <button style={{ padding: "var(--gap-half) var(--gap)", opacity: time > 0 ? 0.5 : 1 }} onClick={resendEmail}>Resend link</button>
                                    <p>Resend email in {time}s</p>
                                </>
                                :
                                null
                        }
                    </div>
                </div>
            </div >
        </div>
    )
}