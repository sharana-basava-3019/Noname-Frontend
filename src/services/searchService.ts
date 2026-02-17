import axios from 'axios';
import type { ResourceData, ResourcesResponse } from './resourceService';

const API_BASE = 'http://localhost:3000/api/search';

// Types
export interface SearchParams {
  // Search
  q?: string; // Full-text search in title/description
  
  // Filters
  tags?: string; // Comma-separated tags
  subject?: string; // Subject name (partial match)
  semester?: number; // Semester number
  year?: number; // Year
  college_id?: number; // College ID
  visibility?: 'public' | 'college' | 'class';
  file_type?: 'pdf' | 'document' | 'image' | 'video' | 'other';
  min_rating?: number; // Minimum average rating (1-5)
  
  // Sorting
  sort_by?: 'created_at' | 'download_count' | 'view_count' | 'title' | 'rating';
  order?: 'ASC' | 'DESC'; // Default: DESC
  
  // Pagination
  page?: number; // Default: 1
  limit?: number; // Default: 20
}

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE,
});

// Add token to requests (optional for search)
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Advanced search
export const searchResources = async (params?: SearchParams): Promise<ResourcesResponse> => {
  try {
    const response = await apiClient.get<ResourcesResponse>('/', { params });
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      return error.response.data;
    }
    throw error;
  }
};

// Autocomplete/suggestions
export const getSearchSuggestions = async (query: string): Promise<{ success: boolean; data?: string[]; error?: string }> => {
  try {
    const response = await apiClient.get('/suggestions', {
      params: { q: query },
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      return error.response.data;
    }
    throw error;
  }
};
