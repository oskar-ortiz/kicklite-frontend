
export const formatViewerCount = (count?: number | null): string => {
  if (count == null || isNaN(Number(count))) {
    return "0"; // Valor por defecto seguro
  }

  if (count >= 1_000_000) {
    return `${(count / 1_000_000).toFixed(1)}M`;
  }

  if (count >= 1_000) {
    return `${(count / 1_000).toFixed(1)}K`;
  }

  return count.toString();
};

/**
 * Formatea duración en segundos a H:MM:SS o M:SS
 */
export const formatDuration = (seconds?: number | null): string => {
  if (seconds == null || isNaN(Number(seconds))) {
    return "0:00";
  }

  const total = Math.max(0, seconds);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const remainingSeconds = total % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  }

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

/**
 * Formatea una fecha a tiempo relativo.
 * Soporta null, undefined y strings inválidos.
 */
export const formatRelativeTime = (date?: Date | string | null): string => {
  if (!date) return "unknown";

  const parsed = new Date(date);
  if (isNaN(parsed.getTime())) return "unknown";

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - parsed.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays}d ago`;

  return parsed.toLocaleDateString();
};
