import axios from 'axios';

const API_BASE = 'http://localhost:3000/api/users';

// Types
export interface UserData {
  id: number;
  name: string;
  email: string;
  college_id: number;
  college_name?: string;
  class_name: string | null;
  year: number | null;
  profile_picture: string | null;
  bio: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LeaderboardEntry {
  id: number;
  name: string;
  email: string;
  college_id: number;
  college_name: string;
  class_name: string | null;
  year: number | null;
  profile_picture: string | null;
  upload_count: string;
  download_count: string;
  total_points: string;
  rank: number;
}

export interface UsersResponse {
  success: boolean;
  data?: UserData[];
  error?: string;
}

export interface UserResponse {
  success: boolean;
  data?: UserData;
  error?: string;
}

export interface LeaderboardResponse {
  success: boolean;
  data?: LeaderboardEntry[];
  error?: string;
}

export interface UserStatsResponse {
  success: boolean;
  data?: {
    user_id: number;
    name: string;
    email: string;
    upload_count: string;
    download_count: string;
    total_rating_count: string;
    avg_rating_received: string;
    total_points: string;
  };
  error?: string;
}

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE,
});

// Add token to requests (optional for most endpoints)
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

// Get all users
export const getAllUsers = async (): Promise<UsersResponse> => {
  try {
    const response = await apiClient.get<UsersResponse>('/');
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      return error.response.data;
    }
    throw error;
  }
};

// Get user by ID
export const getUserById = async (id: number): Promise<UserResponse> => {
  try {
    const response = await apiClient.get<UserResponse>(`/${id}`);
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      return error.response.data;
    }
    throw error;
  }
};

// Get leaderboard
export const getLeaderboard = async (params?: { limit?: number; college_id?: number }): Promise<LeaderboardResponse> => {
  try {
    const response = await apiClient.get<LeaderboardResponse>('/leaderboard', { params });
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      return error.response.data;
    }
    throw error;
  }
};

// Get user statistics
export const getUserStats = async (userId: number): Promise<UserStatsResponse> => {
  try {
    const response = await apiClient.get<UserStatsResponse>(`/${userId}/stats`);
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      return error.response.data;
    }
    throw error;
  }
};
