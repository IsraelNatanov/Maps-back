import mongoose, { Schema, Document } from 'mongoose';
import { IFeature,IEventFeatures2 } from '../types/eventes';

// export interface IEventFeatures {
//   type: string;
//   features: {
//     type: string;
//     geometry: {
//       type: string;
//       coordinates: number[] ;
//     };
//     properties: {
//       name: string;
//       description: string;
//       typeStyle: string;
//     };
//   }[];
//   _id: string;
//   id: number;
//   label: string;
// }

const FeatureSchema = new mongoose.Schema<IFeature>({
    type: {
      type: String,
      enum: ['Feature'],
      required: true,
    },
    geometry: {
      type: {
        type: String,
        enum: ['Point', 'LineString'],
        required: true,
      },
      coordinates: {
        type: [],
        required: true,
      },
    },
    properties: {
      name: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        // required: true,
      },
      typeStyle: {
        type: String,
        required: true,
      },
    },
  });
  
  const FeatureCollectionSchema = new mongoose.Schema<IEventFeatures2>({
    type: {
      type: String,
      enum: ['FeatureCollection'],
      required: true,
    },
    id: {
      type: Number,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    date:{
      type: String,
      required: true,
    },
    features: {
      type: [FeatureSchema],
      required: true,
    },
  });

export const EventsFeaturesModel = mongoose.model<IEventFeatures2>('fulleventfeatures', FeatureCollectionSchema);
