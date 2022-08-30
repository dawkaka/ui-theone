import styles from "./styles/suggestions.module.css"
import CouplePreview from "./couplepreview"

const Suggestions: React.FunctionComponent = () => {
    return (
        <section className={styles.suggestionsContainer}>
            <div className={styles.suggestionsWrapper}>
                <h1>Suggestions</h1>
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