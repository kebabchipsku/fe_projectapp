import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  LuBookOpen,
  LuCircleHelp,
  LuDownload,
  LuExternalLink,
  LuFileText,
  LuPlay,
  LuVideo,
  LuX,
} from "react-icons/lu";
import PanduanPenggunaanPDF from "../../assets/main/panduan-penggunaan-aplikasi.pdf";
import VideoTutorialAplikasi from "../../assets/main/tutorial-penggunaan-aplikasi.mp4";
import { useHelpCenter } from "../../context/HelpCenterContext";

const guideTabs = [
  {
    id: "pdf",
    title: "Panduan PDF",
    shortTitle: "Panduan",
    description: "Baca langkah penggunaan aplikasi secara lengkap.",
    icon: LuFileText,
  },
  {
    id: "video",
    title: "Video Tutorial",
    shortTitle: "Video",
    description: "Lihat alur penggunaan aplikasi dalam bentuk video.",
    icon: LuVideo,
  },
];

export default function HelpCenter() {
  const {
    isHelpOpen,
    activeHelpTab,
    setActiveHelpTab,
    openHelp,
    closeHelp,
  } = useHelpCenter();
  const videoRef = useRef(null);

  useEffect(() => {
    if (!isHelpOpen) {
      videoRef.current?.pause();
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeHelp();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isHelpOpen, closeHelp]);

  const handleClose = () => {
    videoRef.current?.pause();
    closeHelp();
  };

  return (
    <>
      {/* Letakkan tombol bantuan satu tingkat di atas tombol ScrollToTop. */}
      <div className="fixed bottom-24 right-5 sm:right-6 z-40 group">
        <span className="pointer-events-none absolute right-0 top-1/2 mr-15 hidden -translate-y-1/2 whitespace-nowrap rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 sm:block">
          Butuh panduan?
        </span>
        <button
          type="button"
          onClick={() => openHelp("pdf")}
          className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/30 transition hover:-translate-y-1 hover:bg-primary-container focus:outline-none focus:ring-4 focus:ring-primary/30"
          aria-label="Buka pusat panduan aplikasi"
        >
          <LuCircleHelp className="h-7 w-7" />
        </button>
      </div>

      <AnimatePresence>
        {isHelpOpen && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={handleClose}
          >
            <motion.section
              role="dialog"
              aria-modal="true"
              aria-labelledby="help-center-title"
              initial={{ opacity: 0, y: 28, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 28, scale: 0.98 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onMouseDown={(event) => event.stopPropagation()}
              className="flex h-[94vh] w-full max-w-6xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:h-[88vh] sm:rounded-3xl"
            >
              <header className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-5 sm:px-7">
                <div className="flex min-w-0 items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <LuBookOpen className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-primary">Pusat Bantuan</p>
                    <h2
                      id="help-center-title"
                      className="mt-0.5 text-lg font-extrabold text-slate-900 sm:text-xl"
                    >
                      Panduan Penggunaan Aplikasi
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Pilih panduan tertulis atau video tutorial sesuai kebutuhanmu.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleClose}
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-200"
                  aria-label="Tutup pusat panduan"
                >
                  <LuX className="h-5 w-5" />
                </button>
              </header>

              <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[244px_minmax(0,1fr)]">
                <aside className="border-b border-slate-200 bg-slate-50 p-3 lg:border-b-0 lg:border-r lg:p-4">
                  <div className="flex gap-2 overflow-x-auto lg:flex-col">
                    {guideTabs.map((tab) => {
                      const Icon = tab.icon;
                      const isActive = activeHelpTab === tab.id;

                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setActiveHelpTab(tab.id)}
                          className={`min-w-[190px] rounded-2xl p-3.5 text-left transition lg:min-w-0 ${
                            isActive
                              ? "bg-primary text-white shadow-md shadow-primary/20"
                              : "bg-white text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          <span className="flex items-center gap-2.5 text-base font-bold">
                            <Icon className="h-5 w-5" />
                            <span className="lg:hidden">{tab.shortTitle}</span>
                            <span className="hidden lg:inline">{tab.title}</span>
                          </span>
                          <span
                            className={`mt-1.5 hidden text-sm leading-relaxed lg:block ${
                              isActive ? "text-white/85" : "text-slate-500"
                            }`}
                          >
                            {tab.description}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-4 hidden rounded-2xl border border-primary/15 bg-primary/5 p-4 lg:block">
                    <p className="text-sm font-bold text-primary">Tips</p>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">
                      Gunakan video untuk melihat alur cepat, lalu buka PDF saat
                      membutuhkan penjelasan langkah yang lebih rinci.
                    </p>
                  </div>
                </aside>

                <main className="min-h-0 overflow-y-auto bg-white p-4 sm:p-6">
                  {activeHelpTab === "pdf" ? (
                    <section className="flex h-full min-h-[540px] flex-col">
                      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h3 className="text-lg font-extrabold text-slate-800">
                            Panduan Penggunaan Aplikasi
                          </h3>
                          <p className="mt-1 text-sm text-slate-500">
                            Bacalah panduan langsung di aplikasi atau buka dalam tab baru.
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <a
                            href={PanduanPenggunaanPDF}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 rounded-xl border border-primary/25 bg-white px-3.5 py-2.5 text-sm font-bold text-primary transition hover:bg-primary/5"
                          >
                            <LuExternalLink className="h-4 w-4" />
                            Buka Tab Baru
                          </a>
                          <a
                            href={PanduanPenggunaanPDF}
                            download="panduan-penggunaan-aplikasi.pdf"
                            className="inline-flex items-center gap-2 rounded-xl bg-primary px-3.5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary-container"
                          >
                            <LuDownload className="h-4 w-4" />
                            Unduh PDF
                          </a>
                        </div>
                      </div>

                      <div className="min-h-0 flex-1 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-inner">
                        <iframe
                          src={`${PanduanPenggunaanPDF}#view=FitH`}
                          title="Panduan penggunaan aplikasi"
                          className="h-full min-h-[540px] w-full border-0"
                        />
                      </div>
                    </section>
                  ) : (
                    <section className="mx-auto flex h-full w-full max-w-4xl flex-col justify-center">
                      <div className="mb-5 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 text-rose-500">
                          <LuVideo className="h-7 w-7" />
                        </div>
                        <h3 className="mt-3 text-xl font-extrabold text-slate-800">
                          Video Tutorial Penggunaan Aplikasi
                        </h3>
                        <p className="mx-auto mt-1 max-w-2xl text-sm leading-relaxed text-slate-500">
                          Putar video ini untuk melihat alur penggunaan aplikasi secara visual.
                        </p>
                      </div>

                      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 shadow-xl">
                        <video
                          ref={videoRef}
                          controls
                          playsInline
                          preload="metadata"
                          className="aspect-video w-full bg-black"
                        >
                          <source src={VideoTutorialAplikasi} type="video/mp4" />
                          Browser Anda belum mendukung pemutaran video.
                        </video>
                      </div>

                      <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-800">
                        Video tidak diputar otomatis agar tidak mengganggu pengguna. Tekan tombol
                        play pada pemutar video ketika siap menonton.
                      </div>
                    </section>
                  )}
                </main>
              </div>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
