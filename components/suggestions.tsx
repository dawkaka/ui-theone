import styles from "./styles/suggestions.module.css"
import CouplePreview from "./couplepreview"
import tr from "../i18n/locales/components/suggestions.json"
import { useRouter } from "next/router"
import { Langs } from "../types"

const Suggestions: React.FunctionComponent = () => {
    const router = useRouter()
    const locale = router.locale || "en"
    const localeTr = tr[locale as Langs]
    return (
        <section className={styles.suggestionsContainer}>
            <div className={styles.suggestionsWrapper}>
                <h1>{localeTr.header}</h1>
                <CouplePreview profile_picture="/me.jpg" name="Yukieforyoueyesbro" isFollowing={false} status="dating" verified={false} />
                <CouplePreview profile_picture="/me.jpg" name="Yukiesomething" isFollowing={false} status="married" verified />
                <CouplePreview profile_picture="/me.jpg" name="Yukbeeie" isFollowing status="married" verified={false} />
                <CouplePreview profile_picture="/me.jpg" name="Yukie" isFollowing={false} status="dating" verified />
                <CouplePreview profile_picture="/me.jpg" name="Yukielikesfor" isFollowing status="dating" verified={false} />
            </div>
        </section>
    )
}

export default Suggestions