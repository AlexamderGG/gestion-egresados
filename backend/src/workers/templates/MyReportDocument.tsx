import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 30 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  section: { marginBottom: 10 },
  heading: { fontSize: 18, marginTop: 10, marginBottom: 5 },
  text: { fontSize: 12, marginBottom: 5 },
});

export const MyReportDocument = ({ data, filtros }: { data: any; filtros: any }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Reporte de Empleabilidad</Text>
      <View style={styles.section}>
        <Text style={styles.heading}>Filtros aplicados:</Text>
        <Text style={styles.text}>Desde: {filtros.desde || 'N/A'} - Hasta: {filtros.hasta || 'N/A'}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.heading}>Datos:</Text>
        {data.map((item: any, i: number) => (
          <Text key={i} style={styles.text}>{item.carrera}: {item.tasa_empleabilidad}%</Text>
        ))}
      </View>
    </Page>
  </Document>
);