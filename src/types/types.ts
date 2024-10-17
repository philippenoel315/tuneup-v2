import { Optional } from 'sequelize';

export interface OrderAttributes {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  ski_brand: string;
  ski_model: string;
  ski_length: number;
  service: string;
  status: 'En attente' | 'En cours' | 'Completé' | 'Annulé';
  notes: string;
}

export interface EmailOptions {
    to: string;
    subject: string;
    text: string;
    html: string;
  }

export interface OrderCreationAttributes extends OrderAttributes {}
