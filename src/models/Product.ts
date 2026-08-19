import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IProduct extends Document {
  name: {
    en: string;
    ar: string;
  };
  description?: {
    en: string;
    ar: string;
  };
  price: number;
  stock: number;
  category: Types.ObjectId;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      en: { type: String, required: [true, 'English product name is required'], trim: true },
      ar: { type: String, required: [true, 'Arabic product name is required'], trim: true },
    },
    description: {
      en: { type: String, default: '', trim: true },
      ar: { type: String, default: '', trim: true },
    },
    price: { 
      type: Number, 
      required: [true, 'Price is required'], 
      min: [0, 'Price must be positive'] 
    },
    stock: { 
      type: Number, 
      required: [true, 'Stock count is required'], 
      min: [0, 'Stock cannot be negative'], 
      default: 0 
    },
    category: { 
      type: Schema.Types.ObjectId, 
      ref: 'Category', 
      required: [true, 'Category is required'] 
    },
    image: { type: String, default: '/placeholder.svg' },
  },
  {
    timestamps: true,
  }
);

ProductSchema.index({ category: 1 });

export const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);