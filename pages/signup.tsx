import { NextPage } from "next";
import { FormEvent, useState } from "react";
import styles from "../styles/loginsignup.module.css"



const Signup: NextPage = () => {
    const [step, setStep] = useState(true)

    const next = (e: FormEvent) => {
        e.preventDefault()
        setStep(false)
    }

    const signup = (e: FormEvent) => {
        e.preventDefault()
    }
    const back = (e: FormEvent) => {
        e.preventDefault()
        setStep(true)
    }

    return (
        <div className={styles.pageMain}>
            <main className={styles.main}>
                <div className={styles.deco}></div>
                <div className={styles.formContainer}>
                    <h2 style={{ textAlign: "center" }}>Signup</h2>
                    <div className={styles.indicatorsContainer}>
                        <form className={styles.form}>
                            {
                                step ? (
                                    <>
                                        <div className={styles.formItem}>
                                            <label htmlFor="firstname">First name</label>
                                            <input type="text" placeholder="Enter first name" name="first_name" required />
                                        </div>
                                        <div className={styles.formItem}>
                                            <label htmlFor="lastname" placeholder="Enter last name">Last name</label>
                                            <input type="text" placeholder="Enter last name" name="last_name" required />
                                        </div>
                                        <div className={styles.formItem}>
                                            <label htmlFor="email">Email</label>
                                            <input type="email" placeholder="Enter email" name="email" required />
                                        </div>
                                        <div className={styles.formItem}>
                                            <label htmlFor="dob">Birth date</label>
                                            <input type="date" name="date_of_birth" required />
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "40px" }}>
                                            <button onClick={next}>Next</button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className={styles.formItem}>
                                            <label htmlFor="firstname">User name</label>
                                            <input type="text" placeholder="Choose user name" name="user_name" required />
                                        </div>
                                        <div className={styles.formItem}>
                                            <label htmlFor="lastname" placeholder="Enter last name">Password</label>
                                            <input type="password" placeholder="Enter last name" name="password_name" required />
                                        </div>
                                        <div className={styles.formItem}>
                                            <label htmlFor="email">Repeat password</label>
                                            <input type="password" placeholder="Enter email" name="repeat_password" required />
                                        </div>

                                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "40px" }}>
                                            <button
                                                onClick={back}
                                                style={{
                                                    color: "var(--success)",
                                                    backgroundColor: "transparent",
                                                    border: "var(--border)"
                                                }}>Back</button>
                                            <button
                                                style={{ paddingBlock: "var(--gap-half)" }}
                                                onClick={signup}
                                            >
                                                Sign up
                                            </button>
                                        </div>
                                    </>
                                )
                            }
                        </form>
                    </div>
                </div>
            </main >
        </div >
    )
}

export default Signup