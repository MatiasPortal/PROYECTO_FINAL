import { deleteAllTickets, deleteTicket, getTicketById, getTickets } from "../controllers/tickets.controller.js";

import { Router } from "express";
import { validateAdmin } from "../middlewares/validate.middleware.js";

const routerTicket = Router();

//Obtener todos los tickets.
routerTicket.get("/tickets", validateAdmin, getTickets);

//Obtener ticket por id.
routerTicket.get("/tickets/:tid", validateAdmin, getTicketById);

//Eliminar ticket por id.
routerTicket.delete("/tickets/:tid", validateAdmin, deleteTicket);

//Eliminar todos los tickets.
routerTicket.delete("/tickets", validateAdmin, deleteAllTickets);

export default routerTicket;