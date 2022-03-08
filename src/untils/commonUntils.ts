export const formatAccountAddress = (account: string | undefined, lsize: number = 4, rsize: number = 4): string => {
    if (!account) return ''
    return account.substring(0, lsize) + '...' + account.substring(account.length - rsize)
}


export const moneyFormat = (num: string | number) => {
    return String(num).replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
}

export const downloadFile = (filename: string, content: string) => {
    let element = document.createElement('a');

    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    setTimeout(() => {
    }, 1000);
    
}

export const verifyNote = (note: string) => {
    let reg = /blender-.+-[0-9]+-.+/g
    let ok = reg.test(note)
    return ok
}

export const isLamdenKey = ( key: string ) => {
    if (key.length === 64) return true;
    return false;
}

export function isFunction(obj: any): obj is Function {
    return typeof obj === 'function';
}

export async function getIP(): Promise<string>{
    try {
        const res = await fetch(
            `https://api.ipify.org`, {
                method: 'GET'
            }
        )
        return res.text()
    } catch (error) {
        console.log(error)
        return ''
    }
}