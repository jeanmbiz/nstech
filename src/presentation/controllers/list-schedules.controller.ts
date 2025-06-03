import type { NextFunction, Request, Response } from "express";
import type { ListSchedulesInputDTO } from "../../application/dtos/list-schedule.dto";
import type { ListSchedulesUseCase } from "../../application/use-cases/list-schedule.use-case";

export class ListSchedulesController {
  constructor(private readonly listSchedulesUseCase: ListSchedulesUseCase) { }

  async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { data, status, motoristaCpf } = req.query as {
        data?: string;
        status?: string;
        motoristaCpf?: string;
      };

      const input: ListSchedulesInputDTO = {
        data,
        status,
        motoristaCpf,
      };

      const result = await this.listSchedulesUseCase.execute(input);

      res.status(200).json(result);
    } catch (error: unknown) {
      next(error);
    }
  }
}
