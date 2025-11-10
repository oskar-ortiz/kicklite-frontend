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
  }
];

const CategoryGrid = ({ categories = defaultCategories }: CategoryGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
      {categories.map((category) => (
        <Link to={`/category/${category.id}`} key={category.id}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative rounded-lg overflow-hidden shadow-lg bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            <div className="aspect-w-16 aspect-h-9">
              <img
                src={category.imageUrl}
                alt={category.name}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg text-white">{category.name}</h3>
              <p className="text-gray-400">{category.viewers.toLocaleString()} viewers</p>
            </div>
          </motion.div>
        </Link>
      ))}
    </div>
  );
};

export default CategoryGrid;