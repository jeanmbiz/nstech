import { Scheduling } from "../../domain/entities/scheduling";
import { ScheduleNotFoundException } from "../../domain/exceptions/domain.exceptions";
import { SchedulingRepository } from "../../domain/repositories/scheduling.repository";
import { SchedulingStatusVO } from "../../domain/value-objects/status-scheduling";
import { ChangeStatusResponseDTO, ChangeStatusScheduleDTO } from "../dtos/change-status-schedule.dto";


export class ChangeStatusSchedulingUseCase {
  constructor(
    private readonly schedulingRepository: SchedulingRepository
  ) { }

  async execute(id: string, dto: ChangeStatusScheduleDTO): Promise<ChangeStatusResponseDTO> {
    const scheduling = await this.schedulingRepository.schedulingById(id);

    if (!scheduling) {
      throw new ScheduleNotFoundException(id);
    }

    const newStatus = new SchedulingStatusVO(dto.status);

    scheduling.changeStatus(newStatus);

    const updatedScheduling = await this.schedulingRepository.update(scheduling);

    return this.toResponseDTO(updatedScheduling);
  }

  private toResponseDTO(scheduling: Scheduling): ChangeStatusResponseDTO {
    return {
      id: scheduling.id,
      dataHora: scheduling.dataHora.toISOString(),
      numeroContrato: scheduling.numeroContrato.getValue(),
      motoristaNome: scheduling.motoristaNome,
      motoristaCpf: scheduling.motoristaCpf.getValue(),
      placaCaminhao: scheduling.placaCaminhao.getValue(),
      status: scheduling.getStatusValue()
    };
  }
}