import CustomError from "../dao/services/customErrors.js";
import { GetUserDto } from "../dao/dto/user.dto.js";
import UsersDB from "../dao/services/users.dbclass.js";
import errorsDict from "../configs/dictionary.errors.js";
import userModel from "../dao/models/users.model.js";

const user = new UsersDB();

// obtener todos los usuarios.
export const getUsers = async (req, res, next) => {
    try {
        const usersDto = await user.getUsers();
        res.send({ status: "success", data: usersDto });
    } catch(err) {
        next(err);
    }
}

// // borrar usuario que no hayan tenido conexion despues de dos dias.
export const deleteInactiveUsers = async (req, res, next) => {
    try {
        const inactiveUsers = await user.deleteInactiveUsers();
        res.send({ status: "success", message: "Usuarios inactivos eliminados", users: inactiveUsers  });
    } catch(err) {
        next(err)
    }
};

export const deleteUser = async (req, res, next) => {
    try {   
        const userId = req.params.uid;
        const deleteUser = await user.deleteUser(userId);
        console.log(deleteUser)
        if(!deleteUser) throw new CustomError(errorsDict.NOT_FOUND_ERROR);
        res.send({ status: "success", message: "Usuario eliminado", user: deleteUser  });
    } catch(err) {
        next(err)
    }
}

// Cambio de rol para usuario.
export const changeRol = async (req, res, next) => {
    try {
        const userId = req.params.uid;
        console.log("user id: ", userId)
        await user.changeRol(userId);

        res.send({ status: "success", message: "Rol actualizado" })
    } catch(err) {
        next(err);
    }
};

// Enviar correo de recuperación de contraseña.
export const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const updatePassword = await user.forgotPassword(email);
        
        
        res.send({ status: "success", message: "¡Correo de recuperación de contraseña enviado!" })
    
    }catch(err) {
        next(err);
    }
};

// reseteo de contraseña.
export const resetPassword = async (req, res, next) => {
    try {
        const token = req.params.token;
        const { newPassword } = req.body;

        const updatePassword = await user.resetPassword(newPassword, token);

        res.send({ status: "success", message: "Contraseña actualizada" })
    }
     catch(err) {
        next(err);
    }
};

// view para recuperar contraseña.
export const resetPasswordView = async (req, res, next) => {
    const token = req.params.token;
    res.render("resetPassword", { token });
};

// view para envio de email de recuperación de contraseña.
export const forgotPasswordView = async (req, res, next) => {
    res.render("forgotPassword");
};

export const updateUserDoc = async (req, res, next) => {
    try {
        const { uid } = req.params;
        const user = await userModel.findById(uid);

        if(!user) throw new CustomError(errorsDict.NOT_FOUND_ERROR);

        const identificacion = req.files.identificacion[0] || null;
        const domicilio = req.files.domicilio[0] || null;
        const statusDeCuenta = req.files.statusDeCuenta[0] || null;

        if(identificacion) {
            user.documents.push({ name: "identificacion", reference: identificacion.filename })
        }
        if(domicilio) {
            user.documents.push({ name: "domicilio", reference: domicilio.filename })
        }
        if(statusDeCuenta) {
            user.documents.push({ name: "statusDeCuenta", reference: statusDeCuenta.filename })
        }

        if(user.documents.length >= 3) {
            user.status = "completo";
        } else {
            user.status = "incompleto";
        };

        await user.save();

        res.json({ status: "success", message: "Documentos actualizados", user })
    } catch(err) {
        next(err)
    }
}





