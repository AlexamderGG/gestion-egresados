"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyReportDocument = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const renderer_1 = require("@react-pdf/renderer");
const styles = renderer_1.StyleSheet.create({
    page: { padding: 30 },
    title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
    section: { marginBottom: 10 },
    heading: { fontSize: 18, marginTop: 10, marginBottom: 5 },
    text: { fontSize: 12, marginBottom: 5 },
});
const MyReportDocument = ({ data, filtros }) => ((0, jsx_runtime_1.jsx)(renderer_1.Document, { children: (0, jsx_runtime_1.jsxs)(renderer_1.Page, { size: "A4", style: styles.page, children: [(0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.title, children: "Reporte de Empleabilidad" }), (0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.section, children: [(0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.heading, children: "Filtros aplicados:" }), (0, jsx_runtime_1.jsxs)(renderer_1.Text, { style: styles.text, children: ["Desde: ", filtros.desde || 'N/A', " - Hasta: ", filtros.hasta || 'N/A'] })] }), (0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.section, children: [(0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.heading, children: "Datos:" }), data.map((item, i) => ((0, jsx_runtime_1.jsxs)(renderer_1.Text, { style: styles.text, children: [item.carrera, ": ", item.tasa_empleabilidad, "%"] }, i)))] })] }) }));
exports.MyReportDocument = MyReportDocument;
//# sourceMappingURL=MyReportDocument.js.map