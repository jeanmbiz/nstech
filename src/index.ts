import express from 'express';
import { createScheduleRoutes } from './presentation/routes/create-schedule.routes';
import { changeStatusScheduleRoutes } from './presentation/routes/change-status-schedule.routes';
import { listSchedulesRoutes } from './presentation/routes/list-schedules.routes';
import { errorHandler } from './presentation/middlewares/error-handler.middleware';

const app = express();

app.use(express.json());

app.use('/api', createScheduleRoutes);
app.use('/api', changeStatusScheduleRoutes);
app.use('/api', listSchedulesRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
