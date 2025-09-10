import mongoose, { Schema, Document } from 'mongoose';

interface ISize {
  name: string;
  cm: string;
}

interface IColor {
  name: string;
  nameAr: string;
  hex: string;
  image: string;
}

export interface IProduct extends Document {
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  price: number;
  originalPrice: number;
  images: string[];
  category: string;
  categoryAr: string;
  subcategory: string;
  sizes: ISize[];
  colors: IColor[];
  stock: number;
  threadCount?: number;
  material: string;
  materialAr: string;
  careInstructions: string;
  careInstructionsAr: string;
  featured: boolean;
  bestseller: boolean;
  newArrival: boolean;
  rating: number;
  reviewCount: number;
}

const SizeSchema: Schema = new Schema({
  name: { type: String, required: true },
  cm: { type: String, required: true },
});

const ColorSchema: Schema = new Schema({
  name: { type: String, required: true },
  nameAr: { type: String, required: true },
  hex: { type: String, required: true },
  image: { type: String, required: true },
});

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  nameAr: { type: String, required: true },
  description: { type: String, required: true },
  descriptionAr: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number, required: true },
  images: [{ type: String, required: true }],
  category: { type: String, required: true },
  categoryAr: { type: String, required: true },
  subcategory: { type: String, required: true },
  sizes: [SizeSchema],
  colors: [ColorSchema],
  stock: { type: Number, required: true },
  threadCount: { type: Number },
  material: { type: String, required: true },
  materialAr: { type: String, required: true },
  careInstructions: { type: String, required: true },
  careInstructionsAr: { type: String, required: true },
  featured: { type: Boolean, default: false },
  bestseller: { type: Boolean, default: false },
  newArrival: { type: Boolean, default: false },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
});

export default mongoose.model<IProduct>('Product', ProductSchema);
