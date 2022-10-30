import styles from "./styles/suggestions.module.css"
import CouplePreview from "./couplepreview"
import tr from "../i18n/locales/components/suggestions.json"
import { useRouter } from "next/router"
import { Langs } from "../types"
import { BASEURL, IMAGEURL } from "../constants"
import { useMutation, useQuery } from "@tanstack/react-query"
import axios from "axios"
import { Loading } from "./mis"
import React, { useState } from "react"
import { AiFillCloseCircle } from "react-icons/ai"

const Suggestions: React.FunctionComponent = () => {
    const router = useRouter()
    const locale = router.locale || "en"
    const localeTr = tr[locale as Langs]
    const { isLoading, data } = useQuery(["suggested"], () => axios.get(`${BASEURL}/couple/u/suggested-accounts`), { staleTime: Infinity })
    console.log(data)
    return (
        <section className={styles.suggestionsContainer}>
            <div className={styles.suggestionsWrapper}>
                <h1>{localeTr.header}</h1>
                {
                    isLoading && <Loading size="medium" color="var(--success)" />
                }
                {
                    data?.data.map((c: any) => (
                        <PreviewWithRemove node={<CouplePreview
                            profile_picture={`${IMAGEURL}/${c.profile_picture}`}
                            name={c.couple_name} isFollowing={false} married={c.married} verified={c.verified} />} name={c.couple_name} />
                    ))
                }
            </div>
        </section>
    )
}

const PreviewWithRemove: React.FC<{ node: React.ReactNode, name: string }> = ({ node, name }) => {
    const [removed, setRemoved] = useState(false)
    const mutation = useMutation(() => axios.post(`${BASEURL}/user/exempt/${name}`), { onSuccess: () => setRemoved(true) })

    if (removed) {
        return null
    }
    return (
        <div style={{ display: "flex", flexDirection: "column", position: "relative", marginBottom: "var(--gap-quarter)" }}>
            {
                node
            }
            <button onClick={() => mutation.mutate()}
                style={{
                    position: "absolute",
                    left: "50%", transform: "translateX(-50%)",
                    bottom: "-2px",
                    backgroundColor: "transparent", padding: 0
                }}
            >
                <AiFillCloseCircle size={25} color="var(--accents-2)" />
            </button>
        </div>
    )
}

export default Suggestions