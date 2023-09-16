import { __dirname } from "../configs/utils.js";
import multer from "multer";
import path from "path";

const projectDirectory = path.join(__dirname);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(projectDirectory, "public/images"))
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname)
    }
});

const fileFilter = (req, file, cb) => {
    if(file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({ storage, fileFilter });

export default upload;