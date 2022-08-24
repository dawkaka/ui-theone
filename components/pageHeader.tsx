import styles from "./styles/header.module.css"

const Header: React.FunctionComponent<{ title: string }> = ({ title }) => {
    return (
        <div className={styles.container}>
            <h1>{title}</h1>
        </div>
    )
}


export default Header 