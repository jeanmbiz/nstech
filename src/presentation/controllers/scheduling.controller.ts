import { Request, Response } from 'express';
import { CreateScheduleUseCase } from '../../application/use-cases/create-schedule.use-case';
import { CreateScheduleDTO } from '../../application/dtos/create-schedule.dto';
import { ChangeStatusScheduleDTO } from '../../application/dtos/change-status-schedule.dto';
import { ChangeStatusSchedulingUseCase } from '../../application/use-cases/change-status-schedule.use-case';
import { InvalidStatusException, ScheduleNotFoundException } from '../../domain/exceptions/domain.exceptions';

export class SchedulingController {
  constructor(
    private readonly createScheduleUseCase: CreateScheduleUseCase,
    private readonly changeStatusSchedulingUseCase: ChangeStatusSchedulingUseCase
  ) { }

  async createSchedule(req: Request, res: Response): Promise<void> {
    try {
      const dto: CreateScheduleDTO = req.body;
      const scheduling = await this.createScheduleUseCase.execute(dto);

      res.status(201).json(scheduling);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async changeStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const dto: ChangeStatusScheduleDTO = req.body;

      const scheduling = await this.changeStatusSchedulingUseCase.execute(id, dto);

      res.status(200).json(scheduling);
    } catch (error) {
      this.handleError(error, res);
    }
  }


  private handleError(error: any, res: Response): void {
    if (error instanceof ScheduleNotFoundException) {
      res.status(404).json({ error: error.message });
      return;
    }

    if (error instanceof InvalidStatusException) {
      res.status(400).json({ error: error.message });
      return;
    }

    if (error.message === 'Conflito de agendamento') {
      res.status(409).json({ error: error.message });
      return;
    }

    if (error.message.includes('inválido') || error.message.includes('vazio')) {
      res.status(400).json({ error: error.message });
      return;
    }

    console.error('Erro não tratado:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
