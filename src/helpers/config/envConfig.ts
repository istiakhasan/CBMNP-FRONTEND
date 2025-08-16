export const getBaseUrl = ():string => {
    return process.env.NEXT_PUBLIC_API_BASE_URL || "http://31.97.60.104:8080/api/v1"
    return process.env.NEXT_PUBLIC_API_BASE_URL || "http://192.168.10.134:3000"
    return process.env.NEXT_PUBLIC_API_BASE_URL || "http://192.168.10.167:3001"
}