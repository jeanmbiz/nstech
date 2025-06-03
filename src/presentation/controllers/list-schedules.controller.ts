import { Request, Response } from 'express';
import { ListSchedulesInputDTO } from "../../application/dtos/list-schedule.dto";
import { ListSchedulesUseCase } from "../../application/use-cases/list-schedule.use-case";

export class ListSchedulesController {
  constructor(
    private readonly listSchedulesUseCase: ListSchedulesUseCase
  ) { }

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const { data, status, motoristaCpf } = req.query as {
        data?: string;
        status?: string;
        motoristaCpf?: string;
      };

      const input: ListSchedulesInputDTO = {
        data,
        status,
        motoristaCpf
      };

      const result = await this.listSchedulesUseCase.execute(input);

      res.status(200).json(result);
    } catch (error: any) {
      this.handleError(error, res);
    }
  }

  private handleError(error: any, res: Response): void {
    if (error.message.includes('inválido') || error.message.includes('vazio')) {
      res.status(400).json({ error: error.message });
      return;
    }

    console.error('Erro não tratado:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}