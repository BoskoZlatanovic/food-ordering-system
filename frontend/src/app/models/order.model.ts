import {User} from "./user.model";

export enum OrderStatus {
  ORDERED = 'ORDERED',
  PREPARING = 'PREPARING',
  IN_DELIVERY = 'IN_DELIVERY',
  DELIVERED = 'DELIVERED',
  CANCELED = 'CANCELED'
}

export interface Dish {
  id: number;
  name: string;
  price: number;
  description: string;
}

export interface Order {
  id?: number;
  status: OrderStatus;
  createdBy: User;
  active: boolean;
  items: Dish[];
  createdAt?: Date;
  scheduledFor?: Date;
}
