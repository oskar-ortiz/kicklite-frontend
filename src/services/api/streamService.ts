// src/services/api/streamService.ts
import { api, API_ENDPOINTS } from './api.config';

export interface Stream {
  id: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  viewerCount: number;
  isLive: boolean;
  category: string;
  user: {
    id: string;
    username: string;
    avatarUrl?: string;
  };
  tags?: string[];
  startedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  viewerCount: number;
  thumbnailUrl?: string;
  tags?: string[];
}

/**
 * Obtener todos los streams en vivo
 */
export const getLiveStreams = async (): Promise<Stream[]> => {
  try {
    console.log('📡 Fetching live streams...');
    const response = await api.get(API_ENDPOINTS.streams.live);
    console.log('✅ Live streams:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ Error fetching live streams:', error.message);
    // Retornar array vacío en caso de error
    return [];
  }
};

/**
 * Obtener un stream por ID
 */
export const getStreamById = async (streamId: string): Promise<Stream | null> => {
  try {
    console.log('📡 Fetching stream:', streamId);
    const response = await api.get(API_ENDPOINTS.streams.byId(streamId));
    console.log('✅ Stream:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ Error fetching stream:', error.message);
    return null;
  }
};

/**
 * Obtener todas las categorías
 */
export const getCategories = async (): Promise<Category[]> => {
  try {
    console.log('📡 Fetching categories...');
    const response = await api.get(API_ENDPOINTS.categories.all);
    console.log('✅ Categories:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ Error fetching categories:', error.message);
    return [];
  }
};

export default {
  getLiveStreams,
  getStreamById,
  getCategories,
};