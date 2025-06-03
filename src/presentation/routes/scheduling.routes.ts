import { Request, Response } from 'express';
import { Router } from 'express';
import { InMemorySchedulingRepository } from '../../infra/repositories/in-memory-scheduling.repository';
import { CreateScheduleUseCase } from '../../application/use-cases/create-schedule.use-case';
import { SchedulingController } from '../controllers/scheduling.controller';
import { ChangeStatusSchedulingUseCase } from '../../application/use-cases/change-status-schedule.use-case';
import { ChangeStatusValidation } from '../middlewares/change-status-validation.middleware';

const router = Router();

const schedulingRepository = new InMemorySchedulingRepository();
const createScheduleUseCase = new CreateScheduleUseCase(schedulingRepository);
const changeStatusSchedulingUseCase = new ChangeStatusSchedulingUseCase(schedulingRepository)

const schedulingController = new SchedulingController(createScheduleUseCase, changeStatusSchedulingUseCase);

router.post('/agendamentos', (req: Request, res: Response) =>
  schedulingController.createSchedule(req, res)
);


router.patch('/agendamentos/:id/status', ChangeStatusValidation, (req: Request, res: Response) =>
  schedulingController.changeStatus(req, res)
);

export { router as schedulingRoutes };