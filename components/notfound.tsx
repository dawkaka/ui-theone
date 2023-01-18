import { useRouter } from "next/router"
import {
    ImHeartBroken
} from "react-icons/im"

import tr from "../i18n/locales/components/notfound.json"
import { Langs, NotFoundT } from "../types"


export const NotFound: React.FC<{ type: NotFoundT }> = ({ type }) => {
    const router = useRouter()
    const locale = router.locale || "en"
    const localeTr = tr[locale as Langs]

    return (
        <div style={{ margin: "var(--gap)", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div >
                <ImHeartBroken color="var(--accents-2)" size={150} />
            </div>
            <h3 style={{ marginTop: 'var(--gap)', color: "var(--foreground)", textAlign: "center" }}>{localeTr[type].title}</h3>
            <p style={{ marginTop: "10px", textAlign: "center", color: "var(--accents-5)" }}>{localeTr[type].message}</p>
        </div>
    )
}