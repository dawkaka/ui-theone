import { useRouter } from "next/router"
import { BiArrowBack } from "react-icons/bi"
import styles from "./styles/header.module.css"

const Header: React.FunctionComponent<{ title: string, arrow: boolean }> = ({ title, arrow }) => {
    const { back } = useRouter()
    return (
        <div className={styles.container}>

            {arrow && (
                <div className={styles.backIcon} onClick={() => back()}>
                    <BiArrowBack size={20} />
                </div>
            )}
            <h3>{title}</h3>
        </div>
    )
}


export default Header 