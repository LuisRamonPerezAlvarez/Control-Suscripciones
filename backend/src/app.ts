import express from 'express';
import cors from 'cors';
import dashboardRoutes from './routes/dashboard.routes';
import categoriasRoutes from './routes/categorias.routes';
import serviciosRoutes from './routes/servicios.routes';
import suscripcionesRoutes from './routes/suscripciones.routes';
import authRoutes from './routes/auth.routes';

const app = express();

app.use(cors());
app.use(express.json());

const apiRouter = express.Router();

apiRouter.get('/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Control de Suscripciones API' });
});

apiRouter.use('/auth', authRoutes);
apiRouter.use('/dashboard', dashboardRoutes);
apiRouter.use('/categorias', categoriasRoutes);
apiRouter.use('/servicios', serviciosRoutes);
apiRouter.use('/suscripciones', suscripcionesRoutes);

app.use('/', apiRouter);
app.use('/api', apiRouter);
app.use('/equipo_15/api', apiRouter);

app.use((_req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

export default app;
