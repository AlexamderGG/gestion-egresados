import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#ffffff',
  },
  header: {
    marginBottom: 30,
    borderBottom: 3,
    borderBottomColor: '#2563eb',
    paddingBottom: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e3a8a',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 5,
  },
  date: {
    fontSize: 10,
    color: '#9ca3af',
    textAlign: 'center',
  },
  section: {
    marginTop: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: '#f3f4f6',
    padding: 8,
    marginBottom: 15,
    color: '#374151',
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#374151',
    marginTop: 10,
    marginBottom: 5,
  },
  value: {
    fontSize: 11,
    color: '#4b5563',
    marginBottom: 5,
  },
  kpiContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 15,
  },
  kpiCard: {
    backgroundColor: '#eff6ff',
    padding: 15,
    borderRadius: 8,
    width: '30%',
    alignItems: 'center',
  },
  kpiValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  kpiLabel: {
    fontSize: 10,
    color: '#6b7280',
    marginTop: 5,
  },
  table: {
    marginTop: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingVertical: 8,
  },
  tableHeader: {
    backgroundColor: '#f3f4f6',
    fontWeight: 'bold',
  },
  tableCol: {
    flex: 1,
    fontSize: 10,
  },
  tableColSmall: {
    flex: 0.5,
    fontSize: 10,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 9,
    color: '#9ca3af',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 10,
  },
});

interface ReporteTemplateProps {
  tipo: string;
  filtros: any;
  datos: any;
}

export const ReporteTemplate = ({ tipo, filtros, datos }: ReporteTemplateProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Encabezado */}
      <View style={styles.header}>
        <Text style={styles.title}>Sistema de Gestión de Egresados</Text>
        <Text style={styles.subtitle}>
          Reporte de {tipo === 'empleabilidad' ? 'EMPLEABILIDAD' : 'OFERTAS ACTIVAS'}
        </Text>
        <Text style={styles.date}>Generado: {new Date().toLocaleString()}</Text>
      </View>

      {/* Filtros */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Filtros Aplicados</Text>
        {filtros?.fechaDesde && <Text style={styles.value}>📅 Desde: {filtros.fechaDesde}</Text>}
        {filtros?.fechaHasta && <Text style={styles.value}>📅 Hasta: {filtros.fechaHasta}</Text>}
        {!filtros?.fechaDesde && !filtros?.fechaHasta && (
          <Text style={styles.value}>Sin filtros aplicados</Text>
        )}
      </View>

      {/* KPIs para empleabilidad */}
      {tipo === 'empleabilidad' && (
        <>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Indicadores Clave</Text>
            <View style={styles.kpiContainer}>
              <View style={styles.kpiCard}>
                <Text style={styles.kpiValue}>{datos.totalEgresados}</Text>
                <Text style={styles.kpiLabel}>Total Egresados</Text>
              </View>
              <View style={styles.kpiCard}>
                <Text style={styles.kpiValue}>{datos.contratados}</Text>
                <Text style={styles.kpiLabel}>Contratados</Text>
              </View>
              <View style={styles.kpiCard}>
                <Text style={styles.kpiValue}>{datos.tasa}%</Text>
                <Text style={styles.kpiLabel}>Tasa Empleabilidad</Text>
              </View>
            </View>
          </View>

          {/* Tabla por carrera */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Empleabilidad por Carrera</Text>
            <View style={styles.table}>
              <View style={[styles.tableRow, styles.tableHeader]}>
                <Text style={styles.tableCol}>Carrera</Text>
                <Text style={styles.tableColSmall}>Egresados</Text>
                <Text style={styles.tableColSmall}>Contratados</Text>
                <Text style={styles.tableColSmall}>Tasa</Text>
              </View>
              {datos.porCarrera.map((item: any, i: number) => (
                <View style={styles.tableRow} key={i}>
                  <Text style={styles.tableCol}>{item.carrera}</Text>
                  <Text style={styles.tableColSmall}>{item.total}</Text>
                  <Text style={styles.tableColSmall}>{item.contratados}</Text>
                  <Text style={styles.tableColSmall}>{item.tasa}%</Text>
                </View>
              ))}
            </View>
          </View>
        </>
      )}

      {/* Ofertas activas */}
      {tipo === 'ofertas_activas' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ofertas Activas ({datos.ofertas?.length || 0})</Text>
          {datos.ofertas?.map((oferta: any, i: number) => (
            <View key={i} style={{ marginBottom: 15 }}>
              <Text style={styles.label}>{i + 1}. {oferta.titulo}</Text>
              <Text style={styles.value}>🏢 {oferta.empresa?.nombreEmpresa || 'Empresa'}</Text>
              <Text style={styles.value}>📍 Modalidad: {oferta.modalidad || 'No especificada'}</Text>
              {oferta.salarioMin && oferta.salarioMax && (
                <Text style={styles.value}>💰 {oferta.salarioMin} - {oferta.salarioMax} USD</Text>
              )}
              <Text style={styles.value}>📝 {oferta.descripcion?.substring(0, 150)}...</Text>
            </View>
          ))}
        </View>
      )}

      {/* Pie de página */}
      <View style={styles.footer} fixed>
        <Text>Reporte generado automáticamente por el Sistema de Gestión de Egresados</Text>
      </View>
    </Page>
  </Document>
);