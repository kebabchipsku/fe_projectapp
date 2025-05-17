import api from "./api";

export const getClasses = async (keyword, page, limit) => {
  try {
    const response = await api.get(import.meta.env.VITE_API_GET_CLASSES, {
      params: {
        search: keyword,
        page,
        limit,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};

export const createClasses = async (data) => {
  try {
    const response = await api.post(import.meta.env.VITE_API_ADD_CLASSES, data);
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};

export const putClasses = async (id, data) => {
  try {
    const response = await api.put(
      `${import.meta.env.VITE_API_UPDATE_CLASSES}/${id}`,
      data
    );
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};

export const dropClasses = async (id) => {
  try {
    const response = await api.delete(
      `${import.meta.env.VITE_API_DELETE_CLASSES}/${id}`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};
