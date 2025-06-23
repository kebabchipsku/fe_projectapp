import React from "react";
import { useAuth } from "../../hooks/auth/useAuth";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { getFamilyMember } from "../../lib/parent/familiesAPI";
import { jwtDecode } from "jwt-decode";
import useSWR from "swr";
import { token } from "../../lib/auth/authAPI";

const FamilyMemberGuard = () => {
  const { accessToken, setAccessToken, user, setUser } = useAuth();
  const [page, setPage] = React.useState(0);
  const [limit, setLimit] = React.useState(10);
  const [keyword, setKeyword] = React.useState("");
  const [showModal, setShowModal] = React.useState(false);
  const [modalType, setModalType] = React.useState("");
  const navigate = useNavigate();

  const Fetchfamilymember = async () => {
    const response = await getFamilyMember(accessToken, keyword, page, limit);
    setPage(response.data.page);
    return response.data;
  };

  const { data } = useSWR(["familyMembers", keyword, page], () =>
    Fetchfamilymember()
  );

  const updateToken = async () => {
    const currentTime = new Date().getTime();
    if (user?.exp * 1000 < currentTime) {
      const response = await token();
      setAccessToken(response.data.accessToken);
      const decoded = jwtDecode(response.data.accessToken);
      setUser(decoded);
    }
  };

  React.useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = new Date().getTime();
      if (user?.exp * 1000 < currentTime) {
        updateToken();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [user]);

  React.useEffect(() => {
    if (data) {
      const members = data.familyMembers || [];
      const hasAyah = members.some((member) => member.relation === "AYAH");
      const hasIbu = members.some((member) => member.relation === "IBU");
      const hasAnak = members.some((member) => member.relation === "ANAK");
      if (!data.familyMembers || data.familyMembers.length === 0) {
        setModalType("empty");
        setShowModal(true);
      } else if (!hasAyah || !hasIbu || !hasAnak) {
        setModalType("incomplete");
        setShowModal(true);
      } else {
        setShowModal(false);
      }
    }
  }, [data]);

  const handleLanjut = () => {
    navigate("/parent/management-family");
  };

  return (
    <div>
      <Outlet />
      {showModal && location.pathname !== "/parent/management-family" && (
        <div
          id="family-modal"
          className="hs-overlay size-full fixed top-0 start-0 z-80 flex items-center justify-center bg-black/40"
          aria-labelledby="family-modal-label"
        >
          <div className="bg-white border border-gray-200 shadow-2xs rounded-xl p-6 max-w-md w-full">
            <h3
              id="family-modal-label"
              className="font-bold text-gray-800 text-lg mb-4"
            >
              {modalType === "empty"
                ? "Silakan isi data keluarga terlebih dahulu"
                : "Silakan lengkapi data keluarga terlebih dahulu"}
            </h3>
            <p className="text-gray-700 mb-6">
              {modalType === "empty"
                ? "Anda belum memiliki data keluarga. Mohon isi data keluarga agar dapat melanjutkan."
                : "Data keluarga Anda belum lengkap. Mohon lengkapi data keluarga agar dapat melanjutkan."}
            </p>
            <div className="flex justify-end">
              <button
                type="button"
                className="py-2 px-4 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                onClick={handleLanjut}
              >
                Lanjut
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FamilyMemberGuard;
