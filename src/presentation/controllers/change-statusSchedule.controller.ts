import type { NextFunction, Request, Response } from "express";
import type { ChangeStatusScheduleDTO } from "../../application/dtos/change-status-schedule.dto";
import type { ChangeStatusSchedulingUseCase } from "../../application/use-cases/change-status-schedule.use-case";

export class ChangeStatusScheduleController {
  constructor(private readonly changeStatusSchedulingUseCase: ChangeStatusSchedulingUseCase) { }

  async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
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
