######
## Structure

For you to create a ticket, you need to register as a user, after registration, a userId is then generated in the process, and with this userId, you can then create, upadate and delete tickets that identifies with your id. 

When you create a ticket, a ticketId will be generated, which will help to keep track of each ticket and also each ticket created by a particular user gets a createdBy field to idnetify that ticket to a paricular user.


## Locally Available Routes

## Gets all users without validation(for testing purpose)
#### localhost:3000/users
No requested parameters

## Gets all tickets without validation(for testing purpose)
 localhost:3000/tickets
 No requested parameters

## Gets a single ticket created by the registered user
####  localhost:3000/tickets/single/:ticketId
  requested parameters = req.params: ticketId && req.body: userId

## Gets all  booked ticket created by the user requesting it
#### localhost:3000/tickets/all
 requested parameters = req.body: userId

## Creates a new user
#### localhost:3000/users/add
 requested parameters:
req.body: {
  "name": "olatunde authority",
  "gender": "male",
  "profession": "video editor",
  "age": 71
}

## Book new ticket as a registered user
#### localhost:3000/tickets/add/userId
 requested parameters = req.params: userId &&
req.body: {
   "title": "flight to lagos",
  "price": 17200
}

## Updated Booked Ticket as a registered user
#### localhost:3000/tickets/update/ticketId
 requested parameters = req.params: ticketId && 

req.body: {
   "userId": "Zuri...", (required)
   "title": "flight to lagos", (optional)
   "price": 17200 (optional)
}
/* you only update any field you need to */


## Delete Booked Ticket as a registered user
#### localhost:3000/tickets/delete/ticketId
 requested parameters = req.params: ticketId && req.body: userId

## Delete all ticket without validation(for testing purpose)
#### localhost:3000/tickets/delete
  No requested parameters

## Task title: Booking Flight API
Task Objective: Create a rest API that has the following features

1. Add/Book Flight
2. Get all Flight
3. Get a single Flight
4. Update/Edit Flight
5. Delete Flight

for flight let it have the following properties
{
title: "flight to canada",
time: 1pm,
price: 26000,
date: "26-06-2022"
}

######
