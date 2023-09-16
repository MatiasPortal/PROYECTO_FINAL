const errorsDict = {
    INTERNAL_ERROR: { code: 500, msg: "Ocurrión un error interno."},
    NOT_FOUND_ERROR: { code: 404, msg: "No se encontró los datos solicitados."},
    VALIDATION_ERROR: { code: 400, msg: "Error en la validación de datos."},
    UNAUTHORIZED_ERROR: { code: 401, msg: "No está autorizado para realizar esta acción."},
    DATABASE_ERROR: { code: 503, msg: "Error en la base de datos."}
};

export default errorsDict;
