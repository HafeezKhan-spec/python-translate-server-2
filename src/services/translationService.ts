import axios from 'axios';

// Types
export interface Translation {
  id: string;
  userId: string;
  sourceText: string;
  translatedText: string;
  createdAt: Date;
}

// Translation service functions
const translationService = {
  // Translate text
  translate: async (text: string): Promise<string> => {
    try {
      const response = await axios.post('http://localhost:8000/translate', { text });
      return response.data.translatedText;
    } catch (error) {
      console.error('Translation error:', error);
      throw error;
    }
  },

  // Save translation to history
  saveTranslation: async (sourceText: string, translatedText: string): Promise<Translation> => {
    try {
      const response = await axios.post('/history', { sourceText, translatedText });
      return response.data;
    } catch (error) {
      console.error('Save translation error:', error);
      throw error;
    }
  },

  // Get user's translation history
  getHistory: async (): Promise<Translation[]> => {
    try {
      const response = await axios.get('/history');
      return response.data;
    } catch (error) {
      console.error('Get history error:', error);
      throw error;
    }
  },

  // Delete a translation from history
  deleteTranslation: async (id: string): Promise<void> => {
    try {
      await axios.delete(`/history/${id}`);
    } catch (error) {
      console.error('Delete translation error:', error);
      throw error;
    }
  },

  // Clear all translation history
  clearHistory: async (): Promise<void> => {
    try {
      await axios.delete('/history');
    } catch (error) {
      console.error('Clear history error:', error);
      throw error;
    }
  }
};

export default translationService;