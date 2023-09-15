import * as url from 'url';

import MongoStore from "connect-mongo"
import bcrypt from "bcrypt";
import config from './config.js';
import jwt from 'jsonwebtoken';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('..', import.meta.url));

//BCRYPT

// crear hasheo
const createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

// validar password
const validPassword = (password, user) => {
    return bcrypt.compareSync(password, user.password);
}


// generar token
const generateToken = (user) => {
    const token = jwt.sign({user}, config.PRIVATE_KEY, { expiresIn: "3h" })
    return token;
}

// validar token
const authToken = (req, res, next) => {
    const authHeader = req.headers.autorization;

    if (!authHeader) return res.status(401).json({ message: "No autenticado"});
    console.log(authHeader)

    const token = authHeader.split(" ")[1];

    jwt.verify(token, config.PRIVATE_KEY, (err, credentials) => {
        if(err) return res.status(401).json({ message: "No autorizado"});

        req.user = credentials.user;
        next();
    })
};

const verifyEmailToken = (token) => {
    try {
        console.log("TOKEN PARA VERIFICAR ", token)
        const data = jwt.verify(token, config.PRIVATE_KEY);
        console.log("data:", data)
        return data.email;
    } catch(err) {       
        console.log(err.message)
        return null
    }
}





export { __filename, __dirname, createHash, validPassword, generateToken, authToken, verifyEmailToken };