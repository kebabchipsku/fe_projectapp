import { toast } from "react-toastify";
import { HSOverlay } from "preline/preline";
import {
  createTeacher,
  dropTeacher,
  putTeacher,
} from "../lib/school/teachersAPI";

export const useTeachers = () => {
  const addTeacher = async (data, accessToken) => {
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const handleLoading = delay(1000);

    toast.promise(
      handleLoading.then(() => createTeacher(data, accessToken)),
      {
        pending: "Loading...",
        success: {
          render(response) {
            return response.data.message;
          },
          onClose: () => {
            HSOverlay.close("#modal-add-teachers");
            window.location.reload();
          },
        },
        error: {
          render(response) {
            return response.data.message;
          },
          onClose: () => {
            HSOverlay.close("#modal-add-teachers");
            window.location.reload();
          },
        },
      }
    );
  };

  const updateTeacher = async (id, data) => {
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const handleLoading = delay(1000);

    toast.promise(
      handleLoading.then(() => putTeacher(id, data)),
      {
        pending: "Loading...",
        success: {
          render(response) {
            return response.data.message;
          },
          onClose: () => {
            window.location.reload();
          },
        },
        error: {
          render(response) {
            return response.data.message;
          },
          onClose: () => {
            window.location.reload();
          },
        },
      }
    );
  };

  const deleteTeacher = async (id) => {
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const handleLoading = delay(1000);

    toast.promise(
      handleLoading.then(() => dropTeacher(id)),
      {
        pending: "Loading...",
        success: {
          render(response) {
            return response.data.message;
          },
          onClose: () => {
            window.location.reload();
          },
        },
        error: {
          render(response) {
            return response.data.message;
          },
          onClose: () => {
            window.location.reload();
          },
        },
      }
    );
  };

  return {
    addTeacher,
    updateTeacher,
    deleteTeacher,
  };
};
