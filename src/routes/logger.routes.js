import { Router } from 'express';

const loggerRouter = Router();

loggerRouter.get('/', (req, res) => {
    req.logger.warn('¡Alerta!');
    req.logger.info('¡Información!');
    req.logger.debug('¡Debug!');
    req.logger.error('¡Error!');
    req.logger.silly('¡Silly!');
    req.logger.verbose('¡Verbose!');
    req.logger.http('¡HTTP!');
    req.logger.fatal('¡Fatal!');

    res.send('Prueba de log');
});

export default loggerRouter;