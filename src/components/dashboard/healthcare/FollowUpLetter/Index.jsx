import { PDFViewer, Document, Page, Text, View } from "@react-pdf/renderer";
import { styles } from "./Style";

export default function Index({ values }) {
  // if (!values) return null;
  return (
    <PDFViewer width="100%" height={640}>
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <Text>Section #1</Text>
          </View>
          <View style={styles.section}>
            <Text>Section #2</Text>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
}
