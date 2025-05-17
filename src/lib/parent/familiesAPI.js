import api from "../api";

export const getFamily = async () => {
  try {
    const response = await api.get(import.meta.env.VITE_API_GET_FAMILIES);
    return response.data;
  } catch (error) {
    return error.response?.data;
  }
};

export const getFamilyMember = async (token, keyword, page, limit) => {
  try {
    const response = await api.get(
      import.meta.env.VITE_API_GET_FAMILIES_MEMBER,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          search: keyword,
          page,
          limit,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};

export const createFamilyMember = async (data, accessToken) => {
  try {
    const response = await api.post(
      import.meta.env.VITE_API_ADD_FAMILIES,
      data,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    return error.response?.data;
  }
};
