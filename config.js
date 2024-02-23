require('dotenv').config();

const envConfig = {
    BASE_URL: process.env.BASE_URL,
    MODE: process.env.MODE,
    PORT: process.env.PORT || 5555,
    DB_OWNER: process.env.DB_OWNER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    SESSION_SECRET: process.env.SESSION_SECRET,
    
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    SESSION_SECRET: process.env.SESSION_SECRET,

    TWITCH_CLIENT_ID: process.env.TWITCH_CLIENT_ID,
    TWITCH_CLIENT_SECRET: process.env.TWITCH_CLIENT_SECRET,
    APP_ACCESS_TOKEN: process.env.APP_ACCESS_TOKEN,
    TWITCH_OAUTH_REDIRECT: process.env.TWITCH_OAUTH_REDIRECT,

    PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID,
    PAYPAL_SECRET: process.env.PAYPAL_SECRET,
}

module.exports = envConfig