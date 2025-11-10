import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface Category {
  id: string;
  name: string;
  imageUrl: string;
  viewers: number;
}

interface CategoryGridProps {
  categories?: Category[];
}

const defaultCategories: Category[] = [
  {
    id: '1',
    name: 'League of Legends',
    imageUrl: '/images/categories/lol.jpg',
    viewers: 250000
  },
  {
    id: '2',
    name: 'Just Chatting',
    imageUrl: '/images/categories/just-chatting.jpg',
    viewers: 180000
  },
  {
    id: '3',
    name: 'Valorant',
    imageUrl: '/images/categories/valorant.jpg',
    viewers: 120000
  },
  {
    id: '4',
    name: 'Counter-Strike 2',
    imageUrl: '/images/categories/cs2.jpg',
    viewers: 95000
  }
];

export default function CategoriesGrid({ categories = defaultCategories }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
      {categories.map((category) => (
        <Link 
          to={`/category/${category.id}`} 
          key={category.id}
          className="group relative overflow-hidden rounded-lg bg-slate-800 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative aspect-[16/9] w-full overflow-hidden"
          >
            <img
              src={category.imageUrl}
              alt={category.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </motion.div>
          <div className="p-4">
            <h3 className="mb-1 text-lg font-bold text-white">{category.name}</h3>
            <p className="text-sm text-slate-300">
              {category.viewers.toLocaleString()} viewers
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}