// src/components/common/Avatar.tsx
import { User } from 'lucide-react';

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

export default function Avatar({ src, alt, size = 'md', className = '' }: AvatarProps) {
  // ✅ Si no hay src o la imagen falla, mostrar icono por defecto
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.style.display = 'none';
  };

  return (
    <div
      className={`relative rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 overflow-hidden ${sizeClasses[size]} ${className}`}
    >
      {src ? (
        <>
          <img
            src={src}
            alt={alt || 'Avatar'}
            onError={handleImageError}
            className="w-full h-full object-cover"
          />
          {/* Fallback icon si la imagen falla */}
          <User className="absolute inset-0 m-auto text-white w-1/2 h-1/2" />
        </>
      ) : (
        // Sin src, mostrar icono directo
        <User className="text-white w-1/2 h-1/2" />
      )}
    </div>
  );
}