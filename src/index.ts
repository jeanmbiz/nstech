import express from 'express';
import { createScheduleValidation } from './presentation/middlewares/create-schedule-validation.middleware';
import { schedulingRoutes } from './presentation/routes/scheduling.routes';

const app = express();

app.use(express.json());
app.use('/api', createScheduleValidation)
app.use('/api', schedulingRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
