import CustomError from "../dao/services/customErrors.js"
import errorsDict from "../configs/dictionary.errors.js"

//VALIDAR SI USUARIO ESTA LOGUEADO
const validate = async (req, res, next) => {
    try {
        if (req.session.userValidated) {
            next()
        } else {
            throw new CustomError(errorsDict.UNAUTHORIZED_ERROR)
        }
    } catch(err) {
        next(err)
    }    
}

//VALIDACION DE ADMIN
const validateAdmin = async (req, res, next) => {
    try{
        if (req.user.role==="admin") {
            next()
        } else {
            throw new CustomError(errorsDict.UNAUTHORIZED_ERROR)
        }
    } catch(err) {
        next(err)
    }
}

//VALIDACION DE ADMIN
const validatePremium = async (req, res, next) => {
    try{
        if (req.user.role==="premium") {
            next()
        } else {
            throw new CustomError(errorsDict.UNAUTHORIZED_ERROR)
        }
    } catch(err) {
        next(err)
    }
}


export { validate, validateAdmin, validatePremium };