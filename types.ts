import { QueryKey } from "@tanstack/react-query";

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
    country: string;
    state: string
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

export interface PostT {
    couple_name: string;
    caption: string;
    files: { name: string, type: string, alt: string, width: number, height: number }[];
    likes_count: number;
    comments_count: number;
    verified: boolean;
    married: boolean;
    is_this_couple: boolean;
    has_liked: boolean;
    location: string;
    created_at: string;
    id: string;
    profile_picture: string;
    postId: string;
    comments_closed: boolean
}
export interface CouplePreviewT {
    couple_name: string;
    is_following: boolean;
    married: boolean;
    profile_picture: string;
    verified: boolean;
    updateCache: () => void
}
export interface CommentT {
    user_name: string;
    comment: string;
    date: Date;
    likes_count: number;
    profile_url: string;
    isThisUser: boolean;
    has_liked: boolean;
    has_partner: boolean;
    id: string;
    postId: string
}


export type MessageTypes = "ERROR" | "SUCCESS" | "NEUTRAL"

export interface MutationResponse {
    message: string,
    type: MessageTypes
}

export type NotFoundT = "post" | "comments" | "followers" | "following" | "couple" | "user" | "posts" | "notifications" | "request" | "explore" | "home" | "search"