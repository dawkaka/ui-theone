export const isRealName = (name: string) => {
    name = name.trim()
    const errors = []
    if (name.length < 2 || name.length > 20) {
        errors.push(1)
    }
    if (isASCII(name)) {
        for (let val of name) {
            if (val.toUpperCase() !== val.toLocaleLowerCase() && val !== '\'') {
                errors.push(2)
            }
        }
        if (name[0] !== name[0].toUpperCase()) {
            errors.push(3)
        }
        if (name.substring(1) !== name.substring(1).toLocaleLowerCase()) {
            errors.push(4)
        }
    }
    return errors
}

function isASCII(str: string) {
    for (let i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) > 256) {
            return false
        }
    }
    return true
}

export const isPassword = (password: string) => {
    return password.trim().length > 7
}

export const isCoupleName = (name: string) => {
    name = name.trim()
    const nameLength = name.length
    const errors = []
    if (nameLength < 5 || nameLength > 30) {
        errors.push(1)
    }

    const reg = new RegExp(`^[a-zA-Z0-9_.&]+$`)
    if (!reg.test(name)) {
        errors.push(2)
    }
    let spec = "._&"
    if (spec.includes(name[0]) || spec.includes(name[nameLength - 1])) {
        errors.push(3)
    }
    for (let i = 0; i < nameLength - 1; i++) {
        if (name[i] == '_' || name[i] == '.') {
            if (name[i + 1] == '_' || name[i + 1] == '.') {
                errors.push(4)
            }
        }
    }
    return errors
}

export const isUserName = (name: string) => {
    name = name.trim()
    const nameLength = name.length
    const errors = []
    if (nameLength < 4 || nameLength > 15) {
        errors.push(1)
    }

    const reg = new RegExp(`^[a-zA-Z0-9_.]+$`)
    if (!reg.test(name)) {
        errors.push(2)
    }
    //User name should not start or end with a special char
    if (name[0] === '_' || name[0] === '.' || name[nameLength - 1] === '_' || name[nameLength - 1] === '.') {
        errors.push(3)
    }
    for (let i = 0; i < nameLength - 1; i++) {
        if (name[i] == '_' || name[i] == '.') {
            if (name[i + 1] == '_' || name[i + 1] == '.') {
                errors.push(4)
            }
        }
    }
    return errors
}

