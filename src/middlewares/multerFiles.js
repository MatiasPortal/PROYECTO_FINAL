import { __dirname } from "../configs/utils.js";
import multer from "multer";
import path from "path";

const docStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      const fieldname = file.fieldname;
      
      const folders = {
        identificacion: "identifications",
        domicilio: "addresses",
        statusDeCuenta: "statusAccounts"
      };
  
      const folderName = folders[fieldname] || "others";
      const dir = path.join(__dirname, `../public/documents/${folderName}`);
  
      cb(null, dir);
    },
    filename: function (req, file, cb) {
      cb(
        null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      );
    },
  });
  
  export const docUpload = multer({ storage: docStorage });