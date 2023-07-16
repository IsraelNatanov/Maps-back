import express, { Request, Response } from "express";
import { EventsFeaturesModel } from "../models/eventsFeaturesModel";
import { IEventFeatures, IFeaturePolygon } from "../types/FeatureType";
import { PolygonFModel } from "../models/polygonFModel";
import bodyParser from 'body-parser';
import { Server, Socket } from "socket.io";

const router = express.Router();
router.use(bodyParser.json());

// Create a socket.io server instance
let io: Server;

// Attach the socket.io server instance to the router
export function attachSocketIO(socketIO: Server) {
  io = socketIO;
  return router;
}

export interface Geometry {
  coordinates: [number, number] | [number, number][];
  type: "Point" | "MultiPoint" | "LineString" | "MultiLineString" | "Polygon" | "MultiPolygon";

  // Add other optional properties as needed for other geometry types
  // ...
}

export interface IFeatures {
  _doc?: any;
  type: string;
  geometry: Geometry;
  properties: {
    name: string;
    description: string;
    typeStyle: string;
    typeEvent: string; // Add the typeEvent property
    [key: string]: any;
  };
  [key: string]: any;
}

router.get("/", async (req: Request, res: Response) => {
  try {
    const type = "FeatureCollection";
    const featuresA = await PolygonFModel.find();

    res.json({ type, features: featuresA });
  } catch (err) {
    res.json(err);
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, geoJson } = req.body;

    const data: IFeaturePolygon = {
      id: Date.now().toString(),
      type: "Feature",
      geometry: geoJson,
      properties: {
        name: name,
        description: "135 S Linwood Beach, Linwood",
        typeStyle: "style1",
        typeEvent: "event1"
      },
    };

    const polygon = new PolygonFModel(data);
    await polygon.save();

    // Emit the "newPolygon" event to all connected clients
    io.emit("newPolygon", data);

    res.status(200).json({ message: 'Polygon data saved successfully' });
  } catch (err) {
    res.json({ success: false, error: err });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const deletedPolygon = await PolygonFModel.findOneAndDelete({ id: req.params.id });

    // Emit a "deletePolygon" event with the deleted polygon ID
    io.emit("deletePolygon", req.params.id);

    res.json(deletedPolygon);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "There is a problem, try again later" });
  }
});

export default router;
