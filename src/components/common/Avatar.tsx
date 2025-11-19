// src/components/common/Avatar.tsx
import { User } from 'lucide-react';
import { useState } from 'react';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-10 h-10 text-sm',
  md: 'w-12 h-12 text-base',
  lg: 'w-16 h-16 text-lg',
  xl: 'w-24 h-24 text-2xl',
};

const iconSizes = {
  xs: 'w-3 h-3',
  sm: 'w-5 h-5',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
};

export default function Avatar({ src, alt, size = 'md', className = '' }: AvatarProps) {
  const [imageError, setImageError] = useState(false);

  // ✅ Si la imagen falla al cargar, mostrar fallback
  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div
      className={`relative rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 overflow-hidden ${sizeClasses[size]} ${className}`}
    >
      {src && !imageError ? (
        <img
          src={src}
          alt={alt || 'Avatar'}
          onError={handleImageError}
          className="w-full h-full object-cover"
        />
      ) : (
        // ✅ Fallback: Icono de usuario si no hay imagen o falla
        <User className={`text-white ${iconSizes[size]}`} />
      )}
    </div>
  );
}