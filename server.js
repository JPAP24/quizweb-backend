const express = require("express");
const routes = require("./routes");
const cors = require("cors");
const bodyParser = require("body-parser");
const ngrok = require("ngrok");

const app = express();

const port = 8080;

// Define the allowed origins
const allowedOrigins = [
  process.env.CLIENT_URL_WEB,
  process.env.CLIENT_URL_MOBILE,
];

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(bodyParser.json());

// Include the defined routes
app.use("/", routes);

// Start the server and log the server URL

const server = app.listen(port, "0.0.0.0", async () => {
  console.log(`Worker ${process.pid} listening at ${process.env.SERVER_URL}`);

  try {
    const ngrokURL = await ngrok.connect({
      addr: port,
      authtoken: process.env.AUTH_TOKEN,
    });
    console.log("Ngrok URL: ", ngrokURL);
  } catch (error) {
    console.error("Error starting ngrok: ", error);
  }
});

// Handle server shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down server...");
  await server.close();
  await ngrok.kill();
  process.exit(0);
});
