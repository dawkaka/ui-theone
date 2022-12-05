import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import Head from "next/head"
import { useRouter } from "next/router"
import { useEffect, useRef, useState } from "react"
import { CheckMark, Loading } from "../../../components/mis"
import { BASEURL } from "../../../constants"
import tr from "../../../i18n/locales/misc.json"
import { Langs } from "../../../types"


export default function VerifyEmail() {
    const router = useRouter()
    const locale = router.locale || "en"
    const localeTr = tr[locale as Langs]
    const [response, setResponse] = useState("")
    const sentRef = useRef(false)

    const mutation = useMutation(
        () => axios.post(`${BASEURL}/user/verify-signup/${router.query.id}`),
        {
            onSuccess: () => {
                setResponse("SUCCESS")
            },
            onError: () => {
                setResponse("ERROR")
            },
            onSettled: () => {
                sentRef.current = true
            }
        }
    )

    if (router.query.id && !sentRef.current) {
        sentRef.current = true
        mutation.mutate()
    }

    return (
        <div>
            <Head>
                <title>{localeTr.verifyemail.header}</title>
                <meta name="robots" content="noindex,nofollow" />
            </Head>
            <div style={{ paddingTop: "20vh", paddingInline: "var(--gap)", width: "100vw", height: "100vh", backgroundColor: "var(--success)" }}>
                <div style={{ marginInline: "auto", backgroundColor: "var(--background)", borderRadius: "var(--radius-small)", boxShadow: "0 0 5px -1px var(--accents-5)", padding: "var(--gap) var(--gap-double)", maxWidth: "500px" }}>
                    <h1 style={{ marginBottom: "var(--gap-double)", textAlign: "center" }}>{localeTr.verifyemail.header}</h1>
                    {
                        response !== "" && response === "SUCCESS" ?
                            <div style={{ textAlign: "center", marginTop: "var(--gap)", display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--gap)" }}>
                                <CheckMark size={50} />
                                <p>{localeTr.verifyemail.verified}</p>
                                <button style={{ padding: "var(--gap-half) var(--gap)" }} onClick={() => router.replace("/r/home")}>{localeTr.verifyemail.gotohomepage}</button>
                            </div>
                            :
                            <div style={{ textAlign: "center", marginTop: "var(--gap)", display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--gap)" }}>

                                <p style={{ color: "red", marginTop: "var(--gap)" }}>
                                    {localeTr.verifyemail.somethingwentwrong}
                                </p>
                                <button style={{ padding: "var(--gap-half) var(--gap)" }} onClick={() => router.replace("/r/home")}>{localeTr.verifyemail.check}</button>
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