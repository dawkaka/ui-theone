import {
    ImHeartBroken
} from "react-icons/im"



export const NotFound: React.FC<{ message: string }> = ({ message }) => {
    return (
        <div style={{ margin: "var(--gap)", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div >
                <ImHeartBroken color="var(--accents-2)" size={150} />
            </div>
            <h3 style={{ marginTop: 'var(--gap)', color: "var(--accents-6)" }}>{message}</h3>
            <p></p>
        </div>
    )
}