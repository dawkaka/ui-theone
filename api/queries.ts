import axios from "axios"
import { BASEURL } from "../constants"

export const getUser = async (name: string) => {
    return await axios.get(`${BASEURL}/user/${name}`)
}