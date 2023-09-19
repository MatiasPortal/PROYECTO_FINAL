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
    };

    getTickets = async() => {
        try {
            const data = await ticketModel.find().populate("products").lean()
            return data;
        } catch(err) {  
            console.log("Error al obtener tickets" + err)
        }
    };

    getTicketById = async(id) => {
        try {
            const data = await ticketModel.findById(id).populate("products").lean()
            return data;
        } catch(err) {
            console.log("Error al obtener ticket por id" + err)
        }
    };

    deleteTicket = async(id) => {
        try {
            const data = await ticketModel.findByIdAndDelete({ '_id': new mongoose.Types.ObjectId(id) }).lean()
            return data;
        } catch(err) {
            console.log("Error al borrar ticket" + err)
        }
    };

    deleteAllTickets = async() => {
        try {
            const data = await ticketModel.deleteMany()
            return data;
        } catch(err) {
            console.log("Error al borrar todos los tickets" + err)
        }
    }
};

export default TicketClassDB;