export type Langs = "en" | "es"

export type ErrCodes = (0 | 1 | 2 | 3)[]

export const enum Theme {
    DARK = "dark",
    LIGHT = "light",
    AUTO = "auto"
}

export interface Signup {
    first_name: string;
    last_name: string;
    user_name: string;
    email: string;
    date_of_birth: string;
    password: string;
    repeat_password: string
}

export interface EditUser {
    first_name: string,
    last_name: string,
    bio: string,
    website: string,
    date_of_birth: string
}

export interface EditCouple {
    bio: string;
    website: string;
    date_commenced: string;
}

export interface EditUserT {
    open: boolean;
    close: () => void;
    first_name: string;
    last_name: string;
    dob: string;
    bio: string;
    website: string;
}