const express = require("express");
const routes = require("./routes");
const cors = require("cors");
const bodyParser = require("body-parser");
const localTunnel = require("localtunnel");

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
    // Create a localtunnel with the desired subdomain
    const tunnel = await localTunnel({
      port,
      subdomain: "quiz-api",
    });

    console.log("LocalTunnel URL: ", tunnel.url);

    // Optionally handle tunnel errors
    tunnel.on("error", (err) => {
      console.error("LocalTunnel error: ", err);
    });
  } catch (error) {
    console.error("Error starting LocalTunnel: ", error);
  }
});

// Handle server shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down server...");
  await server.close();
  process.exit(0);
});