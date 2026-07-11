import { StyleSheet } from "@react-pdf/renderer";

export const styles = StyleSheet.create({
  page: {
    paddingTop: 30,
    paddingBottom: 24,
    paddingHorizontal: 50,
    fontFamily: "Times-Roman",
    fontSize: 12,
    color: "#000000",
    lineHeight: 1.35,
  },

  letterhead: {
    textAlign: "center",
    marginBottom: 4,
  },

  governmentText: {
    fontFamily: "Times-Bold",
    fontSize: 13,
    textTransform: "uppercase",
    marginBottom: 2,
  },

  healthOfficeText: {
    fontFamily: "Times-Bold",
    fontSize: 15,
    textTransform: "uppercase",
    marginBottom: 2,
  },

  uptText: {
    fontFamily: "Times-Bold",
    fontSize: 12,
    textTransform: "uppercase",
    marginBottom: 2,
  },

  addressText: {
    fontFamily: "Times-Roman",
    fontSize: 10,
    marginBottom: 1,
  },

  contactText: {
    fontFamily: "Times-Roman",
    fontSize: 10,
  },

  doubleLine: {
    marginTop: 2,
    marginBottom: 16,
  },

  lineThick: {
    borderBottomWidth: 2,
    borderBottomColor: "#000000",
    borderBottomStyle: "solid",
    marginBottom: 2,
  },

  lineThin: {
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    borderBottomStyle: "solid",
  },

  titleSection: {
    alignItems: "center",
    marginBottom: 18,
  },

  letterTitle: {
    fontFamily: "Times-Bold",
    fontSize: 13,
    textDecoration: "underline",
    marginBottom: 3,
  },

  letterNumber: {
    fontFamily: "Times-Roman",
    fontSize: 12,
  },

  bodySection: {
    marginBottom: 14,
  },

  bodyText: {
    fontFamily: "Times-Roman",
    fontSize: 12,
    textAlign: "justify",
    lineHeight: 1.35,
    marginBottom: 3,
  },

  studentInfoSection: {
    marginLeft: 0,
    marginBottom: 14,
  },

  infoRow: {
    flexDirection: "row",
    marginBottom: 4,
  },

  infoLabel: {
    fontFamily: "Times-Roman",
    fontSize: 12,
    width: 150,
  },

  infoColon: {
    fontFamily: "Times-Roman",
    fontSize: 12,
    width: 16,
  },

  infoValue: {
    fontFamily: "Times-Roman",
    fontSize: 12,
    flex: 1,
  },

  recommendationSection: {
    marginBottom: 14,
  },

  recommendationContentWrapper: {
    marginTop: 6,
  },

  defaultRecommendationList: {
    marginTop: 6,
  },

  recommendationItem: {
    flexDirection: "row",
    marginBottom: 4,
  },

  recommendationNumber: {
    fontFamily: "Times-Roman",
    fontSize: 12,
    width: 20,
  },

  recommendationText: {
    fontFamily: "Times-Roman",
    fontSize: 12,
    flex: 1,
    lineHeight: 1.35,
  },

  recommendationContent: {
    flex: 1,
  },

  closingSection: {
    marginTop: 8,
    marginBottom: 16,
  },

  signatureSection: {
    width: 190,
    alignSelf: "flex-end",
    alignItems: "center",
    marginTop: 6,
  },

  signatureDate: {
    fontFamily: "Times-Roman",
    fontSize: 12,
    marginBottom: 1,
    textAlign: "center",
  },

  signaturePosition: {
    fontFamily: "Times-Roman",
    fontSize: 12,
    textAlign: "center",
    lineHeight: 1.2,
  },

  signatureImageWrapper: {
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
    marginBottom: 2,
  },

  signatureImage: {
    width: 110,
    height: 48,
    objectFit: "contain",
  },

  emptySignatureText: {
    height: 48,
  },

  signatureName: {
    fontFamily: "Times-Bold",
    fontSize: 12,
    textDecoration: "underline",
    textAlign: "center",
    marginBottom: 2,
  },

  nipText: {
    fontFamily: "Times-Roman",
    fontSize: 11,
    textAlign: "center",
  },
});
