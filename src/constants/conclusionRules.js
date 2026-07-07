// ---- saran texts ----

export const SARAN_ORTU_GIZI_BAIK = [
  "Tetap pertahankan status gizi anak anda",
  "Jangan berhenti berikan makanan dan minuman terbaik untuk anak",
  "Dukung aktivitas fisik anak yang bermanfaat untuk tubuh",
  "Pastikan kebutuhan tidur anak terpenuhi",
];

export const SARAN_ORTU_BURUK_OVERWEIGHT = [
  "Segera periksakan anak anda ke Ahli Gizi/fasilitas layanan kesehatan terdekat",
  "Berikan contoh perilaku makan dan minum yang baik di rumah",
  "Dukung aktivitas fisik anak yang bermanfaat untuk tubuh",
  "Pastikan kebutuhan tidur anak terpenuhi",
];

export const SARAN_SEKOLAH_GIZI_BAIK = [
  "Budayakan perilaku hidup sehat dalam lingkungan sekolah",
];

export const SARAN_SEKOLAH_BURUK_OVERWEIGHT = [
  "Rekomendasi tindaklanjut Puskesmas",
  "Budayakan perilaku hidup sehat dalam lingkungan sekolah",
];

// ---- helpers ----
const getQuestionnaireGood = (data, titleKeyword) =>
  data.questionnaireResults?.find((r) => r.title.includes(titleKeyword))
    ?.interpretation === "Baik";

const buildIndicators = (data) => [
  {
    label: "Status Gizi",
    value: data.latestNutritionStatus || "Tidak Terdata",
    good: data.latestNutritionStatus === "GIZI BAIK",
  },
  {
    label: "Kebiasaan Sehari-hari",
    value: getInterpretation(data, "Kebiasaan"),
    good: getQuestionnaireGood(data, "Kebiasaan"),
  },
  {
    label: "Pengetahuan Gizi",
    value: getInterpretation(data, "Pengetahuan"),
    good: getQuestionnaireGood(data, "Pengetahuan"),
  },
  {
    label: "Sosial Ekonomi",
    value: data.socioEconomic?.interpretation || "Belum diisi",
    good: data.socioEconomic?.interpretation === "Menengah-Tinggi",
  },
  {
    label: "Pendidikan Orang Tua",
    value:
      data.parentEducation?.ibu?.category === "Menengah-Tinggi" ||
      data.parentEducation?.ayah?.category === "Menengah-Tinggi"
        ? "Menengah-Tinggi"
        : "Dasar",
    good:
      data.parentEducation?.ibu?.category === "Menengah-Tinggi" ||
      data.parentEducation?.ayah?.category === "Menengah-Tinggi",
  },
  {
    label: "Pelayanan Kesehatan Sekolah",
    value: data.schoolHealthService?.interpretation || "Belum diisi",
    good: data.schoolHealthService?.interpretation === "Tinggi",
  },
];

const getInterpretation = (data, titleKeyword) =>
  data.questionnaireResults?.find((r) => r.title.includes(titleKeyword))
    ?.interpretation || "Belum diisi";

const makeConclusion = ({ kategori, icon, color, saranOrtu, goodCount }) => ({
  kategori,
  icon,
  color,
  saran: saranOrtu,
  goodCount,
  total: 6,
});

export const getParentConclusion = (data) => {
  if (!data) return null;

  const indicators = buildIndicators(data);
  const goodCount = indicators.filter((i) => i.good).length;

  const nutritionStatus = data.latestNutritionStatus;

  if (nutritionStatus === "OVERWEIGHT-OBESITAS") {
    return makeConclusion({
      id: 3,
      kategori: "Gizi Lebih",
      icon: "🚨",
      color: "from-rose-500 to-red-600",
      saranOrtu: SARAN_ORTU_BURUK_OVERWEIGHT,
      saranSekolah: SARAN_SEKOLAH_BURUK_OVERWEIGHT,
      goodCount,
    });
  }

  if (nutritionStatus === "GIZI BURUK-KURANG") {
    return makeConclusion({
      id: 1,
      kategori: "Tidak Berisiko Gizi Lebih",
      icon: "🏆",
      color: "from-emerald-500 to-teal-600",
      saranOrtu: SARAN_ORTU_BURUK_OVERWEIGHT,
      saranSekolah: SARAN_SEKOLAH_BURUK_OVERWEIGHT,
      goodCount,
    });
  }

  if (nutritionStatus === "GIZI BAIK") {
    const nonStatusGood = indicators
      .filter((i) => i.label !== "Status Gizi")
      .every((i) => i.good);

    if (nonStatusGood) {
      return makeConclusion({
        id: 1,
        kategori: "Tidak Berisiko Gizi Lebih",
        icon: "🏆",
        color: "from-emerald-500 to-teal-600",
        saranOrtu: SARAN_ORTU_GIZI_BAIK,
        saranSekolah: SARAN_SEKOLAH_GIZI_BAIK,
        goodCount,
      });
    }

    const triggerGood = {
      kebiasaan: getQuestionnaireGood(data, "Kebiasaan"),
      pengetahuan: getQuestionnaireGood(data, "Pengetahuan"),
      sosialEkonomi: data.socioEconomic?.interpretation === "Menengah-Tinggi",
    };

    const anyTriggerBad = !Object.values(triggerGood).every(Boolean);

    if (anyTriggerBad) {
      return makeConclusion({
        id: 2,
        kategori: "Berisiko Gizi Lebih",
        icon: "⚠️",
        color: "from-amber-500 to-orange-600",
        saranOrtu: SARAN_ORTU_GIZI_BAIK,
        saranSekolah: SARAN_SEKOLAH_GIZI_BAIK,
        goodCount,
      });
    }

    return makeConclusion({
      id: 1,
      kategori: "Tidak Berisiko Gizi Lebih",
      icon: "🏆",
      color: "from-emerald-500 to-teal-600",
      saranOrtu: SARAN_ORTU_GIZI_BAIK,
      saranSekolah: SARAN_SEKOLAH_GIZI_BAIK,
      goodCount,
    });
  }

  return null;
};
