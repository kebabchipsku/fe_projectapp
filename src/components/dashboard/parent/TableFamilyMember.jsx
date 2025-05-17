import React from "react";
import { HSStaticMethods } from "preline/preline";
import { useAuth } from "../../../hooks/auth/useAuth";
import useSWR from "swr";
import { token } from "../../../lib/auth/authAPI";
import { jwtDecode } from "jwt-decode";
import Pagination from "../../Pagination";
import { getFamilyMember } from "../../../lib/parent/familiesAPI";

const TABLE_HEAD = [
  "Nama Lengkap",
  "Tanggal Lahir",
  "Jenis Kelamin",
  "Hubungan",
  "Tinggi Badan",
  "Berat Badan",
  "Kesehatan",
  "Aksi",
];

const TableFamilyMember = ({ children }) => {
  const { accessToken, setAccessToken, user, setUser } = useAuth();

  React.useEffect(() => {
    HSStaticMethods.autoInit();
  }, []);

  const [page, setPage] = React.useState(0);
  const [limit, setLimit] = React.useState(10);
  const [pages, setPages] = React.useState(0);
  const [rows, setRows] = React.useState(0);
  const [keyword, setKeyword] = React.useState("");
  const [query, setQuery] = React.useState("");

  let tableContent;

  const Fetchfamilymember = async () => {
    const response = await getFamilyMember(accessToken, keyword, page, limit);
    setPage(response.data.page);
    setPages(response.data.totalPage);
    setRows(response.data.totalRows);
    return response.data;
  };

  const { data, isLoading, mutate } = useSWR(
    ["familyMembers", keyword, page],
    () => Fetchfamilymember()
  );

  const searchData = (e) => {
    e.preventDefault();
    setPage(0);
    setKeyword(query);
    mutate("familyMembers", { revalidate: true });
  };

  React.useEffect(() => {
    mutate();
  }, [keyword, page, mutate]);

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

  if (isLoading) {
    tableContent = [...Array(10)].map((_, index) => (
      <tr key={index}>
        <td className="p-4">
          <div className="h-[30px] w-full bg-gray-100 animate-pulse rounded"></div>
        </td>
        <td className="p-4">
          <div className="h-[30px] w-full bg-gray-100 animate-pulse rounded"></div>
        </td>
      </tr>
    ));
  } else if (data && data?.familyMembers?.length > 0) {
    tableContent = data.familyMembers.map((fm) => {
      let gender = "";
      switch (fm?.gender) {
        case "L":
          gender = "Laki-laki";
          break;
        case "P":
          gender = "Perempuan";
          break;
      }

      const birthday = (dateString) => {
        if (!dateString) return "-";
        const bulan = [
          "Januari",
          "Februari",
          "Maret",
          "April",
          "Mei",
          "Juni",
          "Juli",
          "Agustus",
          "September",
          "Oktober",
          "November",
          "Desember",
        ];
        const date = new Date(dateString);
        const tanggal = date.getDate();
        const bulanNama = bulan[date.getMonth()];
        const tahun = date.getFullYear();
        return `${tanggal} ${bulanNama} ${tahun}`;
      };

      return (
        <tr key={fm.id}>
          <td className="px-6 py-4 capitalize whitespace-nowrap text-sm font-medium text-gray-800">
            {fm?.fullName ?? "-"}
          </td>
          <td className="px-6 py-4 capitalize whitespace-nowrap text-sm font-medium text-gray-800">
            {birthday(fm?.birthDate)}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
            {gender ?? "-"}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 capitalize">
            {fm?.relation ?? "-"}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 capitalize">
            {fm?.nutrition[0]?.height ?? "-"}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 capitalize">
            {fm?.nutrition[0]?.weight ?? "-"}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 capitalize">
            {fm?.nutrition[0]?.nutritionStatus?.information ?? "-"}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
            <button
              type="button"
              className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 focus:outline-hidden focus:text-blue-800 disabled:opacity-50 disabled:pointer-events-none"
            >
              Delete
            </button>
          </td>
        </tr>
      );
    });
  } else {
    tableContent = (
      <tr>
        <td colSpan={TABLE_HEAD.length} className="p-4 text-center">
          <h1 className="text-gray-900 text-sm font-normal">
            Tidak ada users tersedia
          </h1>
        </td>
      </tr>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="-m-1.5 overflow-x-auto">
        <div className="p-1.5 min-w-full inline-block align-middle">
          <div className="border border-gray-200 rounded-lg divide-y divide-gray-200">
            <div className="py-3 px-4">
              <div className="flex items-center justify-between">
                <form
                  onSubmit={searchData}
                  className="relative max-w-xs w-full"
                >
                  <label htmlFor="search" className="sr-only">
                    Search
                  </label>
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    name="search_query"
                    id="search_query"
                    className="py-1.5 sm:py-2 px-3 ps-9 block w-full border border-obito-grey shadow-2xs rounded-lg sm:text-sm focus:z-10 focus:border-blue-800 focus:ring-blue-800 disabled:opacity-50 disabled:pointer-events-none"
                    placeholder="Username atau Email"
                  />
                  <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-3">
                    <svg
                      className="size-4 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="11" cy="11" r="8"></circle>
                      <path d="m21 21-4.3-4.3"></path>
                    </svg>
                  </div>
                  <button
                    type="submit"
                    className="bg-blue-800 text-white px-2.5 py-1.5 text-sm rounded-md absolute top-1/2 -translate-y-1/2 right-1"
                  >
                    Cari
                  </button>
                </form>
                <div
                  id="modal-add-users"
                  className="hs-overlay [--overlay-backdrop:static] hidden size-full fixed top-0 start-0 z-100 overflow-x-hidden overflow-y-auto pointer-events-none bg-gray-900/50"
                  tabIndex="-1"
                  aria-labelledby="modal-add-users-label"
                  data-hs-overlay-keyboard="false"
                >
                  <div className="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all sm:max-w-lg lg:max-w-2xl sm:w-full m-3 sm:mx-auto min-h-[calc(100%-56px)] flex items-center">
                    <div className="flex flex-col bg-white border border-obito-grey shadow-2xs rounded-xl pointer-events-auto lg:w-2xl">
                      <div className="flex justify-between items-center py-3 px-4 border-b border-gray-200">
                        <h3
                          id="modal-add-users"
                          className="font-bold text-gray-800"
                        >
                          Tambah Pengguna
                        </h3>
                        <button
                          type="button"
                          className="size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-hidden focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none"
                          aria-label="Close"
                          data-hs-overlay="#modal-add-users"
                        >
                          <span className="sr-only">Close</span>
                          <svg
                            className="shrink-0 size-4"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M18 6 6 18"></path>
                            <path d="m6 6 12 12"></path>
                          </svg>
                        </button>
                      </div>
                      {children}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {TABLE_HEAD.map((head) => (
                      <th
                        key={head}
                        scope="col"
                        className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                      >
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {tableContent}
                </tbody>
              </table>
            </div>
            <Pagination
              page={page}
              pages={pages}
              rows={rows}
              setPage={setPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableFamilyMember;
