import { Router } from 'express';
import { ChangeStatusValidation } from '../middlewares/change-status-validation.middleware';
import { changeStatusSchedulingUseCase } from './scheduling.routes';
import { ChangeStatusScheduleController } from '../controllers/change-statusSchedule.controller';
import { Request, Response, NextFunction } from 'express';


const changeStatusScheduleController = new ChangeStatusScheduleController(changeStatusSchedulingUseCase);
const changeStatusScheduleRoutes = Router();

changeStatusScheduleRoutes.patch('/agendamentos/:id/status', ChangeStatusValidation, (req: Request, res: Response, next: NextFunction) =>
  changeStatusScheduleController.handle(req, res, next)
);

export { changeStatusScheduleRoutes };
