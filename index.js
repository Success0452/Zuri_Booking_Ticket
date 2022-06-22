const express = require("express");
const { json } = require("express");
const routes = require("./routes/flightRoute");

const app = express();

app.use(json());
app.use(express.urlencoded({ extended: true }))

app.use("/", routes);

/* this checks for the available port*/
const port = process.env.PORT || 3000;

const start = () => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });

}

start()