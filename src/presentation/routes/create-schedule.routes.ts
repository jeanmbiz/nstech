import { Router } from 'express';
import { createScheduleValidation } from '../middlewares/create-schedule-validation.middleware';
import { CreateScheduleController } from '../controllers/create-schedule.controller';
import { createScheduleUseCase } from './scheduling.routes';
import { Request, Response, NextFunction } from 'express';

const createScheduleController = new CreateScheduleController(createScheduleUseCase);
const createScheduleRoutes = Router();

createScheduleRoutes.post('/agendamentos', createScheduleValidation, (req: Request, res: Response, next: NextFunction) =>
  createScheduleController.handle(req, res, next)
);

export { createScheduleRoutes };
