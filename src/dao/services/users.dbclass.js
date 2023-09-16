import { validPassword, verifyEmailToken } from "../../configs/utils.js";

import { GetUserDto } from "../dto/user.dto.js";
import config from "../../configs/config.js";
import { createHash } from "../../configs/utils.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { sendRecoveryPass } from "../../configs/gmail.js";
import transporter from "../../configs/gmail.js";
import userModel from "../models/users.model.js";

class UsersDB {
    constructor() {
        this.statusMsg = "Initialized"
    }

    //Campos requeridos.
    static requiredFields = ["firsName", "lastName", "email", "age", "password"];

    //Valida que los campos requeridos estén presentes.
    static #verifyRequiredFields = (obj) => {
        return UsersDB.requiredFields.every(field => obj.hasOwnProperty.call(obj, field) && obj[field] !== null);
    }

    static #objEmpty(obj) {
        return Object.keys(obj).length === 0;
    }


    // Mostrar mensaje de estado.
    showStatusMsg = () => {
        return this.statusMsg;
    }

    // Crear usuario nuevo. //no me agrega usuario en register
    addUser = async (user) => {
        try {
            if(!UsersDB.#objEmpty(user) && UsersDB.#verifyRequiredFields(user)) {
                user.password = createHash(user.password);
                const create = await userModel.create(user);
                create.acknowledged === true ? this.statusMsg = "Usuario creado con éxito" : this.statusMsg = "No se pudo crear el usuario";
            }
        } catch (err) {
            this.statusMsg = `addUser: ${err.message}`;
        }
    };

    // Obtener usuarios.
    getUsers = async() => {
        try {
            const users = await userModel.find().lean();
            let usersDto = [];
            users.forEach((user) => {
                let userDto = new GetUserDto(user);
                usersDto.push(userDto);
            })
            return usersDto;
            
        } catch(err) {
            this.statusMsg = `getUsers: ${err.message}`;
        } 
    };

    // Obtener usuario por id.
    getUserById = async(id) => {
        try {
            const user = await userModel.findById(id).lean();
            return user;
        } catch(err) {
            this.statusMsg = `getUserById: ${err.message}`;
        }
    };

    // update de usuario.
    updateUser = async(id, data) => {
        try {
            if(data === undefined || Object.keys(data).length === 0) {
                this.statusMsg = "No hay datos para actualizar";
            } else {
                const update = await userModel.findByIdAndUpdate({ "_id": new mongoose.Types.ObjectId(id) }, data);
                update.modifiedCount === 1 ? this.statusMsg = "Usuario actualizado con éxito" : this.statusMsg = "No se pudo actualizar el usuario";
            }
        } catch(err) {
            this.statusMsg = `updateUser: ${err.message}`;
        }
    };

    // Eliminar usuario.
    deleteInactiveUsers = async() => {
        try {
            const limitDate = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // fecha limite de dos dias
            const inactiveUsers = await userModel.find({ last_connection: { $lte: limitDate } });

            for (const user of inactiveUsers) {
                //enviar correo de eliminacion de cuenta.
                const mail = transporter.sendMail({
                    from: 'Ecommerce <portalmatias4@gmail.com>',
                    to: user.email,
                    subject: 'Tu cuenta ha sido eliminada',
                    text: '¡Hola, tu cuenta ha sido eliminada debido a la inactividad en nuestra página!',
                });

                await userModel.findByIdAndDelete(user._id);
            };       
        } catch(err) {
            this.statusMsg = `deleteUser: ${err.message}`;
        }
    };

    deleteUser = async(id) => {
        try {
            const deleteUser = await userModel.findByIdAndDelete(id)
            console.log(deleteUser);
            return deleteUser;
        } catch(err) {
            this.statusMsg = `deleteUser: ${err.message}`;
        }
    }

    // Cambiar rol de usuario, si tiene docs necesarios para a ser de user a premium.
    changeRol = async(id) => {
        try {
            const user = await userModel.findById(id).lean()

            if(!user) {
                throw new Error("No se encontrón el usuario");
            }

            let docsArray = user.documents;
            const documentNames = docsArray.map((doc) => doc.name);

            if(user.role == "premium") {
                user.role = "user";
                const updateUser = await userModel.findByIdAndUpdate(id, user, { new: true });
                return updateUser;
            } else if(user.role == "user") {
                if (documentNames.includes("identificacion") && documentNames.includes("domicilio") && documentNames.includes("statusDeCuenta")) {
                    user.role = "premium";
                    const updateUser = await userModel.findByIdAndUpdate(id, user, { new: true });
                    return updateUser;
                } else {
                    console.log("No hay documentos para ser premium")
                }
            }

            return user;
        } catch(err) {
            this.statusMsg = `changeRol: ${err.message}`;
        }
    };

    // Enviar correo de recuperación de contraseña.
    forgotPassword = async(email) => {
        try {
            const user = await userModel.findOne({ email });

            if(!user) {
                return this.statusMsg = "No se encontró el usuario";
            }

            // Generar token.
            const token = jwt.sign({ email }, config.PRIVATE_KEY, { expiresIn: "1h" });

            // Generar el correo.
            const data = await sendRecoveryPass(email, token);
            
            this.statusMsg = "Se envió el correo con el link de recuperación";
        } catch(err) {
            this.statusMsg = `forgotPassword: ${err.message}`;
        }
    };

    // Resetear contraseña.
    resetPassword = async(newPassword, token) => {
        try {
            const validEmail = verifyEmailToken(token);
            if(!validEmail) {
                this.statusMsg = "El token no es válido";
            }

            const user = await userModel.findOne({ email: validEmail });
            
            if(!user) {
                this.statusMsg = "El usuario no existe";
            }

            if(validPassword(newPassword, user)) {
                this.statusMsg = "La nueva contraseña no puede ser igual a la anterior";
            }

            user.password = createHash(newPassword);

            const userUpdate = await user.save()

            this.statusMsg = "Contraseña actualizada con éxito";
        } catch(err) {
            this.statusMsg = `resetPassword: ${err.message}`;
        }  
    }
}

export default UsersDB;