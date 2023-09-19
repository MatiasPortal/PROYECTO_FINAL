import CustomError from "../dao/services/customErrors.js";
import TicketClassDB from "../dao/services/tickets.dbclass.js";
import errorsDict from "../configs/dictionary.errors.js";

const ticket = new TicketClassDB();


export const getTickets = async(req, res, next) => {
    try {
        const data = await ticket.getTickets();

        if(!data) {
            throw new CustomError(errorsDict.DATABASE_ERROR)
        }

        res.status(200).send({ message: "Tickets encontrados.", data:  data });
    } catch(err) {
        next(err)
    }
};

export const getTicketById = async(req, res, next) => {
    const { tid } = req.params;

    try {
        const data = await ticket.getTicketById(tid);
        
        if(!data) {
            throw new CustomError(errorsDict.NOT_FOUND_ERROR)
        }

        res.status(200).send({ message: "Ticket encontrado.", data:  data });
    } catch(err) {
        next(err)
    }
};

export const deleteTicket = async(req, res, next) => {
    const { tid } = req.params;

    try {
        const data = await ticket.deleteTicket(tid);
        
        if(!data) {
            throw new CustomError(errorsDict.NOT_FOUND_ERROR)
        };

        res.status(200).send({ message: "Ticket eliminado.", data:  data });
    } catch(err) {
        next(err)
    }
};

export const deleteAllTickets = async(req, res, next) => {
    try {
        const data = await ticket.deleteAllTickets();
        
        if(!data) {
            throw new CustomError(errorsDict.DATABASE_ERROR)
        };

        res.status(200).send({ message: "Todos los tickets eliminados.", data:  data });
    } catch(err) {
        next(err)
    }
}
