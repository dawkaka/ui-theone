import { useEffect, useState } from "react"

export const Prompt: React.FunctionComponent<{ open: boolean, close: () => void, message: string, acceptFun: () => void, dangerAction: boolean }> =
    ({ open, message, acceptFun, dangerAction, close }) => {
        if (!open) {
            return null
        }

        return (
            <div style={{ position: "fixed", width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.7)", top: 0, left: 0 }} onClick={close}>
                <div style={{
                    position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)",
                    padding: "var(--gap)", backgroundColor: "var(--background)",
                    borderRadius: "var(--radius-tiny)", width: "min(90%,400px)", textAlign: "center"
                }}>
                    <div style={{ marginBottom: "var(--gap)", fontSize: "1.1rem" }}>
                        <p>{message}</p>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <button onClick={close}
                            style={{
                                backgroundColor: "transparent", border: "var(--border)",
                                width: "40%", paddingBlock: "var(--gap-quarter)",
                                color: "var(--foreground)"
                            }}>Cancel</button>

                        <button onClick={(e) => {
                            e.stopPropagation()
                            acceptFun()
                        }
                        }
                            style={{
                                width: "40%", paddingBlock: "var(--gap-quarter)",
                                backgroundColor: dangerAction ? "var(--error)" : ""
                            }}>Yes</button>
                    </div>
                </div>

            </div>
        )
    }