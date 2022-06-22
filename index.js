const express = require("express");
const { json } = require("express");
const flights = require("./controllers/flightController");
const models = require("./models/Flight");
const routes = require("./routes/flightRoute");
const users = require("./users.json")
const ticket = require("./ticket.json")
const fs = require("fs")

const app = express();

app.use(json());
app.use(express.urlencoded({ extended: true }))

app.use("/", routes);


/* for testing purpose to get all users without authentication check*/
app.get("/users", (req, res) => {
    /* this provide response to the user */
    res.status(200).json(users)
})




/* this routes create new user*/
app.post("/users/add", (req, res) => {

    /* declaration of parameters the user needs to provide*/
    const { name, gender, age, profession } = req.body

    /* creating a random number to be used as userId */
    const userId = `Zuri${Math.floor(1000 + Math.random() * 9000)}`

    /* for loop that loops through the users and check whether the choosen name is already present */
    for (let i = 0; i < users.length; i++) {
        if (name === users[i].name) {
            return res.status(400).send({ msg: "name already present, choose a unique name" })
        }
    }

    /* this push the info of the user to the array of users */
    users.push({
        userId: userId,
        name: name,
        gender: gender,
        age: age,
        profession: profession,
        createdAt: new Date().toISOString()
    })

    /* this covert the users object array into string */
    const stringify = JSON.stringify(users, null, 2)

    /* this update the user.json with the stringify values, and return error if an error is encountered */
    fs.writeFile('users.json', stringify, function(err) {
        if (err) res.status(500).send({ msg: err.message })
    })

    /* get the created user profile*/
    const find = users.find(user => {
        return user.userId === userId
    })

    /* if no error as been encountered and the new user as been created, the user is notified with the info of their profile*/
    res.status(201).json(find)
})



/* for testing purpose to get all tickets without authentication check*/
app.get("/tickets", (req, res) => {
    /* this provide response to the user */
    res.status(200).json(ticket)
})




/* this routes allows validated users to create a booking ticket */
app.post("/tickets/add/:id", (req, res) => {

    /* this gets the id of the user through the params */
    const { id } = req.params

    /* 
    this checks through ths users list and validate whther the user 
    with the id provided is present and return that particular user info
    */
    const userCheck = users.find(user => {
        return user.userId === id
    })

    /* this returns an error message if the userCheck was not successful */
    if (!userCheck) {
        return res.status(400).json({ msg: "you are not a registered user" })
    }

    /* Getting the specified values from the user */
    const { title, time, price, date } = req.body

    /* creating a random number to be used as ticketId */
    const ticketId = `TK${Math.floor(1000 + Math.random() * 9000)}`

    /* this respond to the user if any of the parameters are not provided*/
    if (!title || !price) {
        return res.status(400).json({ msg: "all parameters are required" })
    }

    /* this push the info of the ticket to the array of tickets */
    ticket.push({
        ticketId: ticketId,
        title: title,
        time: new Date().toLocaleTimeString(),
        price: price,
        date: new Date().toLocaleDateString(),
        createdBy: userCheck.name
    })

    /* this covert the users object array into string */
    const stringify = JSON.stringify(ticket, null, 2)

    /* this update the ticket.json with the stringify values, and return error if an error is encountered */
    fs.writeFile('ticket.json', stringify, function(err) {
        if (err) res.status(500).json({ msg: err.message })
    })

    /* get the created ticket info*/
    const find = ticket.find(ticket => {
        return ticket.ticketId === ticketId
    })

    /* if no error as been encountered and the new ticket as been created, the user is notified with the info of their ticket*/
    res.status(201).json(find)
})




/* this routes allow validated users to retieve a particular booking ticket created by the user*/
app.get("/tickets/single/:ticketId", (req, res) => {

    /* this gets the ticket id to be retreived from the params */
    const { ticketId } = req.params

    /* this gets the userId from the body */
    const { userId } = req.body

    /* 
    this checks through ths users list and validate whether the user 
    with the id provided is present and return that particular user info
    */
    const userCheck = users.find(user => {
        return user.userId === userId
    })

    /* 
    this checks through ths ticket list and validate whether the ticket 
    with the id provided is present and return that particular ticket info
    */
    const ticketCheck = ticket.find(ticket => {
        return ticket.ticketId === ticketId
    })

    /* this returns an error message if the userCheck was not successful */
    if (!userCheck) {
        return res.status(400).json({ msg: "not a valid user" })
    }

    /* this returns an error message if the ticketCheck was not successful */
    if (!ticketCheck) {
        return res.status(400).json({ msg: "ticketId not valid" })
    }

    /* this check the user name against the user that created the ticket, and returns error message if its not true*/
    if (userCheck.name !== ticketCheck.createdBy) {
        return res.status(400).json({ msg: "you can only view the ticket you created" })
    }

    /* if no error as been encountered and ticket gotten, the user is notified with the info of the ticket*/
    res.status(200).json(ticketCheck)

})



/* this routes allow validated users to retieve all the ticket that was created by them*/
app.get("/tickets/all", (req, res) => {

    /* this gets the userId from the body */
    const { userId } = req.body

    /* 
    this checks through ths users list and validate whether the user 
    with the id provided is present and return that particular user info
    */
    const userCheck = users.find(user => {
        return user.userId === userId
    })

    /* this returns an error message if the userCheck was not successful */
    if (!userCheck) {
        return res.status(400).json({ msg: "not a valid user" })
    }

    /* initialization of a new array*/
    const newArray = []

    /* 
    this for loop checks through the ticket.json list and return all the item that equate to the name
    of the user requesting the info, and each of these item is been stored inside the new array
    */
    ticket.forEach(function(value) {
        if (userCheck.name === value.createdBy) {
            return newArray.push(value)
        }
    })

    /* if no error as been encountered, the user is updated the response */
    res.status(200).json(newArray)

})



/* this routes allow validated users to update the booking ticket that was created by them*/
app.patch("/tickets/update/:ticketId", (req, res) => {

    /* this gets the ticket id to be retreived from the params */
    const { ticketId } = req.params

    /* Getting the specified values from the user */
    const { userId, title, price } = req.body

    /* 
    this checks through ths users list and validate whether the user 
    with the id provided is present and return that particular user info
    */
    const userCheck = users.find(user => {
        return user.userId === userId
    })

    /* this returns an error message if the userCheck was not successful */
    if (!userCheck) {
        return res.status(400).json({ msg: "you are not a registered user" })
    }

    /* 
    this checks through ths ticket list and validate whether the ticket 
    with the id provided is present and return that particular ticket info
    */
    const newTicket = ticket.find(tickets => {
        return tickets.ticketId === ticketId
    })

    /* this returns an error message if the ticketCheck was not successful */
    if (!newTicket) {
        return res.status(400).json({ msg: "ticket does not exist" })
    }

    /* this check the user name against the user that created the ticket, and returns error message if its not true*/
    if (userCheck.name !== newTicket.createdBy) {
        return res.status(400).json({ msg: "this ticket was not created by you" })
    }

    /* this gets the current parameter and set it to the new once provided*/
    /* in absence of a new value, the old value is been saved*/
    newTicket.title = title || newTicket.title,
        newTicket.time = new Date().toLocaleTimeString(),
        newTicket.price = price || newTicket.price,
        newTicket.date = new Date().toLocaleDateString(),
        newTicket.createdBy = userCheck.name || newTicket.createdBy

    /* this covert the users object array into string */
    const stringify = JSON.stringify(ticket, null, 2)

    /* this update the ticket.json with the stringify values, and return error if an error is encountered */
    fs.writeFile('ticket.json', stringify, function(err) {
        if (err) res.status(500).json({ msg: err.message })
    })

    /* getting updated ticket*/
    const find = ticket.find(ticket => {
        return ticket.ticketId === ticketId
    })

    /* respond to the user with the list of updated ticket*/
    res.status(200).json(find)
})



/* this routes allow validated users to delete the booking ticket that was created by them*/
app.delete("/tickets/delete/:ticketId", (req, res) => {

    /* this gets the ticket id to be retreived from the params */
    const { ticketId } = req.params

    /* this gets the userId from the body */
    const { userId } = req.body

    /* 
    this checks through ths users list and validate whether the user 
    with the id provided is present and return that particular user info
    */
    const userCheck = users.find(user => {
        return user.userId === userId
    })

    /* this returns an error message if the userCheck was not successful */
    if (!userCheck) {
        return res.status(400).json({ msg: "you are not a registered user" })
    }

    /* 
    this checks through ths ticket list and validate whether the ticket 
    with the id provided is present and return that particular ticket info
    */
    const ticketCheck = ticket.find(ticket => {
        return ticket.ticketId === ticketId
    })


    /* if the ticket check is not successful, this retuen an error message*/
    if (!ticketCheck) {
        return res.status(400).json({ msg: "This ticket does not exist or has been deleted" })
    }


    /* this check the user name against the user that created the ticket, and returns error message if its not true*/
    if (userCheck.name !== ticketCheck.createdBy) {
        return res.status(400).json({ msg: "this ticket was not created by you" })
    }

    /* this remove the particular ticket from the ticket.json list*/
    for (let i = 0; i < ticket.length; i++) {
        if (ticket[i] === ticketCheck) {
            ticket.splice(i, 1)
        }
    }

    /* this covert the users object array into string */
    const stringify = JSON.stringify(ticket, null, 2)

    /* this update the ticket.json with the stringify values, and return error if an error is encountered */
    fs.writeFile('ticket.json', stringify, function(err) {
        if (err) res.status(500).json({ msg: err.message })
    })

    /* returns a successful message to the user*/
    res.status(200).json({ msg: `${ticketId} deleted successfully` })
})



/* this routes deletes all the tickets without validation for testing purpose*/
app.delete("/tickets/delete", (req, res) => {

    ticket.splice(0, ticket.length)

    /* this covert the users object array into string */
    const stringify = JSON.stringify(ticket, null, 2)

    /* this update the ticket.json with the stringify values, and return error if an error is encountered */
    fs.writeFile('ticket.json', stringify, function(err) {
        if (err) res.status(500).json({ msg: err.message })
    })

    /* returns a successful message to the user*/
    res.status(200).json({ msg: `all ticket deleted successfully` })
})



/* this checks for the available port*/
const port = process.env.PORT || 3000;




const start = () => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });

}

start()