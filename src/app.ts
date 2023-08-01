import express from "express";
import dotenv from "dotenv";
import "./db/mongoConnect";
import pointFeaturesR from "./routes/pointFeatures";
import eventesFeaturesR from "./routes/eventesFeatures";
// import eventsR from "./routes/eventes";
import polygonFeaturesR, { attachSocketIO } from "./routes/polygonFeatures";
import eventsR, { attachSocketIOEvents } from "./routes/eventes";
import bodyParser from "body-parser";
import apiRoutes from './routes/apiRoutes';
import { createServer } from "http";
import { Server } from "socket.io";
import { initSocket } from "./routes/socketEvents";
import cors from "cors";

dotenv.config();

const app = express();
const httpServer = createServer(app);

// Attach the socket.io server instance to the polygonFeatures router
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Replace with the actual origin of your React application
    credentials: true,
  },
});
const polygonFeaturesRouter = attachSocketIO(io);
const eventsFeaturesRouter = attachSocketIOEvents(io);

app.use(bodyParser.json());
app.use(express.json());


app.all("*", function (req, res, next) {
  if (!req.get("Origin")) return next();
  res.set("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.set("Access-Control-Allow-Headers", "X-Requested-With,Content-Type,x-api-key");
  next();
});


// ...





app.use("/pointFeatres", pointFeaturesR);
app.use("/eventesFeatures", eventesFeaturesR);
app.use("/polygonFeatures", polygonFeaturesRouter);
app.use('/api', apiRoutes);
app.use('/events',eventsFeaturesRouter)

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}.`);
});


// const websocketServer = startWebSocketServer();
// websocketServer.listen(3000, () => {
//   console.log("WebSocket Server listening on port 3000");
// });
