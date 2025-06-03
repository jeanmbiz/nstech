import { Request, Response } from 'express';
import { CreateScheduleUseCase } from '../../application/use-cases/create-schedule.use-case';
import { CreateScheduleDTO } from '../../application/dtos/create-schedule.dto';

export class CreateScheduleController {
  constructor(private readonly createScheduleUseCase: CreateScheduleUseCase) { }

  async handle(req: Request, res: Response, next: Function): Promise<void> {
    try {
      const dto: CreateScheduleDTO = req.body;
      const scheduling = await this.createScheduleUseCase.execute(dto);
      res.status(201).json(scheduling);
    } catch (error) {
      next(error);
    }
  }
}

