import {
  BlobProvider,
  Document,
  Image,
  Page,
  Text,
  View,
} from "@react-pdf/renderer";
import { styles } from "./Style";
import { useAuth } from "../../../../hooks/auth/useAuth";
import { getUserById } from "../../../../lib/admin/users/usersAPI";
import useSWR from "swr";
import { token } from "../../../../lib/auth/authAPI";
import { jwtDecode } from "jwt-decode";

export function renderTiptapToPdf(jsonContent) {
  if (!jsonContent || !jsonContent.content) return null;

  return jsonContent.content.map((node, index) => renderNode(node, index));
}

function renderNode(node, index, ordered = false, number = 1) {
  switch (node.type) {
    case "paragraph":
      return (
        <Text key={index} style={styles.bodyText}>
          {node.content?.map((cont, idx) => renderTextNode(cont, idx))}
        </Text>
      );

    case "heading": {
      const headingLevel = node.attrs?.level || 1;
      const headingSizes = {
        1: 14,
        2: 13,
        3: 12,
        4: 11,
        5: 10,
        6: 9,
      };

      return (
        <Text
          key={index}
          style={{
            ...styles.bodyText,
            fontFamily: "Times-Bold",
            fontSize: headingSizes[headingLevel],
            marginBottom: 6,
          }}
        >
          {node.content?.map((cont) => cont.text).join(" ")}
        </Text>
      );
    }

    case "bulletList":
      return (
        <View key={index} style={{ marginTop: 4, marginBottom: 8 }}>
          {node.content?.map((item, i) => renderNode(item, i, false))}
        </View>
      );

    case "orderedList":
      return (
        <View key={index} style={{ marginTop: 4, marginBottom: 8 }}>
          {node.content?.map((item, i) => renderNode(item, i, true, i + 1))}
        </View>
      );

    case "listItem":
      return (
        <View key={index} style={styles.recommendationItem}>
          <Text style={styles.recommendationNumber}>
            {ordered ? `${number}.` : "•"}
          </Text>

          <View style={styles.recommendationContent}>
            {node.content?.map((child, idx) => renderNode(child, idx))}
          </View>
        </View>
      );

    default:
      return null;
  }
}

function renderTextNode(node, index) {
  if (node.type !== "text") return null;

  const isBold = node.marks?.some((m) => m.type === "bold");
  const isItalic = node.marks?.some((m) => m.type === "italic");
  const isUnderline = node.marks?.some((m) => m.type === "underline");

  return (
    <Text
      key={index}
      style={{
        fontFamily: isBold ? "Times-Bold" : "Times-Roman",
        fontStyle: isItalic ? "italic" : "normal",
        textDecoration: isUnderline ? "underline" : "none",
      }}
    >
      {node.text}
    </Text>
  );
}

function toTitleCase(value) {
  if (!value || typeof value !== "string") return "-";

  return value
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatDate(dateString) {
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
  if (Number.isNaN(date.getTime())) return "-";

  const tgl = String(date.getDate()).padStart(2, "0");
  const bln = bulan[date.getMonth()];
  const thn = date.getFullYear();

  return `${tgl} ${bln} ${thn}`;
}

function formatCurrentDate() {
  return formatDate(new Date().toISOString());
}

function formatGender(gender) {
  if (gender === "L") return "Laki-laki";
  if (gender === "P") return "Perempuan";
  return "-";
}

function getInstitutionFromSource(institution, currentUser) {
  return institution?.institution
    ?? institution?.staff?.institution
    ?? currentUser?.institution
    ?? null;
}

function getStaffFromSource(institution, currentUser) {
  return institution?.staff ?? currentUser?.staff ?? null;
}

function getCityName(institutionData) {
  return (
    institutionData?.city?.name ||
    institutionData?.City?.name ||
    institutionData?.regency?.name ||
    institutionData?.Regency?.name ||
    institutionData?.district?.city?.name ||
    institutionData?.addressCity ||
    "-"
  );
}

function getGovernmentName(cityName) {
  if (!cityName || cityName === "-") {
    return "PEMERINTAH KOTA/KABUPATEN";
  }

  const cleanCity = String(cityName).trim();
  const lowerCity = cleanCity.toLowerCase();

  if (lowerCity.startsWith("kota ") || lowerCity.startsWith("kabupaten ")) {
    return `PEMERINTAH ${cleanCity.toUpperCase()}`;
  }

  if (lowerCity.includes("jakarta")) {
    return `PEMERINTAH KOTA ADMINISTRASI ${cleanCity.toUpperCase()}`;
  }

  return `PEMERINTAH KOTA/KABUPATEN ${cleanCity.toUpperCase()}`;
}

function getUptName(institutionName) {
  if (!institutionName || institutionName === "-") {
    return "UPT PUSKESMAS";
  }

  const cleanName = String(institutionName).trim();

  if (cleanName.toLowerCase().startsWith("upt")) {
    return cleanName;
  }

  if (cleanName.toLowerCase().includes("puskesmas")) {
    return `UPT ${cleanName}`;
  }

  return `UPT PUSKESMAS ${cleanName}`;
}

function getPuskesmasAreaName(institutionName, fallbackCityName) {
  if (!institutionName) return fallbackCityName || "-";

  return (
    String(institutionName)
      .replace(/upt/gi, "")
      .replace(/puskesmas/gi, "")
      .trim() ||
    fallbackCityName ||
    "-"
  );
}

function getUptCode(institutionName) {
  const areaName = getPuskesmasAreaName(institutionName, "");
  const words = areaName
    .replace(/[^a-zA-Z\s]/g, "")
    .split(" ")
    .filter(Boolean);

  if (words.length === 0) return "PKM";

  return words
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 4);
}

function getRomanMonth(date = new Date()) {
  const romans = [
    "I",
    "II",
    "III",
    "IV",
    "V",
    "VI",
    "VII",
    "VIII",
    "IX",
    "X",
    "XI",
    "XII",
  ];

  return romans[date.getMonth()];
}

function generateLetterNumber(values, institutionName) {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const monthRoman = getRomanMonth(currentDate);
  const uptCode = getUptCode(institutionName);

  const rawNumber = values?.letterNumber || values?.recommendationNumber || 1;

  const sequence = String(rawNumber).padStart(3, "0");

  return `440/${sequence}/UPT-${uptCode}/${monthRoman}/${year}`;
}

function getParentName(values) {
  return (
    values?.student?.familyMember?.family?.user?.family?.familyMember?.[0]
      ?.fullName ||
    values?.student?.familyMember?.family?.familyMember?.[0]?.fullName ||
    values?.student?.parent?.familyMember?.fullName ||
    values?.student?.parent?.fullName ||
    "-"
  );
}

function getSchoolName(values) {
  return (
    values?.submittedBy?.institution?.name ||
    values?.student?.institution?.name ||
    values?.student?.school?.name ||
    "-"
  );
}

function renderDefaultRecommendations() {
  const items = [
    "Memberikan makanan bergizi seimbang sesuai kebutuhan anak.",
    "Meningkatkan konsumsi buah dan sayur setiap hari.",
    "Membatasi makanan/minuman tinggi gula, garam, dan lemak.",
    "Melakukan pemantauan pertumbuhan secara berkala di fasilitas kesehatan.",
  ];

  return (
    <View style={styles.defaultRecommendationList}>
      {items.map((item, index) => (
        <View key={item} style={styles.recommendationItem}>
          <Text style={styles.recommendationNumber}>{index + 1}.</Text>
          <Text style={styles.recommendationText}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

export default function Index({
  values,
  content,
  signature,
  institution = null,
}) {
  const { user, accessToken, setAccessToken, setUser } = useAuth();

  const getActiveToken = async () => {
    const currentTime = new Date().getTime();

    if (user?.exp * 1000 < currentTime) {
      const response = await token();
      setAccessToken(response.data.accessToken);
      const decoded = jwtDecode(response.data.accessToken);
      setUser(decoded);
      return response.data.accessToken;
    }

    return accessToken;
  };

  const fetchUserById = async (id) => {
    const activeToken = await getActiveToken();
    const response = await getUserById(id, activeToken);
    return response.data;
  };

  const { data: currentUser } = useSWR(
    user?.id ? `user-${user.id}` : null,
    () => fetchUserById(user.id),
  );

  if (!values && !institution) return null;

  const institutionData = getInstitutionFromSource(institution, currentUser);
  const staffData = getStaffFromSource(institution, currentUser);

  const institutionName = institutionData?.name ?? "-";
  const cityName = getCityName(institutionData);
  const governmentName = getGovernmentName(cityName);
  const uptName = getUptName(institutionName);
  const puskesmasAreaName = getPuskesmasAreaName(institutionName, cityName);

  const letterNumber = generateLetterNumber(values, institutionName);

  const studentName = values?.student?.familyMember?.fullName || "-";
  const nisn = values?.student?.nisn || values?.student?.nis || "-";
  const birthDate = formatDate(values?.student?.familyMember?.birthDate);
  const gender = formatGender(values?.student?.familyMember?.gender);
  const address =
    values?.student?.familyMember?.SocioEconomic?.address ||
    values?.student?.familyMember?.address ||
    "-";
  const parentName = getParentName(values);
  const schoolName = getSchoolName(values);

  const staffName =
    staffData?.fullName ||
    institution?.username ||
    currentUser?.username ||
    "-";

  const renderedContent = renderTiptapToPdf(content);

  const pdfDocument = (
    <Document title="Surat Rekomendasi">
      <Page size="A4" style={styles.page}>
        {/* KOP SURAT */}
        <View style={styles.letterhead}>
          <Text style={styles.governmentText}>{governmentName}</Text>
          <Text style={styles.healthOfficeText}>DINAS KESEHATAN</Text>
          <Text style={styles.uptText}>{uptName.toUpperCase()}</Text>

          <Text style={styles.addressText}>
            {institutionData?.address || "-"}
          </Text>

          <Text style={styles.contactText}>
            Telp. {institutionData?.phone || "-"} | Email:{" "}
            {institutionData?.email || "-"}
          </Text>
        </View>

        <View style={styles.doubleLine}>
          <View style={styles.lineThick} />
          <View style={styles.lineThin} />
        </View>

        {/* JUDUL SURAT */}
        <View style={styles.titleSection}>
          <Text style={styles.letterTitle}>SURAT REKOMENDASI</Text>
          <Text style={styles.letterNumber}>Nomor: {letterNumber}</Text>
        </View>

        {/* PEMBUKA */}
        <View style={styles.bodySection}>
          <Text style={styles.bodyText}>
            Berdasarkan hasil pemantauan status gizi melalui Sistem Informasi
            Gizi Sekolah yang dilakukan oleh {uptName} terhadap peserta didik{" "}
            {schoolName}, dengan ini disampaikan hasil sebagai berikut:
          </Text>
        </View>

        {/* DATA SISWA */}
        <View style={styles.studentInfoSection}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Nama Siswa</Text>
            <Text style={styles.infoColon}>:</Text>
            <Text style={styles.infoValue}>{studentName}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>NISN</Text>
            <Text style={styles.infoColon}>:</Text>
            <Text style={styles.infoValue}>{nisn}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Tanggal Lahir</Text>
            <Text style={styles.infoColon}>:</Text>
            <Text style={styles.infoValue}>{birthDate}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Jenis Kelamin</Text>
            <Text style={styles.infoColon}>:</Text>
            <Text style={styles.infoValue}>{gender}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Alamat</Text>
            <Text style={styles.infoColon}>:</Text>
            <Text style={styles.infoValue}>{address}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Nama Orang Tua/Wali</Text>
            <Text style={styles.infoColon}>:</Text>
            <Text style={styles.infoValue}>{parentName}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Sekolah</Text>
            <Text style={styles.infoColon}>:</Text>
            <Text style={styles.infoValue}>{schoolName}</Text>
          </View>
        </View>

        {/* ISI REKOMENDASI */}
        <View style={styles.recommendationSection}>
          <Text style={styles.bodyText}>
            Hasil pemeriksaan menunjukkan bahwa siswa memerlukan perhatian
            terhadap pola makan dan status gizinya. Oleh karena itu, orang
            tua/wali disarankan untuk:
          </Text>

          <View style={styles.recommendationContentWrapper}>
            {renderedContent && renderedContent.length > 0
              ? renderedContent
              : renderDefaultRecommendations()}
          </View>
        </View>

        {/* PENUTUP */}
        <View style={styles.closingSection}>
          <Text style={styles.bodyText}>
            Demikian surat rekomendasi ini dibuat untuk dipergunakan sebagaimana
            mestinya.
          </Text>
          <Text style={styles.bodyText}>
            Atas perhatian dan kerja samanya kami ucapkan terima kasih.
          </Text>
        </View>

        {/* TANDA TANGAN */}
        <View style={styles.signatureSection}>
          <Text style={styles.signatureDate}>
            {toTitleCase(puskesmasAreaName)}, {formatCurrentDate()}
          </Text>

          {staffData ? (
            <Text style={styles.signaturePosition}>
              UPT PUSKESMAS {toTitleCase(puskesmasAreaName)}
            </Text>
          ) : (
            <>
              <Text style={styles.signaturePosition}>Kepala UPT Puskesmas</Text>
              <Text style={styles.signaturePosition}>
                {toTitleCase(puskesmasAreaName)}
              </Text>
            </>
          )}

          <View style={styles.signatureImageWrapper}>
              <Image src={signature} style={styles.signatureImage} />
          </View>

          <Text style={styles.signatureName}>{staffName}</Text>
        </View>
      </Page>
    </Document>
  );

  return (
    <BlobProvider document={pdfDocument}>
      {({ url, loading }) => {
        if (loading) {
          return (
            <div className="flex items-center justify-center h-[640px] bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-400">Memuat PDF...</p>
            </div>
          );
        }

        return (
          <object
            data={url}
            type="application/pdf"
            width="100%"
            height={640}
            className="rounded-lg"
          >
            <p className="text-sm text-gray-500">
              Browser tidak mendukung tampilan PDF.
            </p>
            <a
              href={url}
              download="surat-rekomendasi.pdf"
              className="text-blue-600 hover:underline"
            >
              Download PDF
            </a>
          </object>
        );
      }}
    </BlobProvider>
  );
}
