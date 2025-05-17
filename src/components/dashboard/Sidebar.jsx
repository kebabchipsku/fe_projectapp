import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  MdOutlineFamilyRestroom,
  MdCategory,
  MdQuestionAnswer,
} from "react-icons/md";
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { RiUserSettingsFill, RiQuestionnaireFill } from "react-icons/ri";
import { HiMiniBuildingOffice } from "react-icons/hi2";
import { BsBuildingFillGear } from "react-icons/bs";

const SidebarItemAdmin = [
  {
    id: 1,
    name: "Dashboard",
    icon: <TbLayoutDashboardFilled className="w-4 h-4" />,
    path: "/admin/dashboard",
  },
  {
    id: 2,
    name: "Manajemen Pengguna",
    icon: <RiUserSettingsFill className="w-4 h-4" />,
    path: "/admin/management-users",
  },
  {
    id: 3,
    name: "Daftar Instansi",
    icon: <HiMiniBuildingOffice className="w-4 h-4" />,
    path: "/admin/institution",
  },
  {
    id: 4,
    name: "Daftar Kategori",
    icon: <MdCategory className="w-4 h-4" />,
    path: "/admin/category",
  },
  {
    id: 5,
    name: "Daftar Pertanyaan",
    icon: <MdQuestionAnswer className="w-4 h-4" />,
    path: "/admin/question",
  },
];

const SidebarItemSchool = [
  {
    id: 1,
    name: "Dashboard",
    icon: <TbLayoutDashboardFilled className="w-4 h-4" />,
    path: "/school/dashboard",
  },
  {
    id: 2,
    name: "Pertanyaan",
    icon: <RiQuestionnaireFill className="w-4 h-4" />,
    path: "/school/quesioner",
  },
  {
    id: 3,
    name: "Manajemen Guru",
    icon: <RiUserSettingsFill className="w-4 h-4" />,
    path: "/school/management-teachers",
  },
  {
    id: 4,
    name: "Manajemen Kelas",
    icon: <BsBuildingFillGear className="w-4 h-4" />,
    path: "/school/management-classes",
  },
];

const SidebarItemParent = [
  {
    id: 1,
    name: "Dashboard",
    icon: <TbLayoutDashboardFilled className="w-4 h-4" />,
    path: "/parent/dashboard",
  },
  {
    id: 2,
    name: "Manajemen Keluarga",
    icon: <MdOutlineFamilyRestroom className="w-4 h-4" />,
    path: "/parent/management-family",
  },
];

const Sidebar = () => {
  const location = useLocation();

  let sidebarItems;
  switch (true) {
    case location.pathname.startsWith("/admin"):
      sidebarItems = SidebarItemAdmin;
      break;
    case location.pathname.startsWith("/school"):
      sidebarItems = SidebarItemSchool;
      break;
    case location.pathname.startsWith("/parent"):
      sidebarItems = SidebarItemParent;
      break;
    default:
      sidebarItems = [];
      break;
  }

  return (
    <div
      id="hs-application-sidebar"
      className="hs-overlay  [--auto-close:lg]
        hs-overlay-open:translate-x-0
        -translate-x-full transition-all duration-300 transform
        w-65 h-full
        hidden
        fixed inset-y-0 start-0 z-60
        bg-blue-800 border-e border-obito-grey
        lg:block lg:translate-x-0 lg:end-auto lg:bottom-0
      "
      tabIndex="-1"
      aria-label="Sidebar"
    >
      <div className="relative flex flex-col h-full max-h-full">
        <div className="px-6 pt-6 flex items-center">
          {/* Logo */}
          <div className="flex items-center gap-3" aria-label="logo">
            <div className="aspect-square w-6 h-6 bg-white rounded-md flex items-center justify-center">
              <img src="/logo.png" alt="logo" className="w-4 h-4" />
            </div>
            <div className="flex flex-col space-y-3 text-white">
              <h1 className="text-sm font-bold leading-0">Jalinan</h1>
              <p className="text-xs leading-0">Anak Sehat</p>
            </div>
          </div>
          {/* End Logo */}

          <div className="hidden lg:block ms-2"></div>
        </div>

        {/* Content */}
        <div className="h-full overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300">
          <nav
            className="hs-accordion-group px-3 py-6 w-full flex flex-col flex-wrap"
            data-hs-accordion-always-open
          >
            <ul className="flex flex-col space-y-1">
              {sidebarItems.map((item) => (
                <li key={item.id} className="text-white">
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-2 p-3 rounded-xl ${
                        isActive ? "bg-white text-blue-800 font-semibold" : null
                      }`
                    }
                  >
                    {item.icon}
                    <span className="text-sm">{item.name}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        {/* End Content */}
      </div>
    </div>
  );
};

export default Sidebar;
