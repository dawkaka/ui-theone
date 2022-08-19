import { FunctionComponent, ReactElement, ReactNode } from "react";
import { NextPage } from "next";
import Navigation  from "./navigation";
import styles from "./styles/layout.module.css"

const  Layout:  FunctionComponent<{children: ReactNode}> = ({children}) => {
   return (
    <div className={styles.mainWrapper}>
        <header>
            <Navigation/>
        </header>
    <main className={styles.container}>
        {children}
    </main>
    </div>
   )
}

export default Layout