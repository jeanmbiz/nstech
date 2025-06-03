import { ListSchedulesUseCase } from '../application/use-cases/list-schedule.use-case';
import { InMemorySchedulingRepository } from '../infra/repositories/in-memory-scheduling.repository';
import { Scheduling } from '../domain/entities/scheduling';
import { CPF } from '../domain/value-objects/cpf';
import { TruckPlate } from '../domain/value-objects/truck-plate';
import { ContractNumber } from '../domain/value-objects/contract-number';
import { SchedulingStatus } from '../domain/shared/scheduling-status';
import { SchedulingStatusVO } from '../domain/value-objects/status-scheduling';
import { v4 as uuidv4 } from 'uuid';

describe('List Schedule Use Case', () => {
  let casoDeUsoListarAgendamentos: ListSchedulesUseCase;
  let repositorio: InMemorySchedulingRepository;

  beforeEach(() => {
    repositorio = new InMemorySchedulingRepository();
    casoDeUsoListarAgendamentos = new ListSchedulesUseCase(repositorio);
  });

  const criarAgendamento = (
    dataHora: Date,
    numeroContrato: string,
    motoristaNome: string,
    motoristaCpf: string,
    placaCaminhao: string,
    status: SchedulingStatus = SchedulingStatus.PENDING
  ) => {
    return new Scheduling({
      id: uuidv4(),
      dataHora,
      numeroContrato: new ContractNumber(numeroContrato),
      motoristaNome,
      motoristaCpf: new CPF(motoristaCpf),
      placaCaminhao: new TruckPlate(placaCaminhao),
      status: new SchedulingStatusVO(status)
    });
  };

  describe('Quando listar todos os agendamentos sem filtros', () => {
    it('deve retornar todos os agendamentos', async () => {
      const agendamento1 = criarAgendamento(
        new Date('2024-09-15T10:00:00Z'),
        'CT123',
        'João Silva',
        '12345678901',
        'ABC-1234'
      );
      const agendamento2 = criarAgendamento(
        new Date('2024-09-16T14:00:00Z'),
        'CT124',
        'Maria Santos',
        '98765432109',
        'XYZ-5678'
      );
      await repositorio.save(agendamento1);
      await repositorio.save(agendamento2);

      const resultado = await casoDeUsoListarAgendamentos.execute({});

      expect(resultado.total).toBe(2);
      expect(resultado.agendamentos).toHaveLength(2);
      expect(resultado.agendamentos[0].motoristaNome).toBe('João Silva');
      expect(resultado.agendamentos[1].motoristaNome).toBe('Maria Santos');
    });
  });

  describe('Quando filtrar por data', () => {
    it('deve retornar agendamentos para a data especificada', async () => {
      const agendamento1 = criarAgendamento(
        new Date('2024-09-15T10:00:00Z'),
        'CT123',
        'João Silva',
        '12345678901',
        'ABC-1234'
      );
      const agendamento2 = criarAgendamento(
        new Date('2024-09-16T14:00:00Z'),
        'CT124',
        'Maria Santos',
        '98765432109',
        'XYZ-5678'
      );
      await repositorio.save(agendamento1);
      await repositorio.save(agendamento2);

      const resultado = await casoDeUsoListarAgendamentos.execute({
        data: '2024-09-15'
      });

      expect(resultado.total).toBe(1);
      expect(resultado.agendamentos[0].motoristaNome).toBe('João Silva');
    });

    it('deve lançar erro para formato de data inválido', async () => {
      await expect(casoDeUsoListarAgendamentos.execute({
        data: '15/09/2024'
      })).rejects.toThrow('Data deve estar no formato YYYY-MM-DD');
    });

    it('deve lançar erro para data inválida', async () => {
      await expect(casoDeUsoListarAgendamentos.execute({
        data: '2024-13-40'
      })).rejects.toThrow('Data inválida');
    });
  });

  describe('Quando filtrar por status', () => {
    it('deve retornar agendamentos com o status especificado', async () => {
      const agendamento1 = criarAgendamento(
        new Date('2024-09-15T10:00:00Z'),
        'CT123',
        'João Silva',
        '12345678901',
        'ABC-1234',
        SchedulingStatus.PENDING
      );
      const agendamento2 = criarAgendamento(
        new Date('2024-09-16T14:00:00Z'),
        'CT124',
        'Maria Santos',
        '98765432109',
        'XYZ-5678',
        SchedulingStatus.COMPLETED
      );
      await repositorio.save(agendamento1);
      await repositorio.save(agendamento2);

      const resultado = await casoDeUsoListarAgendamentos.execute({
        status: 'concluído'
      });

      expect(resultado.total).toBe(1);
      expect(resultado.agendamentos[0].motoristaNome).toBe('Maria Santos');
      expect(resultado.agendamentos[0].status).toBe('concluído');
    });

    it('deve lançar erro para status inválido', async () => {
      await expect(casoDeUsoListarAgendamentos.execute({
        status: 'status_invalido'
      })).rejects.toThrow('Status inválido');
    });
  });

  describe('Quando filtrar por CPF do motorista', () => {
    it('deve retornar agendamentos para o motorista especificado', async () => {
      const agendamento1 = criarAgendamento(
        new Date('2024-09-15T10:00:00Z'),
        'CT123',
        'João Silva',
        '12345678901',
        'ABC-1234'
      );
      const agendamento2 = criarAgendamento(
        new Date('2024-09-16T14:00:00Z'),
        'CT124',
        'Maria Santos',
        '98765432109',
        'XYZ-5678'
      );
      await repositorio.save(agendamento1);
      await repositorio.save(agendamento2);

      const resultado = await casoDeUsoListarAgendamentos.execute({
        motoristaCpf: '12345678901'
      });

      expect(resultado.total).toBe(1);
      expect(resultado.agendamentos[0].motoristaNome).toBe('João Silva');
      expect(resultado.agendamentos[0].motoristaCpf).toBe('12345678901');
    });

    it('deve lançar erro para CPF inválido', async () => {
      await expect(casoDeUsoListarAgendamentos.execute({
        motoristaCpf: '123'
      })).rejects.toThrow('CPF inválido');
    });
  });

  describe('Quando aplicar múltiplos filtros', () => {
    it('deve retornar agendamentos que correspondem a todos os filtros', async () => {
      const agendamento1 = criarAgendamento(
        new Date('2024-09-15T10:00:00Z'),
        'CT123',
        'João Silva',
        '12345678901',
        'ABC-1234',
        SchedulingStatus.PENDING
      );
      const agendamento2 = criarAgendamento(
        new Date('2024-09-15T14:00:00Z'),
        'CT124',
        'Maria Santos',
        '98765432109',
        'XYZ-5678',
        SchedulingStatus.PENDING
      );
      const agendamento3 = criarAgendamento(
        new Date('2024-09-15T16:00:00Z'),
        'CT125',
        'João Silva',
        '12345678901',
        'DEF-9012',
        SchedulingStatus.COMPLETED
      );
      await repositorio.save(agendamento1);
      await repositorio.save(agendamento2);
      await repositorio.save(agendamento3);

      const resultado = await casoDeUsoListarAgendamentos.execute({
        data: '2024-09-15',
        status: 'pendente',
        motoristaCpf: '12345678901'
      });

      expect(resultado.total).toBe(1);
      expect(resultado.agendamentos[0].motoristaNome).toBe('João Silva');
      expect(resultado.agendamentos[0].status).toBe('pendente');
      expect(resultado.agendamentos[0].placaCaminhao).toBe('ABC-1234');
    });
  });

  describe('Quando nenhum agendamento corresponder aos filtros', () => {
    it('deve retornar lista vazia', async () => {
      const agendamento1 = criarAgendamento(
        new Date('2024-09-15T10:00:00Z'),
        'CT123',
        'João Silva',
        '12345678901',
        'ABC-1234'
      );
      await repositorio.save(agendamento1);

      const resultado = await casoDeUsoListarAgendamentos.execute({
        data: '2024-09-16'
      });

      expect(resultado.total).toBe(0);
      expect(resultado.agendamentos).toHaveLength(0);
    });
  });
});