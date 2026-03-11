import { IProduct } from './product.interface';

export interface ICartItem {
  product: IProduct;
  quantity: number;
  size?: string;
  color?: string;
}