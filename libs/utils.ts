
export const postDateFormat = (date: string, lang: string) => {
    const Dd = new Date(date)
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    const day = Dd.toLocaleDateString(lang, options)
    return day
}
