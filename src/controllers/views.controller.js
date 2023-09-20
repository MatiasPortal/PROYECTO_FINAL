import CartsClassDB from "../dao/services/carts.dbclass.js";
import { GetUserDto } from "../dao/dto/user.dto.js";
import ProductsDB from "../dao/services/products.dbclass.js";
import { generateToken } from "../configs/utils.js";
import productModel from "../dao/models/products.model.js";
import { storeSession } from "../app.js";
import userModel from "../dao/models/users.model.js";

const products = new ProductsDB();
const cartManager = new CartsClassDB();

// Detalles del producto.
export const productDetails = async (req, res) => {
    let pid = req.params.pid;
    const product = await products.getProductById(pid);

    res.render("productDetails", {product})
};

// Realtimeproducts.
export const realTimeProducts = async (req, res) => {
    const currentProducts = await productModel.find().lean()
    res.render('realTimeProducts', { products: currentProducts });
};

// add products user premium.
export const addProducts = async (req, res) => {
    const currentProducts = await productModel.find().lean()
    //mostrar productos que agrego el user.
    const userProducts = currentProducts.filter(product => product.owner === req.user._id)
    res.render('addProducts', { products: userProducts });
};

// cart.
export const cart = async (req, res) => {
    try {
        let cid = req.params.cid;
        let cart = await cartManager.getCartById(cid);
        let productsInCart = cart.products;
        console.log(cart);

        res.render("carts", {productsInCart})
    } catch(err) {
        res.status(400).json(err.message)
    }
};

// Registro.
export const register = async (req, res) => {
    if(req.session.userValidated === true ) {
        res.redirect("/")
    } else {
        res.render("register", { errorMessages: req.session.errorMessages })
    }
};

// Perfil de usuario.
export const profile = async (req, res) => {
    //datos de usuario.
    const user = req.session.user;
    res.render("profile", {user: user})
};

// Verificar los datos de sesion.
export const verifySession = async (req, res) => {
    storeSession.get(req.sessionID, async (err, data) => {
        //si hay un error
        if (err) console.log(`Error al obtener el usuario: ${err}`)

        //si la validacion de usuario es true se renderiza la vista de productos.
        if (data !== null && (req.session.userValidated)) {      
              
            let limit = parseInt(req.query.limit) || 10;
            let category = req.query.category || "";
            let sort = req.query.sort?.toString() || "";
            let page = parseInt(req.query.page) || 1;
            let status = req.query.status || "";

            const data = await products.getProducts(limit, page, sort, category, status);
            
            //datos de usuario.
            const user = req.session.user;

            // para aplicar en vistas de home.
            const isNotAdmin = user.role !== "admin";
            const isAdmin = user.role === "admin";
            const isPremium_admin = user.role === "premium" || user.role === "admin";

            res.status(200).render("home", { products: data, user: user, isNotAdmin, isAdmin, isPremium_admin })


        } else {
            //si la validacion de usuario es false se renderiza la vista de login.
            res.render("login", { sessionInfo: data, errorMessages: req.session.errorMessages  })
        }
    })
};

// Cerrar sesion.
export const logout = async (req, res) => {
    // ultima conexion.
    if(req.session.user && req.session.user.id) {
        console.log(req.session.user.id)
        const user = await userModel.findById(req.session.user.id);
        user.last_connection = new Date();
        await user.save();  
    }

    req.session.userValidated = false;

    req.session.destroy((err) => {
        req.sessionStore.destroy(req.sessionID, (err) => {
            if (err) console.log(`Error al cerrar sesion: ${err}`);

            console.log("Sesion cerrada");
            res.redirect("/");
        });
    })
};

// Error de login.
export const loginError = (req, res) => {
    res.render("failedLogin", { errorMessages: req.session.errorMessages })
};

// Login.
export const login = async(req, res) => {

    req.session.userValidated = true;
    // DATOS DE USUARIO
    req.session.user = {
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
        age: req.user.age,
        role: req.user.role,
        id: req.user._id,
        cart: req.user.cart,
    };

    //GENERAR TOKEN
    const accessToken = generateToken(req.session.user);
    res.cookie("accessToken", accessToken, { httpOnly: true });


    
    res.redirect("/");
};

// Error al registrar.
export const registerError = (req, res) => {
    res.render("failedRegister", {})
};

// lista para cambiar rol o eliminar usuario.
export const listUsers = async (req, res) => {
    try {
        const users = await userModel.find();
        let usersDto = [];

        users.forEach( u => {
            let user = new GetUserDto(u);
            usersDto.push(user);
        });

        res.render("users", { users: usersDto });
    } catch(err) {
        return err;
    }
};

//cancelar compra.
export const cancelPurchase = async (req, res) => {
    res.render("cancelPurchase", {})
}


