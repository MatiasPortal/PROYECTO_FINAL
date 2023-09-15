import { Router } from "express";
import { createSession } from "../controllers/payments.cotroller.js";

const paymentRouter = Router();

paymentRouter.post("/checkout", createSession)
paymentRouter.get("/cancel", (req, res) => res.send("Cancelled"))

export default paymentRouter;