import React from 'react';

interface Category {
  id: string;
  name: string;
  imageUrl: string;
  viewerCount: number;
}

interface CategoryGridProps {
  categories?: Category[];
}

const CategoryGrid: React.FC<CategoryGridProps> = ({ categories = [] }) => {
  // Placeholder categories if none provided
  const defaultCategories: Category[] = [
    {
      id: '1',
      name: 'Gaming',
      imageUrl: '/assets/images/categories/gaming.jpg',
      viewerCount: 150000
    },
    {
      id: '2',
      name: 'IRL',
      imageUrl: '/assets/images/categories/irl.jpg',
      viewerCount: 75000
    },
    // Add more default categories as needed
  ];

  const displayCategories = categories.length > 0 ? categories : defaultCategories;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {displayCategories.map((category) => (
        <div
          key={category.id}
          className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer transition-transform hover:scale-105"
        >
          <img
            src={category.imageUrl}
            alt={category.name}
            className="w-full aspect-[4/5] object-cover"
          />
          <div className="p-3">
            <h3 className="font-medium text-white">{category.name}</h3>
            <p className="text-gray-400 text-sm">
              {(category.viewerCount / 1000).toFixed(1)}K viewers
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoryGrid;