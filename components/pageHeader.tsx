import styles from "./styles/header.module.css"

const Header: React.FunctionComponent<{ title: string }> = ({ title }) => {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>{title}</h1>
            </div>
        </div>
    )
}


export default Header 