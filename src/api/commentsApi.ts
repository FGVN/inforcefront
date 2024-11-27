import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL;

if (!apiUrl) {
  throw new Error('API URL is not defined');
}

// Utility function for handling API requests and responses
const handleApiRequest = async (requestFn: () => Promise<any>, errorMessage: string): Promise<any> => {
  try {
    const response = await requestFn();
    return response.data;
  } catch (error) {
    console.error(errorMessage, error);
    throw new Error(errorMessage);
  }
};

export const createCommentApi = async (productId: number, description: string): Promise<any> => {
  return handleApiRequest(
    () => axios.post(`${apiUrl}/Comments`, null, {
      params: {
        productId,
        description,
      },
    }),
    'Failed to add new comment'
  );
};

export const deleteCommentApi = async (commentId: number): Promise<number> => {
  return handleApiRequest(
    () => axios.delete(`${apiUrl}/Comments/${commentId}`, {
      headers: { accept: '*/*' },
    }),
    'Failed to delete comment'
  );
};
