import type { NextFunction, Request, Response } from "express";
import type { CreateScheduleDTO } from "../../application/dtos/create-schedule.dto";
import type { CreateScheduleUseCase } from "../../application/use-cases/create-schedule.use-case";

export class CreateScheduleController {
  constructor(private readonly createScheduleUseCase: CreateScheduleUseCase) {}

  async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto: CreateScheduleDTO = req.body;
      const scheduling = await this.createScheduleUseCase.execute(dto);
      res.status(201).json(scheduling);
    } catch (error) {
      next(error);
    }
  }
}
