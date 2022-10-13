import React from "react";

export const PostModalContext = React.createContext({ delete: () => { } })

export const ToasContext = React.createContext<{ notify: (message: string, type: "SUCCESS" | "ERROR" | "NEUTRAL") => void } | null>(null)
