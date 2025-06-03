import { InMemorySchedulingRepository } from '../../infra/repositories/in-memory-scheduling.repository';
import { CreateScheduleUseCase } from '../../application/use-cases/create-schedule.use-case';
import { ChangeStatusSchedulingUseCase } from '../../application/use-cases/change-status-schedule.use-case';
import { ListSchedulesUseCase } from '../../application/use-cases/list-schedule.use-case';

const schedulingRepository = new InMemorySchedulingRepository();
const createScheduleUseCase = new CreateScheduleUseCase(schedulingRepository);
const changeStatusSchedulingUseCase = new ChangeStatusSchedulingUseCase(schedulingRepository);
const listSchedulesUseCase = new ListSchedulesUseCase(schedulingRepository);

export {
  schedulingRepository,
  createScheduleUseCase,
  changeStatusSchedulingUseCase,
  listSchedulesUseCase
};
