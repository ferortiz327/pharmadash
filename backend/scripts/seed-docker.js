"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function hashPassword(password) {
    return bcrypt.hash(password, 10);
}
async function main() {
    console.log('🌱 Iniciando seed de la base de datos...');
    try {
        const userCount = await prisma.user.count();
        if (userCount > 0) {
            console.log('📊 La base de datos ya tiene datos. Omitiendo seed.');
            return;
        }
        const adminPassword = await hashPassword('admin123');
        const cashierPassword = await hashPassword('cashier123');
        const pharmacistPassword = await hashPassword('pharmacist123');
        console.log('👤 Creando usuarios...');
        await prisma.user.createMany({
            data: [
                {
                    email: 'admin@pharmadash.com',
                    passwordHash: adminPassword,
                    firstName: 'Admin',
                    lastName: 'Principal',
                    role: client_1.UserRole.ADMIN
                },
                {
                    email: 'cashier@pharmadash.com',
                    passwordHash: cashierPassword,
                    firstName: 'Cajero',
                    lastName: 'Demo',
                    role: client_1.UserRole.CASHIER
                },
                {
                    email: 'pharmacist@pharmadash.com',
                    passwordHash: pharmacistPassword,
                    firstName: 'Farmacéutico',
                    lastName: 'Demo',
                    role: client_1.UserRole.PHARMACIST
                }
            ]
        });
        console.log('👤 Creados 3 usuarios:');
        console.log('   📧 admin@pharmadash.com / admin123');
        console.log('   📧 cashier@pharmadash.com / cashier123');
        console.log('   📧 pharmacist@pharmadash.com / pharmacist123');
        console.log('💊 Creando medicamentos...');
        const medicinesData = [
            { sku: 'GEN001', name: 'Paracetamol 500mg', category: client_1.Category.GENERIC, price: 10.99, stock: 50, expirationDate: new Date('2025-12-31'), imageUrl: 'https://via.placeholder.com/150/4CAF50/FFFFFF?text=Paracetamol' },
            { sku: 'GEN002', name: 'Ibuprofeno 400mg', category: client_1.Category.GENERIC, price: 15.50, stock: 8, expirationDate: new Date('2024-08-15'), imageUrl: 'https://via.placeholder.com/150/2196F3/FFFFFF?text=Ibuprofeno' },
            { sku: 'GEN003', name: 'Omeprazol 20mg', category: client_1.Category.GENERIC, price: 12.75, stock: 30, expirationDate: new Date('2025-06-30'), imageUrl: 'https://via.placeholder.com/150/FF9800/FFFFFF?text=Omeprazol' },
            { sku: 'GEN004', name: 'Losartán 50mg', category: client_1.Category.GENERIC, price: 18.20, stock: 45, expirationDate: new Date('2025-10-20'), imageUrl: 'https://via.placeholder.com/150/9C27B0/FFFFFF?text=Losartan' },
            { sku: 'ANT001', name: 'Amoxicilina 500mg', category: client_1.Category.ANTIBIOTIC, price: 25.30, stock: 12, expirationDate: new Date('2025-03-20'), imageUrl: 'https://via.placeholder.com/150/F44336/FFFFFF?text=Amoxicilina' },
            { sku: 'ANT002', name: 'Azitromicina 500mg', category: client_1.Category.ANTIBIOTIC, price: 35.80, stock: 3, expirationDate: new Date('2024-12-10'), imageUrl: 'https://via.placeholder.com/150/E91E63/FFFFFF?text=Azitromicina' },
            { sku: 'ANT003', name: 'Ciprofloxacino 500mg', category: client_1.Category.ANTIBIOTIC, price: 28.40, stock: 15, expirationDate: new Date('2025-09-05'), imageUrl: 'https://via.placeholder.com/150/9C27B0/FFFFFF?text=Ciprofloxacino' },
            { sku: 'CFR001', name: 'Insulina Glargina 100UI', category: client_1.Category.COLD_CHAIN, price: 85.00, stock: 25, expirationDate: new Date('2025-02-28'), imageUrl: 'https://via.placeholder.com/150/00BCD4/FFFFFF?text=Insulina' },
            { sku: 'CFR002', name: 'Vacuna Antigripal', category: client_1.Category.COLD_CHAIN, price: 45.50, stock: 15, expirationDate: new Date('2024-10-15'), imageUrl: 'https://via.placeholder.com/150/4CAF50/FFFFFF?text=Vacuna' },
            { sku: 'CFR003', name: 'Eritropoyetina 2000UI', category: client_1.Category.COLD_CHAIN, price: 120.00, stock: 30, expirationDate: new Date('2025-07-01'), imageUrl: 'https://via.placeholder.com/150/FF5722/FFFFFF?text=Eritropoyetina' }
        ];
        await prisma.medicine.createMany({
            data: medicinesData
        });
        console.log(Creados, medicamentos, de, prueba);
        const genCount = medicinesData.filter(m => m.category === client_1.Category.GENERIC).length;
        const antCount = medicinesData.filter(m => m.category === client_1.Category.ANTIBIOTIC).length;
        const cfCount = medicinesData.filter(m => m.category === client_1.Category.COLD_CHAIN).length;
        console.log(-Genéricos);
        console.log(-Antibióticos);
        console.log(-Cadena, de, Frío);
        console.log('\n✅ Seed completado exitosamente!');
        console.log('📊 Datos cargados correctamente.');
    }
    catch (error) {
        console.error('❌ Error en el seed:', error);
        process.exit(1);
    }
    finally {
        await prisma.();
    }
}
main();
//# sourceMappingURL=seed-docker.js.map