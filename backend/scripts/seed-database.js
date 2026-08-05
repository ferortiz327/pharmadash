"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function seed() {
    console.log('🌱 Iniciando seed de la base de datos...');
    try {
        await prisma.saleItem.deleteMany();
        await prisma.sale.deleteMany();
        await prisma.medicine.deleteMany();
        await prisma.user.deleteMany();
        await prisma.auditLog.deleteMany();
        console.log('🧹 Datos anteriores eliminados');
        const users = await Promise.all([
            prisma.user.create({
                data: {
                    email: 'admin@pharmadash.com',
                    passwordHash: '$...',
                    firstName: 'Admin',
                    lastName: 'Principal',
                    role: 'ADMIN'
                }
            }),
            prisma.user.create({
                data: {
                    email: 'cashier@pharmadash.com',
                    passwordHash: '$...',
                    firstName: 'Cajero',
                    lastName: 'Demo',
                    role: 'CASHIER'
                }
            }),
            prisma.user.create({
                data: {
                    email: 'pharmacist@pharmadash.com',
                    passwordHash: '$...',
                    firstName: 'Farmacéutico',
                    lastName: 'Demo',
                    role: 'PHARMACIST'
                }
            })
        ]);
        console.log(Creados, usuarios);
        const medicinesData = [
            {
                sku: 'GEN001',
                name: 'Paracetamol 500mg',
                category: client_1.Category.GENERIC,
                price: 10.99,
                stock: 50,
                expirationDate: new Date('2025-12-31'),
                imageUrl: 'https://example.com/paracetamol.jpg'
            },
            {
                sku: 'GEN002',
                name: 'Ibuprofeno 400mg',
                category: client_1.Category.GENERIC,
                price: 15.50,
                stock: 8,
                expirationDate: new Date('2024-08-15'),
                imageUrl: 'https://example.com/ibuprofeno.jpg'
            },
            {
                sku: 'GEN003',
                name: 'Omeprazol 20mg',
                category: client_1.Category.GENERIC,
                price: 12.75,
                stock: 30,
                expirationDate: new Date('2025-06-30'),
                imageUrl: 'https://example.com/omeprazol.jpg'
            },
            {
                sku: 'ANT001',
                name: 'Amoxicilina 500mg',
                category: client_1.Category.ANTIBIOTIC,
                price: 25.30,
                stock: 12,
                expirationDate: new Date('2025-03-20'),
                imageUrl: 'https://example.com/amoxicilina.jpg'
            },
            {
                sku: 'ANT002',
                name: 'Azitromicina 500mg',
                category: client_1.Category.ANTIBIOTIC,
                price: 35.80,
                stock: 3,
                expirationDate: new Date('2024-12-10'),
                imageUrl: 'https://example.com/azitromicina.jpg'
            },
            {
                sku: 'ANT003',
                name: 'Ciprofloxacino 500mg',
                category: client_1.Category.ANTIBIOTIC,
                price: 28.40,
                stock: 15,
                expirationDate: new Date('2025-09-05'),
                imageUrl: 'https://example.com/ciprofloxacino.jpg'
            },
            {
                sku: 'CFR001',
                name: 'Insulina Glargina',
                category: client_1.Category.COLD_CHAIN,
                price: 85.00,
                stock: 25,
                expirationDate: new Date('2025-02-28'),
                imageUrl: 'https://example.com/insulina.jpg'
            },
            {
                sku: 'CFR002',
                name: 'Vacuna Antigripal',
                category: client_1.Category.COLD_CHAIN,
                price: 45.50,
                stock: 15,
                expirationDate: new Date('2024-10-15'),
                imageUrl: 'https://example.com/vacuna.jpg'
            },
            {
                sku: 'CFR003',
                name: 'Eritropoyetina 2000UI',
                category: client_1.Category.COLD_CHAIN,
                price: 120.00,
                stock: 30,
                expirationDate: new Date('2025-07-01'),
                imageUrl: 'https://example.com/eritropoyetina.jpg'
            }
        ];
        const medicines = await Promise.all(medicinesData.map(data => prisma.medicine.create({ data })));
        console.log(Creados, medicamentos, de, prueba);
        console.log('✅ Seed completado exitosamente!');
    }
    catch (error) {
        console.error('❌ Error en el seed:', error);
        process.exit(1);
    }
    finally {
        await prisma.();
    }
}
seed();
//# sourceMappingURL=seed-database.js.map