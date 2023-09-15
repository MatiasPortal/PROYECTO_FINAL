import { __dirname } from './utils.js';
import config from './config.js';
import path from 'path';
import winston from 'winston';

const currentEnv = config.NODE_ENV || 'development';

// generar niveles y colores personalizados.
const customLevels = {
    levels: {
        fatal: 0,
        error: 1,
        warn: 2,
        info: 3,
        http: 4,
        verbose: 5,
        debug: 6,
        silly: 7
    },

    colors: {
        fatal: 'cyan',
        error: 'red',
        warn: 'yellow',
        info: 'blue',
        http: 'green',
        verbose: 'white',
        debug: 'magenta',
        silly: 'grey'
    }
};

winston.addColors(customLevels.colors);

//logger para modo dev.
const devLogger = winston.createLogger({
    levels: customLevels.levels,
    transports: [
        new winston.transports.Console({ level: 'debug', format: winston.format.combine(
                winston.format.colorize({ colors: customLevels.colors }),
                winston.format.simple()
            )
        })
    ]
});

// logger para modo prod.
const prodLogger = winston.createLogger({
    levels: customLevels.levels,
    transports: [
        new winston.transports.Console({ level: 'http' }),
        new winston.transports.File({
            filename: path.join(__dirname, 'configs/errors.log'),
            level: 'info'
        })
    ]
});

export const addLogger = (req, res, next) => {
    if (currentEnv === 'development') {
        req.logger = devLogger;
    } else {
        req.logger = prodLogger;
    }
    req.logger.http(`${req.method} en ${req.url}`);
    next();
};