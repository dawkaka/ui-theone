import { FunctionComponent, ReactElement, ReactNode } from "react";
import styles from "./styles/layout.module.css"
import Navigation from "./navigation";

const Layout: FunctionComponent<{ children: ReactNode }> = ({ children }) => {
    return (
        <div className={styles.mainWrapper}>
            <header>
                <Navigation />
            </header>
            <main className={styles.container}>
                {children}
            </main>
        </div>
    )
}

export default Layout