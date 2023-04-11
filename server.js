const express = require("express");
const cors = require("cors");
// const test = require('./Test');

const app = express();

var corsOptions = {
    origin: "http://localhost:80"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));



// simple route
app.get("/", (req, res) => {
    res.status(200).send({ message: "Welcome to CGC Remote Copier." });
    //res.json({ message: "Welcome to CGC Remote Copier." });
});

require("./app/routes/URL.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 80;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
    // test.Login();

});