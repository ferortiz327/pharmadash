import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import { EnvConfig } from './infrastructure/config/env.config';
import medicineRoutes from './presentation/routes/medicine.routes';
import authRoutes from './presentation/routes/auth.routes';
import saleRoutes from './presentation/routes/sale.routes';
import dashboardRoutes from './presentation/routes/dashboard.routes';
import swaggerRoutes from './presentation/routes/swagger.routes';

const app = express();
const PORT = EnvConfig.getNumber('PORT') || 3000;

app.use(helmet());
app.use(cors({
  origin: EnvConfig.getOrDefault('CORS_ORIGIN', '*'),
  credentials: true
}));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(EnvConfig.isDevelopment() ? 'dev' : 'combined'));

app.get('/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    environment: EnvConfig.getNodeEnv(),
    service: 'pharmadash-api',
    version: '1.0.0'
  });
});

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api-docs', swaggerRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'PharmaDash API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      medicines: '/api/medicines',
      sales: '/api/sales',
      dashboard: '/api/dashboard',
      docs: '/api-docs'
    }
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});

app.use((err: any, req: any, res: any, next: any) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(EnvConfig.isDevelopment() && { stack: err.stack })
  });
});

app.listen(PORT, () => {
  console.log('PharmaDash API');
  console.log('Server running on http://localhost:' + PORT);
  console.log('Health Check: http://localhost:' + PORT + '/health');
  console.log('Auth: http://localhost:' + PORT + '/api/auth');
  console.log('Medicines: http://localhost:' + PORT + '/api/medicines');
  console.log('Sales: http://localhost:' + PORT + '/api/sales');
  console.log('Dashboard: http://localhost:' + PORT + '/api/dashboard');
  console.log('Documentation: http://localhost:' + PORT + '/api-docs');
  console.log('Environment: ' + EnvConfig.getNodeEnv());
});
