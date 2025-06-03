export interface CreateScheduleDTO {
  dataHora: string;
  numeroContrato: string;
  motoristaNome: string;
  motoristaCpf: string;
  placaCaminhao: string;
}

export interface ScheduleResponseDTO {
  id: string;
  dataHora: string;
  numeroContrato: string;
  motoristaNome: string;
  motoristaCpf: string;
  placaCaminhao: string;
  status: string;
}