import { GetUserDto } from "../dao/dto/user.dto.js";
import { Router } from "express"
import initializePassport from "../passport/passport.strategies.js";
import passport from "passport";
import { validate } from "../middlewares/validate.middleware.js"

initializePassport()

const sessionRoutes = () => {
    const routes = Router();

    //GITHUB.
    routes.get("/github", passport.authenticate("github", { scope: ["user:email"] }), async(req, res) => {});

    routes.get("/githubcallback", passport.authenticate("github", { failureRedirect: "/" }), async(req, res) => {
        req.session.user = req.user;
        req.session.userValidated = true;
        console.log(req.user)
        res.redirect("/");
    })


    //CURRENT. Datos de usuario
    routes.get("/current", validate, async (req, res) => {
        try {
            let user = new GetUserDto(req.user);
            res.json({ payload: user });
        } catch(err) {
            res.status(500).json({error: err});
        }
    });
    
    return routes;
}

export default sessionRoutes