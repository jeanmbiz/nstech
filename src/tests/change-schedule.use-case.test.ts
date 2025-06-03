import type { ChangeStatusScheduleDTO } from "../application/dtos/change-status-schedule.dto";
import type { CreateScheduleDTO } from "../application/dtos/create-schedule.dto";
import { ChangeStatusSchedulingUseCase } from "../application/use-cases/change-status-schedule.use-case";
import { CreateScheduleUseCase } from "../application/use-cases/create-schedule.use-case";
import { InMemorySchedulingRepository } from "../infra/repositories/in-memory-scheduling.repository";

describe("Change Schedule Use Case", () => {
  let createScheduleUseCase: CreateScheduleUseCase;
  let changeStatusSchedulingUseCase: ChangeStatusSchedulingUseCase;
  let repository: InMemorySchedulingRepository;

  beforeEach(() => {
    repository = new InMemorySchedulingRepository();
    createScheduleUseCase = new CreateScheduleUseCase(repository);
    changeStatusSchedulingUseCase = new ChangeStatusSchedulingUseCase(repository);
  });

  it("deve alterar o status de um agendamento para concluído", async () => {
    const dto: CreateScheduleDTO = {
      dataHora: "2024-09-15T10:00:00Z",
      numeroContrato: "CT123",
      motoristaNome: "João",
      motoristaCpf: "12345678900",
      placaCaminhao: "ABC-1234",
    };

    const schedule = await createScheduleUseCase.execute(dto);

    const changedDto: ChangeStatusScheduleDTO = {
      status: "concluído",
    };

    const result = await changeStatusSchedulingUseCase.execute(schedule.id, changedDto);

    expect(result.status).toEqual("concluído");
    expect(result.id).toBe(schedule.id);
  });

  it("deve alterar o status de um agendamento para cancelado", async () => {
    const dto: CreateScheduleDTO = {
      dataHora: "2024-09-15T10:00:00Z",
      numeroContrato: "CT123",
      motoristaNome: "João",
      motoristaCpf: "12345678900",
      placaCaminhao: "ABC-1234",
    };

    const schedule = await createScheduleUseCase.execute(dto);

    const changedDto: ChangeStatusScheduleDTO = {
      status: "cancelado",
    };

    const result = await changeStatusSchedulingUseCase.execute(schedule.id, changedDto);

    expect(result.status).toEqual("cancelado");
    expect(result.id).toBe(schedule.id);
  });

  it("Não deve ser possível alterar o status de um agendamento concluído para cancelado", async () => {
    const dto: CreateScheduleDTO = {
      dataHora: "2024-09-15T10:00:00Z",
      numeroContrato: "CT123",
      motoristaNome: "João",
      motoristaCpf: "12345678900",
      placaCaminhao: "ABC-1234",
    };

    const schedule = await createScheduleUseCase.execute(dto);

    const result = await changeStatusSchedulingUseCase.execute(schedule.id, {
      status: "concluído",
    });

    expect(result.status).toEqual("concluído");

    await expect(
      changeStatusSchedulingUseCase.execute(schedule.id, { status: "cancelado" }),
    ).rejects.toThrow("Não é possível cancelar um agendamento já concluído");
  });

  it("Não deve ser possível alterar o status de um agendamento cancelado", async () => {
    const dto: CreateScheduleDTO = {
      dataHora: "2024-09-15T10:00:00Z",
      numeroContrato: "CT123",
      motoristaNome: "João",
      motoristaCpf: "12345678900",
      placaCaminhao: "ABC-1234",
    };

    const schedule = await createScheduleUseCase.execute(dto);

    const result = await changeStatusSchedulingUseCase.execute(schedule.id, {
      status: "cancelado",
    });

    expect(result.status).toEqual("cancelado");

    await expect(
      changeStatusSchedulingUseCase.execute(schedule.id, { status: "concluído" }),
    ).rejects.toThrow("Não é possível alterar um agendamento cancelado");
  });
});
