"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createContext = createContext;
const prisma_service_1 = require("../prisma/prisma.service");
const jwt = require("jsonwebtoken");
const prisma = new prisma_service_1.PrismaService();
async function createContext({ req }) {
    let user = null;
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secreto-temporal');
            user = { id: decoded.sub, email: decoded.email, role: decoded.role };
        }
        catch (e) {
        }
    }
    return { prisma, user };
}
//# sourceMappingURL=context.js.map