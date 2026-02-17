import axios from 'axios';

const API_BASE = 'http://localhost:3000/api/resources';

// Types
export interface UploadResourceRequest {
  file: File;
  title: string;
  description?: string;
  visibility: 'public' | 'college' | 'class';
  subject?: string;
  semester?: number;
  year?: number;
  tags?: string; // comma-separated
}

export interface ResourceFilters {
  page?: number;
  limit?: number;
  subject?: string;
  semester?: number;
  year?: number;
  visibility?: 'public' | 'college' | 'class';
  college_id?: number;
  tags?: string;
  search?: string;
  sort_by?: 'created_at' | 'download_count' | 'view_count' | 'title';
  order?: 'ASC' | 'DESC';
}

export interface ResourceData {
  id: number;
  title: string;
  description: string | null;
  file_url: string;
  file_name: string;
  file_size: number;
  file_type: string;
  mime_type: string;
  user_id: number;
  uploader_name?: string;
  uploader_id?: number;
  college_id: number;
  college_name?: string;
  class_name: string | null;
  visibility: string;
  subject: string | null;
  semester: number | null;
  year: number | null;
  download_count: number;
  view_count: number;
  avg_rating?: string;
  rating_count?: string;
  tags: string[] | null;
  is_verified?: boolean;
  is_reported?: boolean;
  created_at: string;
  updated_at: string;
}

export interface ResourcesResponse {
  success: boolean;
  data?: ResourceData[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  error?: string;
}

export interface SingleResourceResponse {
  success: boolean;
  data?: ResourceData;
  error?: string;
}

export interface UploadResponse {
  success: boolean;
  message?: string;
  data?: ResourceData;
  error?: string;
}

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE,
});

// Add token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Auth token added to request:', config.method?.toUpperCase(), config.url);
    } else {
      console.warn('No auth token found for request:', config.method?.toUpperCase(), config.url);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Upload resource
export const uploadResource = async (data: UploadResourceRequest): Promise<UploadResponse> => {
  try {
    const formData = new FormData();
    formData.append('file', data.file);
    formData.append('title', data.title);
    formData.append('visibility', data.visibility);
    
    if (data.description) formData.append('description', data.description);
    if (data.subject) formData.append('subject', data.subject);
    if (data.semester) formData.append('semester', data.semester.toString());
    if (data.year) formData.append('year', data.year.toString());
    if (data.tags) formData.append('tags', data.tags);

    console.log('Uploading resource with data:', {
      title: data.title,
      visibility: data.visibility,
      subject: data.subject,
      semester: data.semester,
      year: data.year,
      tags: data.tags,
      fileName: data.file.name
    });

    const response = await apiClient.post<UploadResponse>('/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('Upload response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Upload error:', error);
    if (error.response?.data) {
      return error.response.data;
    }
    return {
      success: false,
      error: error.message || 'Upload failed'
    };
  }
};

// Get all resources with filters
export const getResources = async (filters?: ResourceFilters): Promise<ResourcesResponse> => {
  try {
    const response = await apiClient.get<ResourcesResponse>('/', { params: filters });
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      return error.response.data;
    }
    throw error;
  }
};

// Get resource by ID
export const getResourceById = async (id: number): Promise<SingleResourceResponse> => {
  try {
    const response = await apiClient.get<SingleResourceResponse>(`/${id}`);
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      return error.response.data;
    }
    throw error;
  }
};

// Get user's uploaded resources
export const getMyResources = async (filters?: ResourceFilters): Promise<ResourcesResponse> => {
  try {
    console.log('Calling GET /api/resources/my with filters:', filters);
    const response = await apiClient.get<ResourcesResponse>('/my', { params: filters });
    console.log('GET /my response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('GET /my error:', error);
    if (error.response?.data) {
      return error.response.data;
    }
    return {
      success: false,
      error: error.message || 'Failed to fetch resources',
      data: []
    };
  }
};

// Update resource
export const updateResource = async (
  id: number,
  data: Partial<UploadResourceRequest>
): Promise<UploadResponse> => {
  try {
    const response = await apiClient.put<UploadResponse>(`/${id}`, data);
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      return error.response.data;
    }
    throw error;
  }
};

// Delete resource
export const deleteResource = async (id: number): Promise<{ success: boolean; message?: string; error?: string }> => {
  try {
    const response = await apiClient.delete(`/${id}`);
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      return error.response.data;
    }
    throw error;
  }
};

// Download resource (increments download count)
export const downloadResource = async (id: number): Promise<void> => {
  try {
    const response = await apiClient.get(`/${id}/download`, {
      responseType: 'blob',
    });
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    
    // Get filename from content-disposition header or use default
    const contentDisposition = response.headers['content-disposition'];
    const filename = contentDisposition
      ? contentDisposition.split('filename=')[1]?.replace(/"/g, '')
      : `download-${id}`;
    
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Download error:', error);
    throw error;
  }
};
