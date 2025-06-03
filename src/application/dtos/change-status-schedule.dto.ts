export interface ChangeStatusScheduleDTO {
  status: string;
}

export interface ChangeStatusResponseDTO {
  id: string;
  dataHora: string;
  numeroContrato: string;
  motoristaNome: string;
  motoristaCpf: string;
  placaCaminhao: string;
  status: string;
}
