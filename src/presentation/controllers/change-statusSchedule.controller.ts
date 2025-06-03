import { ChangeStatusScheduleDTO } from "../../application/dtos/change-status-schedule.dto";
import { ChangeStatusSchedulingUseCase } from "../../application/use-cases/change-status-schedule.use-case";
import { Request, Response } from 'express';

export class ChangeStatusScheduleController {
  constructor(private readonly changeStatusSchedulingUseCase: ChangeStatusSchedulingUseCase) { }

  async handle(req: Request, res: Response, next: Function): Promise<void> {
    try {
      const { id } = req.params;
      const dto: ChangeStatusScheduleDTO = req.body;
      const scheduling = await this.changeStatusSchedulingUseCase.execute(id, dto);
      res.status(200).json(scheduling);
    } catch (error) {
      next(error);
    }
  }
}