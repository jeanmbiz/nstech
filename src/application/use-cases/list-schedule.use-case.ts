import type { SchedulingRepository } from "../../domain/repositories/scheduling.repository";
import { SchedulingStatus } from "../../domain/shared/scheduling-status";
import { CPF } from "../../domain/value-objects/cpf";
import type { ScheduleResponseDTO } from "../dtos/create-schedule.dto";
import type { ListSchedulesInputDTO, ListSchedulesOutputDTO } from "../dtos/list-schedule.dto";

export class ListSchedulesUseCase {
  constructor(private readonly schedulingRepository: SchedulingRepository) {}

  async execute(input: ListSchedulesInputDTO): Promise<ListSchedulesOutputDTO> {
    if (input.motoristaCpf) {
      new CPF(input.motoristaCpf);
    }

    if (input.status) {
      const validStatuses = Object.values(SchedulingStatus);
      if (!validStatuses.includes(input.status as SchedulingStatus)) {
        throw new Error(`Status inválido. Valores aceitos: ${validStatuses.join(", ")}`);
      }
    }

    if (input.data) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(input.data)) {
        throw new Error("Data deve estar no formato YYYY-MM-DD");
      }

      const date = new Date(input.data);
      if (Number.isNaN(date.getTime())) {
        throw new Error("Data inválida");
      }
    }

    const schedules = await this.schedulingRepository.allScheduling();

    let filteredSchedules = schedules;

    if (input.data) {
      const [year, month, day] = input.data.split("-").map(Number);

      filteredSchedules = filteredSchedules.filter((schedule) => {
        const scheduleDate = new Date(schedule.dataHora);
        return (
          scheduleDate.getFullYear() === year &&
          scheduleDate.getMonth() === month - 1 &&
          scheduleDate.getDate() === day
        );
      });
    }

    if (input.status) {
      filteredSchedules = filteredSchedules.filter(
        (schedule) => schedule.getStatusValue() === input.status,
      );
    }

    if (input.motoristaCpf) {
      filteredSchedules = filteredSchedules.filter(
        (schedule) => schedule.motoristaCpf.getValue() === input.motoristaCpf,
      );
    }

    const schedulesOutput: ScheduleResponseDTO[] = filteredSchedules.map((schedule) => ({
      id: schedule.id,
      dataHora: schedule.dataHora.toISOString(),
      numeroContrato: schedule.numeroContrato.getValue(),
      motoristaNome: schedule.motoristaNome,
      motoristaCpf: schedule.motoristaCpf.getValue(),
      placaCaminhao: schedule.placaCaminhao.getValue(),
      status: schedule.getStatusValue(),
    }));

    return {
      agendamentos: schedulesOutput,
      total: schedulesOutput.length,
    };
  }
}
