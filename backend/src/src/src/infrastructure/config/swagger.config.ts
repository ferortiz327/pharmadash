import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'PharmaDash API Documentation',
      version: '1.0.0',
      description: 'API para sistema de gesti?n farmac?utica con autenticaci?n JWT y RBAC',
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      },
      contact: {
        name: 'PharmaDash Team',
        email: 'support@pharmadash.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de Desarrollo'
      },
      {
        url: 'https://api.pharmadash.com',
        description: 'Servidor de Producci?n'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        // Auth
        RegisterRequest: {
          type: 'object',
          required: ['email', 'password', 'firstName', 'lastName'],
          properties: {
            email: { type: 'string', example: 'admin@pharmadash.com' },
            password: { type: 'string', example: 'admin123' },
            firstName: { type: 'string', example: 'Admin' },
            lastName: { type: 'string', example: 'Principal' },
            role: { type: 'string', enum: ['ADMIN', 'CASHIER', 'PHARMACIST'], example: 'ADMIN' }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', example: 'admin@pharmadash.com' },
            password: { type: 'string', example: 'admin123' }
          }
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: {
              type: 'object',
              properties: {
                id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
                email: { type: 'string', example: 'admin@pharmadash.com' },
                firstName: { type: 'string', example: 'Admin' },
                lastName: { type: 'string', example: 'Principal' },
                role: { type: 'string', example: 'ADMIN' },
                token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }
              }
            }
          }
        },
        // Medicine
        MedicineRequest: {
          type: 'object',
          required: ['sku', 'name', 'category', 'price', 'stock', 'expirationDate'],
          properties: {
            sku: { type: 'string', example: 'GEN001' },
            name: { type: 'string', example: 'Paracetamol 500mg' },
            category: { type: 'string', enum: ['GENERIC', 'ANTIBIOTIC', 'COLD_CHAIN'], example: 'GENERIC' },
            price: { type: 'number', example: 10.99 },
            stock: { type: 'integer', example: 50 },
            expirationDate: { type: 'string', format: 'date', example: '2027-12-31' },
            imageUrl: { type: 'string', example: 'https://via.placeholder.com/150/4CAF50/FFFFFF?text=Paracetamol' }
          }
        },
        MedicineResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: {
              type: 'object',
              properties: {
                id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
                sku: { type: 'string', example: 'GEN001' },
                name: { type: 'string', example: 'Paracetamol 500mg' },
                category: { type: 'string', example: 'GENERIC' },
                categoryLabel: { type: 'string', example: 'Generic' },
                price: { type: 'number', example: 10.99 },
                stock: { type: 'integer', example: 50 },
                expirationDate: { type: 'string', format: 'date-time' },
                isCriticalStock: { type: 'boolean', example: false },
                isExpiringSoon: { type: 'boolean', example: false },
                isExpired: { type: 'boolean', example: false },
                stockStatus: { type: 'string', enum: ['CRITICAL', 'LOW', 'NORMAL'] },
                taxRate: { type: 'number', example: 0 }
              }
            }
          }
        },
        // Sale
        SaleRequest: {
          type: 'object',
          required: ['items'],
          properties: {
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  medicineId: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
                  quantity: { type: 'integer', example: 2 }
                }
              }
            }
          }
        },
        SaleResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                cashierId: { type: 'string' },
                cashierName: { type: 'string' },
                items: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      medicineId: { type: 'string' },
                      medicineName: { type: 'string' },
                      quantity: { type: 'integer' },
                      unitPrice: { type: 'number' },
                      subtotal: { type: 'number' },
                      tax: { type: 'number' },
                      total: { type: 'number' }
                    }
                  }
                },
                subtotal: { type: 'number' },
                tax: { type: 'number' },
                total: { type: 'number' },
                status: { type: 'string', enum: ['COMPLETED', 'CANCELLED', 'PENDING'] },
                createdAt: { type: 'string', format: 'date-time' }
              }
            }
          }
        },
        // Dashboard
        DashboardMetrics: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: {
              type: 'object',
              properties: {
                dailyRevenue: { type: 'number', example: 561 },
                totalSales: { type: 'integer', example: 3 },
                averageTicket: { type: 'number', example: 187 },
                criticalStock: { type: 'integer', example: 6 },
                lowStock: { type: 'integer', example: 1 },
                expiringSoon: { type: 'integer', example: 3 },
                expired: { type: 'integer', example: 0 },
                totalMedicines: { type: 'integer', example: 16 }
              }
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/presentation/routes/*.ts']
};

export const swaggerSpec = swaggerJsdoc(options);
