import { NextPage } from "next";
import Link from "next/link";
import { FormEvent, useState } from "react";
import styles from "../styles/loginsignup.module.css"



const Login: NextPage = () => {
    const [emailOrUsername, setEmailOrUserName] = useState("")

    const login = (e: FormEvent) => {
        e.preventDefault()
    }

    return (
        <div className={styles.pageMain}>
            <main className={styles.main}>
                <div className={styles.deco}></div>
                <div className={styles.formContainer}>
                    <h2 style={{ textAlign: "center" }}>Login</h2>
                    <div className={styles.indicatorsContainer}>
                        <form className={styles.form}>
                            <div className={styles.formItem}>
                                <label htmlFor="firstname">Name or email</label>
                                <input type="text" placeholder="Enter user name or email" name="user_name" required value={emailOrUsername}
                                    onChange={(e) => setEmailOrUserName(e.currentTarget.value)} />
                            </div>
                            <div className={styles.formItem}>
                                <label htmlFor="lastname">Password</label>
                                <input type="password" placeholder="Enter password" name="password" required />
                                <small style={{ color: "var(--success)" }}>Forgot password?</small>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", marginTop: "40px", gap: "var(--gap)" }}>
                                <button
                                    style={{ paddingBlock: "var(--gap-half)" }}
                                    onClick={login}
                                >
                                    Login
                                </button>
                                <p>Don't have an account ? <Link href={"/signup"} shallow><a style={{ color: "var(--success)" }}>Signup</a></Link></p>
                            </div>

                        </form>
                    </div>
                </div>
            </main >
        </div >
    )
}

export default Login