import type { ChangeStatusScheduleDTO } from "../application/dtos/change-status-schedule.dto";
import type { CreateScheduleDTO } from "../application/dtos/create-schedule.dto";
import { ChangeStatusSchedulingUseCase } from "../application/use-cases/change-status-schedule.use-case";
import { CreateScheduleUseCase } from "../application/use-cases/create-schedule.use-case";
import { InMemorySchedulingRepository } from "../infra/repositories/in-memory-scheduling.repository";

describe("Create Schedule Use Case", () => {
  let createScheduleUseCase: CreateScheduleUseCase;
  let changeStatusSchedulingUseCase: ChangeStatusSchedulingUseCase;
  let repository: InMemorySchedulingRepository;

  beforeEach(() => {
    repository = new InMemorySchedulingRepository();
    createScheduleUseCase = new CreateScheduleUseCase(repository);
    changeStatusSchedulingUseCase = new ChangeStatusSchedulingUseCase(repository);
  });

  it("Deve criar um novo agendamento com status pendente", async () => {
    const dto: CreateScheduleDTO = {
      motoristaNome: "João",
      motoristaCpf: "12345678900",
      placaCaminhao: "ABC-1234",
      numeroContrato: "CT123",
      dataHora: "2024-09-15T10:00:00Z",
    };

    const result = await createScheduleUseCase.execute(dto);

    expect(result).toMatchObject({
      dataHora: "2024-09-15T10:00:00.000Z",
      numeroContrato: "CT123",
      motoristaNome: "João",
      motoristaCpf: "12345678900",
      placaCaminhao: "ABC-1234",
      status: "pendente",
    });
    expect(result.id).toBeDefined();
  });

  it("Não deve permitir agendamento de dois motoristas no mesmo horário", async () => {
    const dto1: CreateScheduleDTO = {
      dataHora: "2024-09-15T10:00:00Z",
      numeroContrato: "CT123",
      motoristaNome: "João",
      motoristaCpf: "12345678900",
      placaCaminhao: "ABC-1234",
    };

    await createScheduleUseCase.execute(dto1);

    const dto2: CreateScheduleDTO = {
      dataHora: "2024-09-15T10:00:00Z",
      numeroContrato: "CT456",
      motoristaNome: "Jean",
      motoristaCpf: "98765432100",
      placaCaminhao: "XYZ-5678",
    };

    await expect(createScheduleUseCase.execute(dto2)).rejects.toThrow("Conflito de agendamento");
  });

  it("Não deve permitir agendamento se o motorista tem um agendamento pendente", async () => {
    const dto1: CreateScheduleDTO = {
      dataHora: "2024-09-15T10:00:00Z",
      numeroContrato: "CT123",
      motoristaNome: "João",
      motoristaCpf: "12345678900",
      placaCaminhao: "ABC-1234",
    };

    const schedule = await createScheduleUseCase.execute(dto1);

    const dto2: CreateScheduleDTO = {
      dataHora: "2024-09-16T10:00:00Z",
      numeroContrato: "CT124",
      motoristaNome: "João",
      motoristaCpf: "12345678900",
      placaCaminhao: "ABC-1234",
    };

    await expect(schedule.status).toEqual("pendente");
    await expect(createScheduleUseCase.execute(dto2)).rejects.toThrow("Conflito de agendamento");
  });

  it("Não deve permitir agendamento se o motorista tem um agendamento atrasado", async () => {
    const dto1: CreateScheduleDTO = {
      dataHora: "2024-09-15T10:00:00Z",
      numeroContrato: "CT123",
      motoristaNome: "João",
      motoristaCpf: "12345678900",
      placaCaminhao: "ABC-1234",
    };

    const schedule = await createScheduleUseCase.execute(dto1);

    const dto2: CreateScheduleDTO = {
      dataHora: "2024-09-16T10:00:00Z",
      numeroContrato: "CT123",
      motoristaNome: "João",
      motoristaCpf: "12345678900",
      placaCaminhao: "ABC-1234",
    };

    const changedDto: ChangeStatusScheduleDTO = {
      status: "atrasado",
    };

    const result = await changeStatusSchedulingUseCase.execute(schedule.id, changedDto);

    await expect(result.status).toEqual("atrasado");
    await expect(createScheduleUseCase.execute(dto2)).rejects.toThrow("Conflito de agendamento");
  });

  it("Deve lançar erro ao tentar criar agendamento com CPF inválido", async () => {
    const dto: CreateScheduleDTO = {
      dataHora: "2024-09-15T10:00:00Z",
      numeroContrato: "CT123",
      motoristaNome: "João",
      motoristaCpf: "123",
      placaCaminhao: "ABC-1234",
    };

    await expect(createScheduleUseCase.execute(dto)).rejects.toThrow("CPF inválido");
  });
});
