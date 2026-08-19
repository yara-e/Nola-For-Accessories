import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICategory extends Document {
  name: {
    en: string;
    ar: string;
  };
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: {
      en: { type: String, required: [true, 'English category name is required'], trim: true },
      ar: { type: String, required: [true, 'Arabic category name is required'], trim: true },
    },
    image: { type: String, default: '' },
  },
  {
    timestamps: true,
  }
);

// Prevent cached schema mismatch during Next.js Hot Module Replacement (HMR)
// if (process.env.NODE_ENV === 'development' && mongoose.models.Category) {
//   delete mongoose.models.Category;
// }

export const Category: Model<ICategory> =
  mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);