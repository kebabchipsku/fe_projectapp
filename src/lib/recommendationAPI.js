import api from "./api";

export const getRecommendations = async () => {
  try {
    const response = await api.get(
      `${import.meta.env.VITE_API_GET_RECOMMENDATIONS}`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};

export const createRecommendation = async (data, token) => {
  try {
    const response = await api.post(
      `${import.meta.env.VITE_API_CREATE_RECOMMENDATION}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};

export const changeStatusToProcessed = async (id) => {
  try {
    const response = await api.patch(
      `${import.meta.env.VITE_API_CHANGE_TO_PROCESSED}/${id}`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};
