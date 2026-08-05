const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  try {
    // Check if users exist
    const userCount = await prisma.user.count();
    if (userCount > 0) {
      console.log('Database already has data. Skipping seed.');
      return;
    }

    console.log('Creating medicines...');

    // Create medicines
    await prisma.medicine.createMany({
      data: [
        {
          sku: 'GEN001',
          name: 'Paracetamol 500mg',
          category: 'GENERIC',
          price: 10.99,
          stock: 50,
          expirationDate: new Date('2025-12-31')
        },
        {
          sku: 'GEN002',
          name: 'Ibuprofeno 400mg',
          category: 'GENERIC',
          price: 15.50,
          stock: 8,
          expirationDate: new Date('2024-08-15')
        },
        {
          sku: 'GEN003',
          name: 'Omeprazol 20mg',
          category: 'GENERIC',
          price: 12.75,
          stock: 30,
          expirationDate: new Date('2025-06-30')
        },
        {
          sku: 'ANT001',
          name: 'Amoxicilina 500mg',
          category: 'ANTIBIOTIC',
          price: 25.30,
          stock: 12,
          expirationDate: new Date('2025-03-20')
        },
        {
          sku: 'ANT002',
          name: 'Azitromicina 500mg',
          category: 'ANTIBIOTIC',
          price: 35.80,
          stock: 3,
          expirationDate: new Date('2024-12-10')
        },
        {
          sku: 'CFR001',
          name: 'Insulina Glargina 100UI',
          category: 'COLD_CHAIN',
          price: 85.00,
          stock: 25,
          expirationDate: new Date('2025-02-28')
        },
        {
          sku: 'CFR002',
          name: 'Vacuna Antigripal',
          category: 'COLD_CHAIN',
          price: 45.50,
          stock: 15,
          expirationDate: new Date('2024-10-15')
        }
      ]
    });

    console.log('Medicines created successfully');

    const totalMedicines = await prisma.medicine.count();
    
    console.log('');
    console.log('Seed Summary:');
    console.log('   - Total medicines: ' + totalMedicines);
    console.log('');
    console.log('Seed completed successfully!');
    
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  } finally {
    await prisma.();
  }
}

main();
