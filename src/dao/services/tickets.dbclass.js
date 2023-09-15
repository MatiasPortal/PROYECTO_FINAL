import ticketModel from "../models/tickets.model.js";

class TicketClassDB {
    constructor() {
    }

    //crear ticket.
    createTicket = async (ticket) => {
        try {
            const data = await ticketModel.create(ticket);
            return data;
        } catch(err) {
            console.log("Error al crear ticket" + err)
        }
    }
};

export default TicketClassDB;