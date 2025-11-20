// src/pages/Categories/Categories.tsx
import { useEffect, useState } from "react";
import {
  getCategories,
  type Category as ApiCategory,
} from "../../services/api/streamService";
import CategoryGrid from "../../components/home/CategoryGrid";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getCategories();
        setCategories(data || []);
      } catch (err) {
        console.error("❌ Error cargando categorías:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // Adaptamos del tipo del backend al tipo que espera CategoryGrid
  const mappedCategories = categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    imageUrl:
      cat.thumbnailUrl ||
      `https://via.placeholder.com/300x200?text=${encodeURIComponent(
        cat.name
      )}`,
    viewers: cat.viewerCount,
  }));

  return (
    <div className="min-h-screen bg-slate-950 pt-20">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-6">
          Categorías de Streaming
        </h1>

        {loading ? (
          <p className="text-slate-400">Cargando categorías...</p>
        ) : mappedCategories.length === 0 ? (
          <p className="text-slate-400">
            No se encontraron categorías por el momento.
          </p>
        ) : (
          <CategoryGrid categories={mappedCategories} />
        )}
      </div>
    </div>
  );
}
