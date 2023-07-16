import { Server, Socket } from 'socket.io';

let io: Server;
const products: Product[] = [];

export function initSocket(socketIO: Server): void {
  io = socketIO;

  io.on('connection', (socket: Socket) => {
    console.log('A user connected');
    socket.emit('products', products);
  });
}

export function addProduct(productName: string): void {
  const newProduct: Product = { name: productName };
  products.push(newProduct);
  io.emit('newProduct', newProduct);
}

export function getAllProducts(): Product[] {
  return products;
}

interface Product {
  name: string;
}

