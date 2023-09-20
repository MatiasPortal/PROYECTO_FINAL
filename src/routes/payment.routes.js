import { Router } from "express";
import { cancelPurchase } from "../controllers/views.controller.js";
import { createSession } from "../controllers/payments.cotroller.js";

const paymentRouter = Router();

paymentRouter.post("/checkout", createSession)
paymentRouter.get("/cancel", cancelPurchase)

export default paymentRouter;