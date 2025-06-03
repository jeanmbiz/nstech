import { v4 as uuidv4 } from 'uuid';
import { Scheduling } from "../../domain/entities/scheduling";
import { SchedulingRepository } from "../../domain/repositories/scheduling.repository";
import { SchedulingDomainService } from "../../domain/services/scheduling-domain.service";
import { CPF } from "../../domain/value-objects/cpf";
import { TruckPlate } from "../../domain/value-objects/truck-plate";
import { CreateScheduleDTO, ScheduleResponseDTO } from "../dtos/create-schedule.dto";
import { SchedulingStatus } from '../../domain/shared/scheduling-status';
import { ContractNumber } from '../../domain/value-objects/contract-number';
import { SchedulingStatusVO } from '../../domain/value-objects/status-scheduling';


export class CreateScheduleUseCase {
  constructor(
    private readonly schedulingRepository: SchedulingRepository
  ) { }

  async execute(dto: CreateScheduleDTO): Promise<ScheduleResponseDTO> {
    const schedule = this.createScheduleFromDTO(dto);

    const existingSchedules = await this.schedulingRepository.allScheduling();

    SchedulingDomainService.validateConflicts(schedule, existingSchedules);

    const savedSchedule = await this.schedulingRepository.save(schedule);


    return this.toResponseDTO(savedSchedule);
  }

  private createScheduleFromDTO(dto: CreateScheduleDTO): Scheduling {
    return new Scheduling({
      id: uuidv4(),
      motoristaNome: dto.motoristaNome,
      motoristaCpf: new CPF(dto.motoristaCpf),
      placaCaminhao: new TruckPlate(dto.placaCaminhao),
      numeroContrato: new ContractNumber(dto.numeroContrato),
      dataHora: new Date(dto.dataHora),
      status: new SchedulingStatusVO(SchedulingStatus.PENDING)
    });
  }

  private toResponseDTO(schedule: Scheduling): ScheduleResponseDTO {
    return {
      id: schedule.id,
      dataHora: schedule.dataHora.toISOString(),
      numeroContrato: schedule.numeroContrato.getValue(),
      motoristaNome: schedule.motoristaNome,
      motoristaCpf: schedule.motoristaCpf.getValue(),
      placaCaminhao: schedule.placaCaminhao.getValue(),
      status: schedule.status.toString()
    };
  }
}