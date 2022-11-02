import axios from "axios"
import { useRouter } from "next/router"
import { BASEURL } from "../../../constants"



export default function VerifyEmail() {
    const router = useRouter()
    axios.post(`${BASEURL}/user/verify-signup/${router.query.id}`)
        .then(res => {
            router.replace("/r/home")
        })
        .catch(err => {
            console.log(err)
        })
    return (
        <div>

        </div>
    )
}