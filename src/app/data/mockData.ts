import { Product, Category } from '../types';

import img1 from './Mockassets/1.jpg';
import img2 from './Mockassets/2.jpg';
import img3 from './Mockassets/3.jpg';
import img4 from './Mockassets/4.jpg';
import img5 from './Mockassets/5.jpg';
import img6 from './Mockassets/6.jpg';
import img7 from './Mockassets/7.jpg';
import img8 from './Mockassets/8.jpg';
import img9 from './Mockassets/9.jpg';
import img10 from './Mockassets/10.jpg';
import img11 from './Mockassets/11.jpg'; // Added
import img12 from './Mockassets/12.jpg'; // Added

export const categories: Category[] = [
  {
    id: 'shop',
    name: 'Shop',
    nameAr: 'تسوق',
    slug: 'shop'
  },
  {
    id: 'bed-sheets',
    name: 'Bed Sheets Sets',
    nameAr: 'أطقم ملاءات السرير',
    slug: 'bed-sheets',
    children: [
      { id: 'plain-sheets', name: 'Plain Sheets', nameAr: 'ملاءات سادة', slug: 'plain-sheets' },
      { id: 'printed-sheets', name: 'Printed Sheets', nameAr: 'ملاءات مطبوعة', slug: 'printed-sheets' },
      { id: 'flat-bedsheet', name: 'Flat Bedsheet', nameAr: 'ملاءة مسطحة', slug: 'flat-bedsheet' },
      { id: 'fitted-bedsheet', name: 'Fitted Bedsheet', nameAr: 'ملاءة مطاطية', slug: 'fitted-bedsheet' }
    ]
  },
  {
    id: 'duvets',
    name: 'Duvets',
    nameAr: 'لحاف',
    slug: 'duvets',
    children: [
      { id: '100-cotton', name: '100% Cotton', nameAr: 'قطن ١٠٠٪', slug: '100-cotton' }
    ]
  },
  {
    id: 'coverlets',
    name: 'Coverlets',
    nameAr: 'أغطية السرير',
    slug: 'coverlets',
    children: [
      { id: 'sustainable-fabric', name: 'Sustainable Fabric', nameAr: 'نسيج مستدام', slug: 'sustainable-fabric' },
      { id: 'honeycomb-coverlet', name: 'Honeycomb Coverlet', nameAr: 'غطاء خلية النحل', slug: 'honeycomb-coverlet' }
    ]
  },
  {
    id: 'towels-bathrobes',
    name: 'Towels & Bathrobes',
    nameAr: 'المناشف وأرواب الحمام',
    slug: 'towels-bathrobes'
  },
  {
    id: 'pillows',
    name: 'Pillows',
    nameAr: 'وسائد',
    slug: 'pillows'
  },
  {
    id: 'add-ons',
    name: 'Add Ons',
    nameAr: 'إضافات',
    slug: 'add-ons'
  },
  {
    id: 'sale',
    name: 'Sale',
    nameAr: 'عروض',
    slug: 'sale'
  }
];

export const products: Product[] = [
  {
    id: '201',
    name: 'Classic Linen Sheet Set',
    nameAr: 'طقم ملاءات كتان كلاسيكي',
    description: 'A timeless 100% flax linen sheet set with a breathable weave and buttery softness.',
    descriptionAr: 'طقم ملاءات من الكتان ١٠٠٪ بلمسة ناعمة ونسيج يسمح بالتهوية.',
    price: 3400,
    originalPrice: 3900,
    images: [img1, img2],
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
        image: img1
      },
      {
        name: 'Stone',
        nameAr: 'رمادي حجري',
        hex: '#A8A29E',
        image: img2
      }
    ],
    stock: 22,
    threadCount: undefined,
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
  {
    id: '202',
    name: 'Washed Linen Duvet Cover Set',
    nameAr: 'غطاء لحاف من الكتان المغسول',
    description: 'Soft, breathable linen duvet cover with a relaxed texture that improves with every wash.',
    descriptionAr: 'غطاء لحاف من الكتان المغسول يتميز بالنعومة والتهوية، ويصبح أفضل مع كل غسلة.',
    price: 2800,
    originalPrice: 3200,
    images: [img3, img4],
    category: 'Duvets',
    categoryAr: 'لحاف',
    subcategory: '100% Linen',
    sizes: [
      { name: 'Single', cm: '90x200' },
      { name: 'Double', cm: '140x200' },
      { name: 'Queen', cm: '160x200' },
      { name: 'King', cm: '180x200' },
    ],
    colors: [
      {
        name: 'Blush',
        nameAr: 'وردي فاتح',
        hex: '#F9D3D3',
        image: img3
      },
      {
        name: 'Ivory',
        nameAr: 'عاجي',
        hex: '#FFFFF0',
        image: img4
      }
    ],
    stock: 18,
    threadCount: undefined,
    material: '100% Linen',
    materialAr: 'كتان ١٠٠٪',
    careInstructions: 'Gentle machine wash cold, line dry',
    careInstructionsAr: 'غسيل بماء بارد على دورة خفيفة، تجفيف على الحبل',
    featured: false,
    bestseller: true,
    newArrival: false,
    rating: 4.8,
    reviewCount: 102
  },
  {
    id: '203',
    name: 'Linen Pillowcase Set',
    nameAr: 'طقم وسادات كتان',
    description: 'Set of two luxurious linen pillowcases with an envelope closure. Ultra-soft and breathable.',
    descriptionAr: 'طقم من وسادتين من الكتان الفاخر بإغلاق مغلف، ناعمة وقابلة للتهوية.',
    price: 750,
    originalPrice: 950,
    images: [img5, img6],
    category: 'Add Ons',
    categoryAr: 'إضافات',
    subcategory: 'Linen Pillowcases',
    sizes: [
      { name: 'Standard', cm: '50x70' }, // Converted to Size object
      { name: 'King', cm: '50x90' },     // Converted to Size object
    ],
    colors: [
      {
        name: 'Linen White',
        nameAr: 'أبيض كتان',
        hex: '#F8F8F4',
        image: img5
      },
      {
        name: 'Beige',
        nameAr: 'بيج',
        hex: '#F5F5DC',
        image: img6
      }
    ],
    stock: 35,
    threadCount: undefined,
    material: '100% Linen',
    materialAr: 'كتان ١٠٠٪',
    careInstructions: 'Cold wash, low iron if needed',
    careInstructionsAr: 'غسيل بارد، كوي بدرجة منخفضة إذا لزم الأمر',
    featured: true,
    bestseller: false,
    newArrival: true,
    rating: 4.6,
    reviewCount: 67
  },
  {
    id: '204',
    name: 'Luxury Bath Towel Set',
    nameAr: 'طقم مناشف استحمام فاخرة',
    description: 'A set of plush linen bath towels designed for maximum absorbency and softness.',
    descriptionAr: 'طقم مناشف استحمام من الكتان مصمم للامتصاص القصوى والنعومة.',
    price: 1200,
    originalPrice: 1500,
    images: [img7, img8],
    category: 'Towels & Bathrobes',
    categoryAr: 'المناشف وأرواب الحمام',
    subcategory: 'Towels',
    sizes: [
      { name: 'Small', cm: '50x100' },
      { name: 'Medium', cm: '70x140' },
      { name: 'Large', cm: '90x180' },
    ],
    colors: [
      {
        name: 'Seafoam',
        nameAr: 'أخضر بحر',
        hex: '#A3D8D4',
        image: img7
      },
      {
        name: 'Slate',
        nameAr: 'أسود متدرج',
        hex: '#6D8299',
        image: img8
      }
    ],
    stock: 25,
    threadCount: undefined,
    material: '100% Linen Blend',
    materialAr: 'خليط كتان ١٠٠٪',
    careInstructions: 'Machine wash warm, tumble dry low',
    careInstructionsAr: 'غسيل بماء دافئ، تجفيف منخفض',
    featured: false,
    bestseller: false,
    newArrival: true,
    rating: 4.7,
    reviewCount: 89
  },
  {
    id: '205',
    name: 'Handwoven Decorative Throw',
    nameAr: 'بطانية ديكور منسوجة يدوياً',
    description: 'A stylish handwoven throw perfect for adding warmth and texture to any room.',
    descriptionAr: 'بطانية ديكور منسوجة يدوياً مثالية لإضافة الدفء والملمس لأي غرفة.',
    price: 1800,
    originalPrice: 2200,
    images: [img9, img10],
    category: 'Coverlets',
    categoryAr: 'أغطية السرير',
    subcategory: 'Throws',
    sizes: [
      { name: 'Small', cm: '100x150' },
      { name: 'Large', cm: '130x170' },
    ],
    colors: [
      {
        name: 'Terracotta',
        nameAr: 'تراكوتا',
        hex: '#C85A54',
        image: img9
      },
      {
        name: 'Ochre',
        nameAr: 'أوكر',
        hex: '#D4A017',
        image: img10
      }
    ],
    stock: 15,
    threadCount: undefined,
    material: '100% Linen',
    materialAr: 'كتان ١٠٠٪',
    careInstructions: 'Dry clean only',
    careInstructionsAr: 'تنظيف جاف فقط',
    featured: true,
    bestseller: false,
    newArrival: false,
    rating: 4.5,
    reviewCount: 54
  },
  {
    id: '206',
    name: 'Outdoor Linen Cushion Cover',
    nameAr: 'غطاء وسادة كتان خارجي',
    description: 'Durable linen cushion cover designed for outdoor use, with UV and water resistance.',
    descriptionAr: 'غطاء وسادة من الكتان مصمم للاستخدام الخارجي مع مقاومة الأشعة فوق البنفسجية والماء.',
    price: 900,
    originalPrice: 1100,
    images: [img11, img12],
    category: 'Add Ons',
    categoryAr: 'إضافات',
    subcategory: 'Cushion Covers',
    sizes: [
      { name: 'Square', cm: '50x50' },
      { name: 'Rectangle', cm: '40x60' },
    ],
    colors: [
      {
        name: 'Sage',
        nameAr: 'سفير',
        hex: '#9AB87A',
        image: img11
      },
      {
        name: 'Charcoal',
        nameAr: 'فحمي',
        hex: '#36454F',
        image: img12
      }
    ],
    stock: 30,
    threadCount: undefined,
    material: '100% Weather-Resistant Linen',
    materialAr: 'كتان مقاوم للطقس ١٠٠٪',
    careInstructions: 'Spot clean with damp cloth',
    careInstructionsAr: 'تنظيف موضعي بقماش رطب',
    featured: false,
    bestseller: true,
    newArrival: true,
    rating: 4.4,
    reviewCount: 73
  },
];