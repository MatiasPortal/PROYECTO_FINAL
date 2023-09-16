import CustomError from "./dao/services/customErrors.js";
import MongoSingleton from "./configs/mongoSingleton.js";
import MongoStore from "connect-mongo";
import ProductsDB from "./dao/services/products.dbclass.js"
import { Server } from "socket.io";
import { __dirname } from "./configs/utils.js";
import { addLogger } from "./configs/logger.js";
import config from "./configs/config.js";
import { engine } from "express-handlebars";
import errorsDict from "./configs/dictionary.errors.js";
import express from "express";
import http from "http";
import initializePassport from "./passport/passport.strategies.js"
import loggerRouter from "./routes/logger.routes.js";
import passport from "passport"
import paymentRouter from "./routes/payment.routes.js";
import productModel from './dao/models/products.model.js';
import routerCart from "./routes/carts.routes.js";
import routerMocking from "./routes/mocking.routes.js";
import routerProducts from "./routes/products.routes.js";
import routerUser from "./routes/users.routes.js";
import routerViews from "./routes/views.routes.js";
import session from "express-session";
import sessionRoutes from './routes/sessions.routes.js';
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";

const managerDB = new ProductsDB();


// Servidor express y socket.io
export const servidor = express();

const httpServer = http.createServer(servidor);

const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        credentials: false
    }
});

// Swagger.
const swaggerOptions = {
    definition: {
        openapi: "3.0.1",
        info: {
            title: "Documentación de API ecommerce.",
            description: `Documentación de API para proyecto backend Coderhouse.
             - [Repositorio de backend](https://github.com/MatiasPortal/DESAFIOS-BACKEND)`
        }
    },
    apis: ["./docs/**/*.yaml"]
}

const specs = swaggerJsdoc(swaggerOptions);

// utilización de logger.
servidor.use(addLogger);

// Parseo correcto
servidor.use(express.json())
servidor.use(express.urlencoded({ extended: true }));

// Gestión de sesiones

export const storeSession = MongoStore.create({ mongoUrl: config.MONGOOSE_URL_ATLAS, mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true  }, ttl: 3600 });

servidor.use(session({
    store: storeSession,
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}))

// Passport
initializePassport()
servidor.use(passport.initialize())
servidor.use(passport.session())

// endpoints
servidor.use("/api", routerProducts);
servidor.use("/api", routerMocking)
servidor.use("/api", routerCart);
servidor.use("/api", routerUser)
servidor.use("/api", paymentRouter)
servidor.use("/", routerViews(storeSession));
servidor.use("/api/sessions", sessionRoutes());
servidor.use("/api/loggerTest", loggerRouter);
servidor.use("/api-docs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

// Contenidos estáticos
servidor.use("/public", express.static(`${__dirname}public`))

// errores
servidor.all("*", () => {
    throw new CustomError(errorsDict.NOT_FOUND_ERROR);
});
servidor.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).send({ status: "Error", message: err.message });
    req.logger.error(err.message)
})

// Motor de plantillas
servidor.engine('handlebars', engine());
servidor.set('view engine', 'handlebars');
servidor.set('views', `${config.APP_PATH}/views`);

// Eventos socket.io
io.on('connection', (socket) => {
    console.log(`Cliente conectado: (${socket.id})`);//conexion de usuario

    socket.on("disconnect", (reason) => {
        console.log(`Cliente desconectado: (${socket.id}): ${reason}`);//desconexion de usuario
    });

    socket.emit("server_confirm", "Conexión recibida");//confirmacion de conexion.

    socket.on("producto", async (data) => {//Agregar producto.
        let product = await productModel.create(data)
        console.log(product)
    });

    socket.on("id", (data) => {//Eliminar producto por id.
        console.log(data);
        managerDB.deleteProduct(data);
    });
});

// Conexión del servidor.
try {
    await MongoSingleton.getInstance();

    servidor.listen(config.PUERTO, () => {
        console.log(`Servidor iniciado en puerto: ${config.PUERTO}`);
    });
} catch(err) {
    console.log(`No se pudo iniciar el servidor: ${err.message}`)
}
