import { ScheduleResponseDTO } from "./create-schedule.dto";

export interface ListSchedulesInputDTO {
  data?: string;
  status?: string;
  motoristaCpf?: string;
}

export interface ListSchedulesOutputDTO {
  agendamentos: ScheduleResponseDTO[];
  total: number;
}