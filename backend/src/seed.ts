import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product';

dotenv.config();

const products = [
  {
    id: '201',
    name: 'Classic Linen Sheet Set',
    nameAr: 'طقم ملاءات كتان كلاسيكي',
    description: 'A timeless 100% flax linen sheet set with a breathable weave and buttery softness.',
    descriptionAr: 'طقم ملاءات من الكتان ١٠٠٪ بلمسة ناعمة ونسيج يسمح بالتهوية.',
    price: 3400,
    originalPrice: 3900,
    images: ['/images/1.jpg', '/images/2.jpg'],
    category: 'Bed Sheets Sets',
    categoryAr: 'أطقم ملاءات السرير',
    subcategory: 'Plain Sheets',
    sizes: [
      { name: 'Single', cm: '90x200' },
      { name: 'Double', cm: '140x200' },
      { name: 'Queen', cm: '160x200' },
      { name: 'King', cm: '180x200' },
    ],
    colors: [
      {
        name: 'Natural',
        nameAr: 'طبيعي',
        hex: '#E6D3B3',
        image: '/images/1.jpg'
      },
      {
        name: 'Stone',
        nameAr: 'رمادي حجري',
        hex: '#A8A29E',
        image: '/images/2.jpg'
      }
    ],
    stock: 22,
    material: '100% Flax Linen',
    materialAr: 'كتان ١٠٠٪',
    careInstructions: 'Cold wash, tumble dry low or line dry',
    careInstructionsAr: 'غسيل بارد، تجفيف منخفض أو على الحبل',
    featured: true,
    bestseller: true,
    newArrival: true,
    rating: 4.9,
    reviewCount: 134
  },
  // ... (I will add the rest of the products later to keep this short)
];

const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  console.error('MONGO_URI is not defined in .env file');
  process.exit(1);
}

const importData = async () => {
  try {
    await mongoose.connect(mongoUri);
    await Product.deleteMany();
    await Product.insertMany(products);
    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error('Error with data import', error);
    process.exit(1);
  }
};

importData();
