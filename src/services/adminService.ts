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
      // Backend shape: { status, data: { ...stats } }
      return response.data?.data;
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
    return response.data?.data; // { users }
  },
  
  getJobs: async (page = 1, limit = 10) => {
    const response = await api.get(`/api/v1/jobs?page=${page}&limit=${limit}`);
    return response.data?.data; // { jobs }
  },
  
  getCourses: async (page = 1, limit = 10) => {
    const response = await api.get(`/api/v1/courses?page=${page}&limit=${limit}`);
    return response.data?.data; // { courses }
  },
  
  getAwards: async (page = 1, limit = 10) => {
    const response = await api.get(`/api/v1/awards?page=${page}&limit=${limit}`);
    return response.data?.data; // { awards }
  },
  
  getArticles: async (page = 1, limit = 10) => {
    const response = await api.get(`/api/v1/articles?page=${page}&limit=${limit}`);
    return response.data?.data; // { articles }
  },
  
  getQueries: async (page = 1, limit = 10) => {
    // Admin list endpoint (admin-only route at GET /api/v1/queries)
    const response = await api.get(`/api/v1/queries?page=${page}&limit=${limit}`);
    return response.data?.data; // { queries }
  },

  getQuestions: async (page = 1, limit = 10) => {
    const response = await api.get(`/api/v1/questions?page=${page}&limit=${limit}`);
    return response.data?.data; // { questions }
  },
  
  getAppointments: async (page = 1, limit = 10) => {
    // Appointments are implemented as bookings; admin list is at /api/v1/bookings
    const response = await api.get(`/api/v1/bookings?page=${page}&limit=${limit}`);
    return response.data?.data; // { bookings }
  },
  
  updateBookingStatus: async (
    id: string,
    payload: { status: 'pending' | 'confirmed' | 'rejected' | 'cancelled' | 'completed'; meetingLink?: string; message?: string; adminNotes?: string }
  ) => {
    const response = await api.patch(`/api/v1/bookings/${id}`, payload);
    return response.data;
  },
  
  getReviews: async (page = 1, limit = 10) => {
    // Prefer admin endpoint for complete access
    const response = await api.get(`/api/v1/reviews/admin/all?page=${page}&limit=${limit}`);
    return response.data?.data; // { reviews }
  },

  getBookings: async (page = 1, limit = 10) => {
    const response = await api.get(`/api/v1/bookings?page=${page}&limit=${limit}`);
    return response.data?.data; // { bookings }
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

  deleteBooking: async (bookingId: string) => {
    const response = await api.delete(`/api/v1/bookings/${bookingId}`);
    return response.data;
  },

  confirmBooking: async (bookingId: string, meetingLink: string) => {
    const response = await api.patch(`/api/v1/bookings/${bookingId}`, {
      status: 'confirmed',
      meetingLink,
    });
    return response.data?.data; // { booking }
  },

  // Creates (for inline forms)
  createQuery: async (payload: { subject: string; message: string; name?: string; email?: string; phone?: string; course?: string }) => {
    const response = await api.post('/api/v1/queries', payload);
    return response.data?.data; // { query }
  },

  createQuestion: async (payload: { subject?: string; message: string; name: string; email: string; phone?: string }) => {
    const response = await api.post('/api/v1/questions', payload);
    return response.data?.data; // { question }
  },

  createArticle: async (payload: any) => {
    const isForm = typeof FormData !== 'undefined' && payload instanceof FormData;
    const response = await api.post('/api/v1/articles', payload, isForm ? { headers: { 'Content-Type': 'multipart/form-data' } } : undefined);
    return response.data?.data; // { article }
  },

  createJob: async (payload: any) => {
    // If FormData is used (e.g., with logo), send as multipart
    const isForm = typeof FormData !== 'undefined' && payload instanceof FormData;
    const response = await api.post('/api/v1/jobs', payload, isForm ? { headers: { 'Content-Type': 'multipart/form-data' } } : undefined);
    return response.data?.data; // { job }
  },

  createCourse: async (payload: any) => {
    // Use multipart when FormData is passed to include image/syllabus
    const isForm = typeof FormData !== 'undefined' && payload instanceof FormData;
    const response = await api.post('/api/v1/courses', payload, isForm ? { headers: { 'Content-Type': 'multipart/form-data' } } : undefined);
    return response.data?.data; // { course }
  },

  createBooking: async (payload: { name: string; email: string; phone: string; date: string; timeSlot: string; type?: string; message?: string }) => {
    // Backend booking model: name, email, phone, date, timeSlot, type, message
    const response = await api.post('/api/v1/bookings', payload);
    return response.data?.data; // { booking }
  }
};
