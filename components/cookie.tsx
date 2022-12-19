import { useRouter } from "next/router";
import * as React from "react";
import tr from "../i18n/locales/components/cookie.json"
import { Langs } from "../types";

const CookieBanner: React.FunctionComponent = () => {
    const router = useRouter()
    const locale = router.locale || "en"
    const localeTr = tr[locale as Langs]
    const [cookiesAccepted, setCookiesAccepted] = React.useState(false);
    React.useEffect(() => {
        const cookiesAccepted = localStorage.getItem("cookiesAccepted");
        if (cookiesAccepted === "true") {
            setCookiesAccepted(true);
        }
    }, []);

    const acceptCookies = () => {
        localStorage.setItem("cookiesAccepted", "true");
        setCookiesAccepted(true);
    };

    if (cookiesAccepted) {
        return null;
    }
    return (
        <div
            id="cookie-banner"
            style={{
                position: "fixed",
                bottom: "100px",
                left: "50%",
                transform: "translateX(-50%)",
                backgroundColor: "var(--background)",
                borderRadius: "10px",
                boxShadow: "0px 0px 10px var(--accents-1)",
                display: "flex",
                width: "min(95%,500px)",
                padding: "min(10vw, 25px) min(5vw, 50px)",
                flexDirection: "column",
                gap: "var(--gap)",
                textAlign: "center",
                justifyContent: "space-between",
                alignItems: "center",
            }}
        >
            <p style={{ fontSize: "18px", lineHeight: "150%" }}>
                {localeTr.text}
            </p>
            <button
                id="accept-cookies-button"
                onClick={acceptCookies}
                style={{
                    backgroundColor: "var(--success)",
                    border: "none",
                    borderRadius: "5px",
                    color: "white",
                    padding: "10px 20px",
                    fontSize: "14px",
                    cursor: "pointer"
                }}
            >
                {localeTr.accept}
            </button>
        </div>
    );
};
export default CookieBanner