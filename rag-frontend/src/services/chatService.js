import api from './api';

export const chatService = {
  /**
   * Send a chat message to the RAG backend
   * @param {string} question - User question string
   * @returns {Promise} Response containing AI answer and metadata
   */
  sendMessage: async (question) => {
    const response = await api.post('/chat/', {
      question
    });
    return response.data;
  },

  /**
   * Check health status of the backend API
   */
  checkHealth: async () => {
    const response = await api.get('/health');
    return response.data;
  }
};

