import { changeRol, deleteInactiveUsers, deleteUser, forgotPassword, getUsers, resetPassword, updateUserDoc } from "../controllers/users.controller.js";
import { validate, validateAdmin } from "../middlewares/validate.middleware.js";

import { Router } from "express";
import { docUpload } from "../middlewares/multerFiles.js";
import multer from "multer";

const routerUser = Router();

// obtener todos los usuarios.
routerUser.get("/users", validateAdmin, getUsers)

// borrar usuario que no hayan tenido conexion despues de dos dias.
routerUser.delete("/users/inactive", validateAdmin, deleteInactiveUsers);

// borrar usuario.
routerUser.delete("/users/:uid", validateAdmin, deleteUser);

//Cambio de rol de usuario.
routerUser.put("/users/premium/:uid", validateAdmin, changeRol);

//Envio de email de recuperación de contraseña.
routerUser.post("/forgotpassword", forgotPassword);

//Reset de contraseña.
routerUser.post("/resetpassword/:token", resetPassword);

//Subida de archivos.
routerUser.post("/users/:uid/documents", docUpload.fields([
    { name: "identificacion", maxCount: 1},
    { name: "domicilio", maxCount: 1},
    { name: "statusDeCuenta", maxCount: 1},
]), updateUserDoc)

export default routerUser;

