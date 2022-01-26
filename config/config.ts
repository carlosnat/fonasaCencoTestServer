export const serverConfig = () => {
    return {
        PORT: process.env.PORT,
        DATABASE: {
            NAME: process.env.DATABASE_NAME || 'fonasa',
            USER: process.env.DATABASE_USER || 'postgres',
            PASS: process.env.DATABASE_PASS,
            HOST: process.env.DATABASE_HOST,
        }
    }
}