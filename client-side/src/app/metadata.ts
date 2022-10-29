export interface User {
    username: string,
    password: string
}
const PORT = '3000'
export const BASE_URL = `http://localhost:${PORT}/api/`