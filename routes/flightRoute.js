const express = require('express');

const router = express.Router();

const {
    AddUser,
    BookTicket,
    GetAllTicketWithNoAuth,
    GetAllUsersWithNoAuth,
    DeleteAllTicketsWithNoAuth,
    GetSingleTicket,
    GetAllTicket,
    UpdateBookedTicket,
    DeletesingleTicket
} = require('../controllers/flightController');

router.route("/users/add").post(AddUser)
router.route("/tickets/add/:id").post(BookTicket)
router.route("/tickets/single/:ticketId").get(GetSingleTicket)
router.route("/tickets/all").get(GetAllTicket)
router.route("/tickets/update/:ticketId").patch(UpdateBookedTicket)
router.route("/tickets/delete/:ticketId").delete(DeletesingleTicket)
router.route("/tickets/delete").delete(DeleteAllTicketsWithNoAuth)
router.route("/users").get(GetAllUsersWithNoAuth)
router.route("/tickets").get(GetAllTicketWithNoAuth)


module.exports = router;