import styles from "./styles/suggestions.module.css"
import CouplePreview from "./couplepreview"
import tr from "../i18n/locales/components/suggestions.json"
import { useRouter } from "next/router"
import { CouplePreviewT, Langs } from "../types"
import { BASEURL, IMAGEURL } from "../constants"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { Loading } from "./mis"
import React, { useState } from "react"
import { AiFillCloseCircle } from "react-icons/ai"

const Suggestions: React.FunctionComponent = () => {
    const router = useRouter()
    const locale = router.locale || "en"
    const localeTr = tr[locale as Langs]
    const queryClient = useQueryClient()
    const cacheKey = "suggested"
    const { isLoading, data } = useQuery([cacheKey], () => axios.get(`${BASEURL}/couple/u/suggested-accounts`).then(res => res.data), { staleTime: Infinity, retry: 3 })

    const updateCache = (couple_name: string) => {
        queryClient.setQueryData([cacheKey], (oldData: CouplePreviewT[] | undefined) => {
            if (oldData) {
                const newData = oldData.map((preview) => {
                    if (preview.couple_name === couple_name) {
                        return { ...preview, is_following: !preview.is_following }
                    }
                    return preview
                });
                return newData;
            }
            return []
        });
    }


    return (
        <section className={styles.suggestionsContainer}>
            <div className={styles.suggestionsWrapper}>
                <h1>{localeTr.header}</h1>
                {
                    isLoading ? <div style={{ width: "100%", display: "flex", justifyContent: "center" }}><Loading size="medium" color="var(--success)" /></div> : null
                }
                {
                    data?.map((c: any) => (
                        <PreviewWithRemove
                            key={c.couple_name}
                            node={
                                <CouplePreview
                                    key={c.couple_name}
                                    profile_picture={`${IMAGEURL}/${c.profile_picture}`}
                                    couple_name={c.couple_name} is_following={c.is_following} married={c.married} verified={c.verified}
                                    updateCache={() => updateCache(c.couple_name)}
                                />
                            }
                            name={c.couple_name}
                        />
                    ))
                }
            </div>
        </section>
    )
}

const PreviewWithRemove: React.FC<{ node: React.ReactNode, name: string }> = ({ node, name }) => {
    const [removed, setRemoved] = useState(false)
    const queryClient = useQueryClient()
    const mutation = useMutation(() => axios.post(`${BASEURL}/user/exempt/${name}`),
        {
            onSuccess: () => {
                setRemoved(true)
                queryClient.invalidateQueries(["suggested"])
            }
        })

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