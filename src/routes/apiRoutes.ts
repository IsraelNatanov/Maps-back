import express from 'express';
import { Request, Response } from 'express';
import { addProduct, getAllProducts } from './socketEvents';

const router = express.Router();

router.get('/products', (req: Request, res: Response) => {
  // Logic to retrieve all products
  const products = getAllProducts();
  res.status(200).json(products);
});

router.post('/products', (req: Request, res: Response) => {
  const { productName } = req.body;
  addProduct(productName);
  res.status(200).json({ message: 'Product added successfully' });
});

export default router;
