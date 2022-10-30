import styles from "./styles/suggestions.module.css"
import CouplePreview from "./couplepreview"
import tr from "../i18n/locales/components/suggestions.json"
import { useRouter } from "next/router"
import { Langs } from "../types"
import { BASEURL, IMAGEURL } from "../constants"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { Loading } from "./mis"

const Suggestions: React.FunctionComponent = () => {
    const router = useRouter()
    const locale = router.locale || "en"
    const localeTr = tr[locale as Langs]
    const { isLoading, data } = useQuery(["suggested"], () => axios.get(`${BASEURL}/couple/u/suggested-accounts`), { staleTime: Infinity })

    return (
        <section className={styles.suggestionsContainer}>
            <div className={styles.suggestionsWrapper}>
                <h1>{localeTr.header}</h1>
                {
                    isLoading && <Loading size="medium" color="var(--success)" />
                }
                {
                    data?.data.map((c: any) => (
                        <CouplePreview
                            profile_picture={`${IMAGEURL}/${c.profile_picture}`}
                            name={c.couple_name} isFollowing={false} married={c.married} verified={c.verified} />
                    ))
                }
            </div>
        </section>
    )
}

export default Suggestions