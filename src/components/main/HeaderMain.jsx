import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LuBookOpen,
  LuChevronDown,
  LuFileText,
  LuVideo,
} from "react-icons/lu";
import { IoClose, IoMenu } from "react-icons/io5";
import Logo from "../../components/main/Logo";
import { useHelpCenter } from "../../context/HelpCenterContext";

const HeaderMain = () => {
  const navigate = useNavigate();
  const { openHelp } = useHelpCenter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [guideMenuOpen, setGuideMenuOpen] = useState(false);
  const guideMenuRef = useRef(null);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!guideMenuRef.current?.contains(event.target)) {
        setGuideMenuOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setGuideMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const closeMobileMenu = () => {
    setMenuOpen(false);
    setGuideMenuOpen(false);
  };

  const handleOpenGuide = (tab) => {
    openHelp(tab);
    closeMobileMenu();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-outline-variant/30 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

        {/* Navigasi desktop */}
        <nav className="hidden items-center gap-7 text-sm font-medium text-on-surface-variant md:flex">
          <Link to="/landing-page" className="transition-colors hover:text-primary">
            Beranda
          </Link>
          <a href="#permainan" className="transition-colors hover:text-primary">
            Permainan
          </a>
          <a href="#tentang" className="transition-colors hover:text-primary">
            Tentang
          </a>
          <a href="#fitur" className="transition-colors hover:text-primary">
            Fitur
          </a>

          <div ref={guideMenuRef} className="relative">
            <button
              type="button"
              onClick={() => setGuideMenuOpen((current) => !current)}
              className="inline-flex items-center gap-1.5 transition-colors hover:text-primary"
              aria-haspopup="menu"
              aria-expanded={guideMenuOpen}
            >
              Panduan
              <LuChevronDown
                className={`h-4 w-4 transition-transform ${
                  guideMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {guideMenuOpen && (
              <div
                role="menu"
                className="absolute right-0 top-full mt-3 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/10"
              >
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => handleOpenGuide("pdf")}
                  className="flex w-full items-start gap-3 rounded-xl p-3 text-left transition hover:bg-primary/5"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <LuFileText className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-sm font-bold text-slate-800">
                      Panduan Lengkap (PDF)
                    </span>
                    <span className="mt-0.5 block text-xs leading-relaxed text-slate-500">
                      Baca langkah penggunaan aplikasi secara rinci.
                    </span>
                  </span>
                </button>

                <button
                  type="button"
                  role="menuitem"
                  onClick={() => handleOpenGuide("video")}
                  className="mt-1 flex w-full items-start gap-3 rounded-xl p-3 text-left transition hover:bg-rose-50"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-500">
                    <LuVideo className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-sm font-bold text-slate-800">
                      Video Tutorial
                    </span>
                    <span className="mt-0.5 block text-xs leading-relaxed text-slate-500">
                      Lihat alur penggunaan aplikasi secara visual.
                    </span>
                  </span>
                </button>
              </div>
            )}
          </div>

          <a href="#testimoni" className="transition-colors hover:text-primary">
            Testimoni
          </a>
        </nav>

        {/* Tombol desktop */}
        <div className="hidden items-center gap-3 md:flex">
          <button
            type="button"
            onClick={() => navigate("/auth/login")}
            className="rounded-lg border border-primary px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary-light"
          >
            Masuk
          </button>
          <button
            type="button"
            onClick={() => navigate("/auth/register")}
            className="cursor-pointer rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-container active:scale-95"
          >
            Daftar Gratis
          </button>
        </div>

        {/* Tombol menu mobile */}
        <button
          type="button"
          className="flex size-10 items-center justify-center rounded-lg text-gray-700 transition-colors hover:bg-gray-100 md:hidden"
          onClick={() => setMenuOpen((current) => !current)}
          aria-label="Buka atau tutup menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <IoClose className="text-2xl" /> : <IoMenu className="text-2xl" />}
        </button>
      </div>

      {/* Navigasi mobile */}
      {menuOpen && (
        <div className="border-t border-gray-200 bg-white md:hidden">
          <nav className="flex flex-col gap-1 px-4 pb-4 pt-5 sm:px-6">
            <Link
              to="/landing-page"
              onClick={closeMobileMenu}
              className="rounded-lg px-4 py-3 text-base font-medium text-gray-700 transition-colors hover:bg-primary-light hover:text-primary"
            >
              Beranda
            </Link>
            <a
              href="#permainan"
              onClick={closeMobileMenu}
              className="rounded-lg px-4 py-3 text-base font-medium text-gray-700 transition-colors hover:bg-primary-light hover:text-primary"
            >
              Permainan
            </a>
            <a
              href="#tentang"
              onClick={closeMobileMenu}
              className="rounded-lg px-4 py-3 text-base font-medium text-gray-700 transition-colors hover:bg-primary-light hover:text-primary"
            >
              Tentang
            </a>
            <a
              href="#fitur"
              onClick={closeMobileMenu}
              className="rounded-lg px-4 py-3 text-base font-medium text-gray-700 transition-colors hover:bg-primary-light hover:text-primary"
            >
              Fitur
            </a>

            <div className="my-2 border-t border-slate-100" />
            <p className="px-4 pt-1 text-xs font-extrabold uppercase tracking-wide text-slate-400">
              Panduan Penggunaan
            </p>
            <button
              type="button"
              onClick={() => handleOpenGuide("pdf")}
              className="mt-1 flex items-center gap-3 rounded-lg px-4 py-3 text-left text-base font-medium text-gray-700 transition-colors hover:bg-primary-light hover:text-primary"
            >
              <LuFileText className="h-5 w-5" />
              Panduan Lengkap (PDF)
            </button>
            <button
              type="button"
              onClick={() => handleOpenGuide("video")}
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-left text-base font-medium text-gray-700 transition-colors hover:bg-primary-light hover:text-primary"
            >
              <LuVideo className="h-5 w-5" />
              Video Tutorial
            </button>

            <a
              href="#testimoni"
              onClick={closeMobileMenu}
              className="rounded-lg px-4 py-3 text-base font-medium text-gray-700 transition-colors hover:bg-primary-light hover:text-primary"
            >
              Testimoni
            </a>
          </nav>

          <div className="border-t border-gray-100" />

          <div className="flex flex-col gap-3 px-4 py-6 sm:px-6">
            <button
              type="button"
              onClick={() => {
                closeMobileMenu();
                navigate("/auth/login");
              }}
              className="w-full rounded-xl border border-primary px-4 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary-light"
            >
              Masuk
            </button>
            <button
              type="button"
              onClick={() => {
                closeMobileMenu();
                navigate("/auth/register");
              }}
              className="w-full cursor-pointer rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-container active:scale-95"
            >
              Daftar Gratis
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default HeaderMain;
