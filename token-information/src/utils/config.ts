import * as dotenv from 'dotenv';



export function getConfig() {

    const config = dotenv.config();

    const database = {
        type: 'mysql' as const,
        host: config.parsed.HOST,
        port: parseInt(config.parsed.DB_PORT, 10),
        username: config.parsed.USERNAME,
        password: config.parsed.PASSWORD,
        database: config.parsed.DATABASE,
    }
    return {
        database,
    };
}