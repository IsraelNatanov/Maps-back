import mongoose, { Schema, Document, Error } from 'mongoose';
import Joi from "joi";
import { IFeatures } from '../types/FeatureType';
import express, {  } from "express";

interface IPolygonFModel extends IFeatures, Document {}

const PolygonFSchema: Schema = new mongoose.Schema({
    id:{ type: String, required: true },
  type: { type: String, required: true },
  geometry: {
    coordinates: { type: Array, required: true },
    type: { type: String, required: true },
  },
  properties: {
    name: { type: String, required: true },
    description: { type: String, required: true },
    typeStyle: { type: String, required: true },
  },
});



export const PolygonFModel = mongoose.model<IPolygonFModel>('polygonfeatures', PolygonFSchema);
