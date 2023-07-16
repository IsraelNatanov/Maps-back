import express, { Request, Response } from "express";
import { EventsFeaturesModel } from "../models/eventsFeaturesModel";
import { FeatureModel } from "../models/featuresModel";
import { IEventFeatures } from "../types/FeatureType";

const router = express.Router();



router.get("/", async (req: Request, res: Response) => {
  try {
    const type = "FeatureCollection";
    const featuresA = await FeatureModel.find();
    const eventFeatures: IEventFeatures[] = await EventsFeaturesModel.find({});
    let j = 0;
    let lowestCoordinates: [number, number] = [Infinity, Infinity];
    
    res.json({ type, features: featuresA });
  } catch (err) {
    res.json(err);
  }
});

export default router;
