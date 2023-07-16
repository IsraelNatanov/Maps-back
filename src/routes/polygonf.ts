// Replace the existing code in polygonFeatures.ts with the following:

import { Request, Response, Router } from "express";
import { EventsFeaturesModel } from "../models/eventsFeaturesModel";
import { IEventFeatures, IFeaturePolygon } from "../types/FeatureType";
import { PolygonFModel } from "../models/polygonFModel";
import bodyParser from "body-parser";
import { Server, Socket } from "socket.io";

const router = Router();
router.use(bodyParser.json());

// Pass the initialized socket.io server instance to the router
export const attachSocketIO = (io: Server) => {
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
          typeEvent: "event1",
        },
      };
     

      const polygon = new PolygonFModel(data);
      await polygon.save();

      // Emit the new polygon data to all connected clients
      io.emit("newPolygon", data);

      res.status(200).json({ message: "Polygon data saved successfully" });
    } catch (err) {
      res.json({ success: false, error: err });
    }
  });

  router.delete("/:id", async (req: Request, res: Response) => {
    try {
      let data = await PolygonFModel.deleteOne({ id: req.params.id });

      // Emit the deleted polygon ID to all connected clients
      io.emit("deletedPolygon", req.params.id);

      res.json(data);
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "There is a problem, try again later" });
    }
  });

  return router;
};
