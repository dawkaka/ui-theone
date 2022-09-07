import { useState } from "react"
import { IoMdClose } from "react-icons/io"
import Modal from "react-modal"
import styles from "./styles/edit.module.css"

Modal.setAppElement("#__next")

const EditCouple: React.FunctionComponent<{ open: boolean }> = ({ open }) => {
    const [isOpen, setOpen] = useState(open)
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={() => setOpen(false)}
            style={{
                overlay: {
                    zIndex: 1,
                    backgroundColor: "rgba(0,0,0,0.75)",
                    paddingInline: "var(--gap)",
                    display: "flex",
                    flexDirection: "column",
                    margin: 0
                },
                content: {
                    alignSelf: "center",
                    position: "relative",
                    padding: 0,
                    margin: 0,
                    overflow: "hidden",
                    justifyContent: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    left: 0,
                    border: "none",
                }
            }}
        >
            <form className={styles.modalBody}>
                <div className={styles.requestHeader}>
                    <div className={styles.backIcon} onClick={() => setOpen(false)}>
                        <IoMdClose size={25} color="var(--accents-6)" />
                    </div>
                    <p>Edit</p>
                    <div
                        onClick={() => { }}
                        className={styles.nextContainer}
                    >
                        <button>Done</button>
                    </div>
                </div>
                <section className={styles.modalContent}>
                    <div className={styles.editItem}>
                        <label htmlFor="bio">Bio</label>
                        <textarea id="bio">
                        </textarea>
                    </div>
                    <div className={styles.editItem}>
                        <label htmlFor="status">Status</label>
                        <input type="text" id="status" />
                    </div>
                    <div className={styles.editItem}>
                        <label htmlFor="date">Date relationship began</label>
                        <input type="date" id="date" />
                    </div>
                    <div className={styles.editItem}>
                        <label htmlFor="website">Website</label>
                        <input type="url" id="website" />
                    </div>

                </section>
            </form>
        </Modal>
    )
}

export default EditCouple