
export const postDateFormat = (date: string) => {
    const Dd = new Date(date)
    const day = Dd.toDateString().substring(3)
    const t = Dd.toLocaleTimeString().split(" ")
    const time = t[0].substring(0, t[0].length - 3) + " " + t[1]
    return `${day}・${time}`
}