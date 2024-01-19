const API_URL = 'https://vue3-course-api.hexschool.io';
const API_PATH = 'coolizz';

const axiosInstance = axios.create({
  baseURL: API_URL,
});

axiosInstance.interceptors.request.use((config) => {
  const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
  config.headers.Authorization = token;
  return config;
});
axiosInstance.interceptors.response.use(
  (response) => {
    if (response.data.success) {
      return response;
    }
    return Promise.reject(response);
  },
  (error) => {
    if (error.response.status === 403) {
      alert(error.response.data.message);
      window.location = 'login.html';
    }
    alert(error?.response?.data?.message ?? 'server error');
  }
);

const apiService = {
  checkAdmin() {
    return axiosInstance.post('/api/user/check');
  },
  getProducts() {
    return axiosInstance.get(`/api/${API_PATH}/admin/products/all`);
  },
  createProduct(data) {
    return axiosInstance.post(`/api/${API_PATH}/admin/product`, { data });
  },
  updateProduct(data) {
    return axiosInstance.put(`/api/${API_PATH}/admin/product/${data.id}`, { data });
  },
  deleteProduct(id) {
    return axiosInstance.delete(`/api/${API_PATH}/admin/product/${id}`);
  },
};
