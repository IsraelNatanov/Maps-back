import express, { Request, Response } from "express";
import { EventsFeaturesModel } from "../models/eventsFeaturesModel";
import { FeatureModel } from "../models/featuresModel";
import { IEventFeatures, IFeatures } from "../types/FeatureType";
import { Server as WebSocketServer } from "socket.io";
import { createServer } from "http";

const router = express.Router();

const getDistance = (x1: number, y1: number, x2: number, y2: number) => {
  const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  return distance;
};





router.get("/", async (req: Request, res: Response) => {
  try {
    let features: IEventFeatures[] = await EventsFeaturesModel.find({});

    const featuresA = await FeatureModel.find();

    for (const event of features) {
      const eventsArr = event.features;
     

      let distanceArr: number[] = new Array(featuresA.length).fill(100);

 
      if (eventsArr[0].geometry.type === "Point") {
        let lowestCoordinates: [number, number] = [80.83253, 15.16293];

        for (let i = 0; i < featuresA.length; i++) {
          let feature = featuresA[i];

       
          if (feature.geometry.type === "Point") {
            
            const distance = getDistance(
              eventsArr[0].geometry.coordinates[0],
              eventsArr[0].geometry.coordinates[1],
              feature.geometry.coordinates[0],
              feature.geometry.coordinates[1]
            );
         
            let distanceNumber = Number(distance.toFixed(5));
            distanceArr[i] = distanceNumber;

            
          }
        }
     
        for (let i = 0; i < 3; i++) {
          let minDistance = 200;
          let saveIndex: number = 0;
          for (let j = 0; j < distanceArr.length; j++) {
            if (distanceArr[j] < minDistance) {
              
              
              saveIndex = j;
              minDistance = distanceArr[j];
            }
          }
        

          distanceArr[saveIndex] = 200;
          lowestCoordinates = featuresA[saveIndex].geometry.coordinates;
      
          let index = i + 1
          let filter = { _id: event._id };
    

          const update = {
            $set: {
              ["features." + index + ".geometry.coordinates.0"]:
                lowestCoordinates,
            },
          };

          await EventsFeaturesModel.updateOne(filter, update);
        }
      
      }
    
    }
    const type: string = "FeatureCollection";
    features = await EventsFeaturesModel.find({});
    let featuresWithType = features.map((feature, index) => ({
      ...feature._doc,
      type,
      id: ++index,
      label: `אירוע מספר ${index}`,
    })); // add the "type" property to each feature
  

    res.json(featuresWithType);
  } catch (err) {
    res.json(err);
  }
});

export default router;
