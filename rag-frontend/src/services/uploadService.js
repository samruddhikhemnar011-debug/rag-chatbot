import api from './api';

export const uploadService = {
  /**
   * Upload a PDF file to the backend
   * @param {File} file 
   * @param {Function} onUploadProgress - Callback for tracking progress
   * @returns {Promise} Response from the server
   */
  uploadPDF: async (file, onUploadProgress) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/upload-pdf', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    });
    return response.data;
  },
};
