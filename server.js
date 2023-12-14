const express = require("express");
const routes = require("./routes");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

const port = 8080;

app.use(cors({origin: process.env.CLIENT_URL, credentials: true}));
app.use(bodyParser.json());

// Include the defined routes
app.use("/", routes);

// Start the server and log the server URL
app.listen(port, () => {
  console.log(`Worker ${process.pid} listening at ${process.env.SERVER_URL}`);
});
