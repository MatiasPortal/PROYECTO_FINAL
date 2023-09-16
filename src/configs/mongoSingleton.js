import config from "./config.js";
import mongoose from "mongoose";

export default class MongoSingleton {
    static #instance;

    constructor() {
        this.#connectMongoDB();
    };

    static getInstance() {
        if (this.#instance) {
            console.log("Ya se encuentra una conexión a MongoDB.");
        } else {
            this.#instance = new MongoSingleton();
        }
        return this.#instance;
    };

    #connectMongoDB = async () => {
        try {
            await mongoose.connect(config.MONGOOSE_URL_ATLAS);
            console.log("Conectado con éxito a MongoDB.")
        } catch(err) {
            console.log("No se pudo conectar a MongoDB: ", err);
            process.exit();
        }
    };
};