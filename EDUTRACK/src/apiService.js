import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// User APIs
export const userAPI = {
  registerUser: (userData) => api.post('/user/register-user/', userData),
  loginUser: (loginData) => api.post('/user/login-user/', loginData),
  getAllUsers: () => api.get('/user/get-all-user/'),
  getUserByUsername: (username) => api.get(`/user/get-user-by-username/${username}/`),
  updateUser: (userData) => api.put('/user/update-user/', userData),
  deleteUserByUsername: (username) => api.delete(`/user/delete-user-by-username?username=${username}`),
  getAllFaculty: () => api.get('/user/get-all-faculty/'),
};

// Student APIs
export const studentAPI = {
  addStudent: (studentData) => api.post('/student/add-student/', studentData),
  getAllStudents: () => api.get('/student/get-all-students/'),
  updateStudent: (studentData) => api.put('/student/update-student/', studentData),
  deleteStudent: (id) => api.delete(`/student/delete-student/${id}/`),
};

// Subject APIs
export const subjectAPI = {
  addSubject: (subjectData) => api.post('/subject/add-subject/', subjectData),
  getAllSubjects: () => api.get('/subject/get-all-subjects/'),
  updateSubject: (subjectData) => api.put('/subject/update-subject/', subjectData),
  deleteSubject: (id) => api.delete(`/subject/delete-subject/${id}/`),
};

// Attendance APIs - FIXED THIS SECTION
export const attendanceAPI = {
  takeAttendance: (attendanceData) => api.post('/attendance/take-attendance/', attendanceData),
  getAllAttendanceRecords: () => api.get('/attendance/get-all-attendance-records/'),
  // FIX: Properly handle the parameters
  getAttendance: (facultyUsername, subjectId, date) => 
    api.get(`/attendance/get-attendance/${facultyUsername}/${subjectId}/${date}`),
  // Or alternatively, if you need to handle optional parameters:
  getFilteredAttendance: (facultyUsername, subjectId, date) => {
    let url = '/attendance/get-attendance/';
    if (facultyUsername && subjectId && date) {
      url = `/attendance/get-attendance/${facultyUsername}/${subjectId}/${date}`;
    }
    return api.get(url);
  },
};

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    console.log('Request:', config.method.toUpperCase(), config.url);
    console.log('Request Data:', config.data);
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('Response:', response.status, response.config.url);
    console.log('Response Data:', response.data);
    return response;
  },
  (error) => {
    console.error('Response Error:', error);
    if (error.response) {
      console.error('Error Response Data:', error.response.data);
      console.error('Error Response Status:', error.response.status);
    }
    return Promise.reject(error);
  }
);

export default api;