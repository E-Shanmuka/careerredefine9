import api from '../utils/api';

interface DashboardStats {
  users: number;
  jobs: number;
  courses: number;
  awards: number;
  articles: number;
  queries: number;
  questions: number;
  appointments: number;
  reviews: number;
  recentUsers: any[];
  recentQueries: any[];
  recentQuestions: any[];
  recentAppointments: any[];
}

export const adminService = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    try {
      const response = await api.get('/api/v1/admin/dashboard/stats');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  createReview: async (payload: { course: string; rating: number; comment?: string }) => {
    // Note: backend requires the user to be enrolled in the course
    const response = await api.post('/api/v1/reviews', payload);
    return response.data;
  },
  
  // Add more admin service methods as needed
  getUsers: async (page = 1, limit = 10) => {
    const response = await api.get(`/api/v1/admin/users?page=${page}&limit=${limit}`);
    return response.data;
  },
  
  getJobs: async (page = 1, limit = 10) => {
    const response = await api.get(`/api/v1/jobs?page=${page}&limit=${limit}`);
    return response.data;
  },
  
  getCourses: async (page = 1, limit = 10) => {
    const response = await api.get(`/api/v1/courses?page=${page}&limit=${limit}`);
    return response.data;
  },
  
  getAwards: async (page = 1, limit = 10) => {
    const response = await api.get(`/api/v1/awards?page=${page}&limit=${limit}`);
    return response.data;
  },
  
  getArticles: async (page = 1, limit = 10) => {
    const response = await api.get(`/api/v1/articles?page=${page}&limit=${limit}`);
    return response.data;
  },
  
  getQueries: async (page = 1, limit = 10) => {
    // Admin list endpoint
    const response = await api.get(`/api/v1/queries/admin/all?page=${page}&limit=${limit}`);
    return response.data;
  },

  getQuestions: async (page = 1, limit = 10) => {
    const response = await api.get(`/api/v1/questions?page=${page}&limit=${limit}`);
    return response.data;
  },
  
  getAppointments: async (page = 1, limit = 10) => {
    // Appointments are implemented as bookings; admin list is at /api/v1/bookings
    const response = await api.get(`/api/v1/bookings?page=${page}&limit=${limit}`);
    return response.data;
  },
  
  updateBookingStatus: async (
    id: string,
    payload: { status: 'pending' | 'confirmed' | 'cancelled' | 'completed'; meetingLink?: string; message?: string; adminNotes?: string }
  ) => {
    const response = await api.patch(`/api/v1/bookings/${id}`, payload);
    return response.data;
  },
  
  getReviews: async (page = 1, limit = 10) => {
    // Prefer admin endpoint for complete access
    const response = await api.get(`/api/v1/reviews/admin/all?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Deletes
  deleteUser: async (userId: string) => {
    const response = await api.delete(`/api/v1/admin/users/${userId}`);
    return response.data;
  },

  deleteQuery: async (queryId: string) => {
    const response = await api.delete(`/api/v1/queries/${queryId}`);
    return response.data;
  },

  deleteQuestion: async (questionId: string) => {
    const response = await api.delete(`/api/v1/questions/${questionId}`);
    return response.data;
  },

  deleteJob: async (jobId: string) => {
    const response = await api.delete(`/api/v1/jobs/${jobId}`);
    return response.data;
  },

  deleteCourse: async (courseId: string) => {
    const response = await api.delete(`/api/v1/courses/${courseId}`);
    return response.data;
  },

  deleteArticle: async (articleId: string) => {
    const response = await api.delete(`/api/v1/articles/${articleId}`);
    return response.data;
  },

  deleteReview: async (reviewId: string) => {
    const response = await api.delete(`/api/v1/reviews/${reviewId}`);
    return response.data;
  },

  // Creates (for inline forms)
  createQuery: async (payload: { subject: string; message: string; name?: string; email?: string; phone?: string; course?: string }) => {
    const response = await api.post('/api/v1/queries', payload);
    return response.data;
  },

  createQuestion: async (payload: { subject?: string; message: string; name: string; email: string; phone?: string }) => {
    const response = await api.post('/api/v1/questions', payload);
    return response.data;
  },

  createArticle: async (payload: { title: string; summary: string; content: string; tags?: string[]; isPublished?: boolean; featuredImage?: string; }) => {
    const response = await api.post('/api/v1/articles', payload);
    return response.data;
  },

  createJob: async (payload: any) => {
    // Expecting minimal fields: title, company, location, type, category, description, applicationUrl, isRemote, salary?, requirements?
    const response = await api.post('/api/v1/jobs', payload);
    return response.data;
  },

  createCourse: async (payload: any) => {
    // Backend expects image and syllabus uploads for full creation, but minimal payload may work if image provided.
    const response = await api.post('/api/v1/courses', payload);
    return response.data;
  },

  createBooking: async (payload: { name: string; email: string; phone: string; date: string; timeSlot: string; type?: string; message?: string }) => {
    // Backend booking model: name, email, phone, date, timeSlot, type, message
    const response = await api.post('/api/v1/bookings', payload);
    return response.data;
  }
};
