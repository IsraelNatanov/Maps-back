import express, { Request, Response } from "express";
import { EventsFeaturesModel } from "../models/eventsFeaturesModel";
import { FeatureModel } from "../models/featuresModel";
import { IEventFeatures, IFeatures } from "../types/FeatureType";
import { IEventFeatures2, IFeature} from "../types/eventes";
import { Server, Socket } from "socket.io";
import { featuresSetting } from "../util/settingEvents";


const router = express.Router();

const getDistance = (x1: number, y1: number, x2: number, y2: number) => {
  const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  return distance;
};

let io: Server; 
export function attachSocketIOEvents(socketIO: Server) {
  io = socketIO;
  return router;
}

router.post("/", async (req: Request, res: Response) => {

  const currentDate = new Date();

  // Get the day, month, and year from the Date object
  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1; // Months are zero-based, so we add 1
  const year = currentDate.getFullYear();
  
  // Format the date as "DD/MM/YYYY"
  const formattedDate = `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
  let getAllEvents: IEventFeatures2[] = await EventsFeaturesModel.find({});
    try {
      
       const { name, geoJson } = req.body;
       featuresSetting[0].geometry = geoJson
       featuresSetting[0].properties.name = name

       
    const getAllPoint = await FeatureModel.find();
    // for (const event of getAllEvents) {
      const eventsArr:IFeature[] = featuresSetting;
     

      let distanceArr: number[] = new Array(getAllPoint.length).fill(100);

 
      if (eventsArr[0].geometry.type === "Point") {
        let lowestCoordinates: [number, number] = [80.83253, 15.16293];

        for (let i = 0; i < getAllPoint.length; i++) {
          let feature = getAllPoint[i];

       
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
          lowestCoordinates = getAllPoint[saveIndex].geometry.coordinates;
              let index = i + 1
          featuresSetting[index].geometry.coordinates[0] = lowestCoordinates
          featuresSetting[index].geometry.coordinates[1] = geoJson.coordinates
          console.log('lowestCoordinates',lowestCoordinates);
          console.log('geometry',  featuresSetting[index].geometry.coordinates);
          
          
        }
      
      }
    
   
        const data:IEventFeatures2 = {
     
          features: featuresSetting,
            name: name,
            type: "FeatureCollection",
            id: getAllEvents.length+1,
            label: name,
            date: formattedDate
          
        }
      
        
        const events = new EventsFeaturesModel(data);

        
        await events.save();
        io.emit("newEvent", data);

        res.status(200).json({ message: 'Event data saved successfully' });
    } catch (err) {
      res.json(err);
    }
  });

router.get("/", async (req: Request, res: Response) => {
  try {
    let features: IEventFeatures[] = await EventsFeaturesModel.find({});

   

    res.json(features);
  } catch (err) {
    res.json(err);
  }
});

export default router;
