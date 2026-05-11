"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReporteTemplate = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const renderer_1 = require("@react-pdf/renderer");
const styles = renderer_1.StyleSheet.create({
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
const ReporteTemplate = ({ tipo, filtros, datos }) => ((0, jsx_runtime_1.jsx)(renderer_1.Document, { children: (0, jsx_runtime_1.jsxs)(renderer_1.Page, { size: "A4", style: styles.page, children: [(0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.header, children: [(0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.title, children: "Sistema de Gesti\u00F3n de Egresados" }), (0, jsx_runtime_1.jsxs)(renderer_1.Text, { style: styles.subtitle, children: ["Reporte de ", tipo === 'empleabilidad' ? 'EMPLEABILIDAD' : 'OFERTAS ACTIVAS'] }), (0, jsx_runtime_1.jsxs)(renderer_1.Text, { style: styles.date, children: ["Generado: ", new Date().toLocaleString()] })] }), (0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.section, children: [(0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.sectionTitle, children: "Filtros Aplicados" }), filtros?.fechaDesde && (0, jsx_runtime_1.jsxs)(renderer_1.Text, { style: styles.value, children: ["\uD83D\uDCC5 Desde: ", filtros.fechaDesde] }), filtros?.fechaHasta && (0, jsx_runtime_1.jsxs)(renderer_1.Text, { style: styles.value, children: ["\uD83D\uDCC5 Hasta: ", filtros.fechaHasta] }), !filtros?.fechaDesde && !filtros?.fechaHasta && ((0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.value, children: "Sin filtros aplicados" }))] }), tipo === 'empleabilidad' && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.section, children: [(0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.sectionTitle, children: "Indicadores Clave" }), (0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.kpiContainer, children: [(0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.kpiCard, children: [(0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.kpiValue, children: datos.totalEgresados }), (0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.kpiLabel, children: "Total Egresados" })] }), (0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.kpiCard, children: [(0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.kpiValue, children: datos.contratados }), (0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.kpiLabel, children: "Contratados" })] }), (0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.kpiCard, children: [(0, jsx_runtime_1.jsxs)(renderer_1.Text, { style: styles.kpiValue, children: [datos.tasa, "%"] }), (0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.kpiLabel, children: "Tasa Empleabilidad" })] })] })] }), (0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.section, children: [(0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.sectionTitle, children: "Empleabilidad por Carrera" }), (0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.table, children: [(0, jsx_runtime_1.jsxs)(renderer_1.View, { style: [styles.tableRow, styles.tableHeader], children: [(0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.tableCol, children: "Carrera" }), (0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.tableColSmall, children: "Egresados" }), (0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.tableColSmall, children: "Contratados" }), (0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.tableColSmall, children: "Tasa" })] }), datos.porCarrera.map((item, i) => ((0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.tableRow, children: [(0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.tableCol, children: item.carrera }), (0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.tableColSmall, children: item.total }), (0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.tableColSmall, children: item.contratados }), (0, jsx_runtime_1.jsxs)(renderer_1.Text, { style: styles.tableColSmall, children: [item.tasa, "%"] })] }, i)))] })] })] })), tipo === 'ofertas_activas' && ((0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.section, children: [(0, jsx_runtime_1.jsxs)(renderer_1.Text, { style: styles.sectionTitle, children: ["Ofertas Activas (", datos.ofertas?.length || 0, ")"] }), datos.ofertas?.map((oferta, i) => ((0, jsx_runtime_1.jsxs)(renderer_1.View, { style: { marginBottom: 15 }, children: [(0, jsx_runtime_1.jsxs)(renderer_1.Text, { style: styles.label, children: [i + 1, ". ", oferta.titulo] }), (0, jsx_runtime_1.jsxs)(renderer_1.Text, { style: styles.value, children: ["\uD83C\uDFE2 ", oferta.empresa?.nombreEmpresa || 'Empresa'] }), (0, jsx_runtime_1.jsxs)(renderer_1.Text, { style: styles.value, children: ["\uD83D\uDCCD Modalidad: ", oferta.modalidad || 'No especificada'] }), oferta.salarioMin && oferta.salarioMax && ((0, jsx_runtime_1.jsxs)(renderer_1.Text, { style: styles.value, children: ["\uD83D\uDCB0 ", oferta.salarioMin, " - ", oferta.salarioMax, " USD"] })), (0, jsx_runtime_1.jsxs)(renderer_1.Text, { style: styles.value, children: ["\uD83D\uDCDD ", oferta.descripcion?.substring(0, 150), "..."] })] }, i)))] })), (0, jsx_runtime_1.jsx)(renderer_1.View, { style: styles.footer, fixed: true, children: (0, jsx_runtime_1.jsx)(renderer_1.Text, { children: "Reporte generado autom\u00E1ticamente por el Sistema de Gesti\u00F3n de Egresados" }) })] }) }));
exports.ReporteTemplate = ReporteTemplate;
//# sourceMappingURL=ReporteTemplate.js.map