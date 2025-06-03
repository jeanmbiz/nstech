import { Request, Response } from 'express';
import { Router } from 'express';
import { InMemorySchedulingRepository } from '../../infra/repositories/in-memory-scheduling.repository';
import { CreateScheduleUseCase } from '../../application/use-cases/create-schedule.use-case';
import { SchedulingController } from '../controllers/scheduling.controller';
import { ChangeStatusSchedulingUseCase } from '../../application/use-cases/change-status-schedule.use-case';
import { ChangeStatusValidation } from '../middlewares/change-status-validation.middleware';
import { ListSchedulesController } from '../controllers/list-schedules.controller';
import { createScheduleValidation } from '../middlewares/create-schedule-validation.middleware';
import { ListSchedulesUseCase } from '../../application/use-cases/list-schedule.use-case';

const router = Router();

const schedulingRepository = new InMemorySchedulingRepository();
const createScheduleUseCase = new CreateScheduleUseCase(schedulingRepository);
const changeStatusSchedulingUseCase = new ChangeStatusSchedulingUseCase(schedulingRepository)
const listSchedulesUseCase = new ListSchedulesUseCase(schedulingRepository)

const schedulingController = new SchedulingController(createScheduleUseCase, changeStatusSchedulingUseCase);
const listSchedulesController = new ListSchedulesController(listSchedulesUseCase)

router.post('/agendamentos', createScheduleValidation, (req: Request, res: Response) =>
  schedulingController.createSchedule(req, res)
);

router.patch('/agendamentos/:id/status', ChangeStatusValidation, (req: Request, res: Response) =>
  schedulingController.changeStatus(req, res)
);

router.get(
  '/agendamentos',
  (req, res) => listSchedulesController.handle(req, res)
);

export { router as schedulingRoutes };