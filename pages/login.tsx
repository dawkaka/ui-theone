import { NextPage } from "next";
import { FormEvent, useState } from "react";
import styles from "../styles/loginsignup.module.css"



const Login: NextPage = () => {
    const login = (e: FormEvent) => {
        e.preventDefault()
    }

    return (
        <div className={styles.pageMain}>
            <main className={styles.main}>
                <div style={{ background: "url(/med.jpg)", backgroundPosition: "center" }}></div>
                <div className={styles.formContainer}>
                    <h2 style={{ textAlign: "center" }}>Login</h2>
                    <div className={styles.indicatorsContainer}>
                        <form className={styles.form}>
                            <div className={styles.formItem}>
                                <label htmlFor="firstname">Name or email</label>
                                <input type="text" placeholder="Enter user name or email" name="user_name" required />
                            </div>
                            <div className={styles.formItem}>
                                <label htmlFor="lastname">Password</label>
                                <input type="password" placeholder="Enter password" name="password" required />
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", marginTop: "40px" }}>
                                <button
                                    style={{ paddingBlock: "var(--gap-half)" }}
                                    onClick={login}
                                >
                                    Login
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </main >
        </div >
    )
}

export default Login