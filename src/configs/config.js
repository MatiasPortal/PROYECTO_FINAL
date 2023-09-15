import * as dotenv from 'dotenv'

import path from 'path'

// Activar variables de entorno.
dotenv.config({ path:"./.env" })

const config = {
    MONGOOSE_URL: process.env.MONGOOSE_URL,
    PUERTO: process.env.PUERTO,
    MONGOOSE_URL_ATLAS: process.env.MONGOOSE_URL_ATLAS,
    SESSION_SECRET: process.env.SESSION_SECRET,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    GITHUB_CALLBACK_URL: process.env.GITHUB_CALLBACK_URL,
    PRIVATE_KEY: process.env.PRIVATE_KEY,
    GMAIL_ACCOUNT: process.env.GMAIL_ACCOUNT,
    GMAIL_PASS: process.env.GMAIL_PASS,
    NODE_ENV: process.env.NODE_ENV,
    APP_PATH: `${path.resolve()}/src`,
    APP_BASE: process.env.APP_BASE,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY
};

export default config;