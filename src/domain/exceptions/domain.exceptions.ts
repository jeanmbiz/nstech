export class DomainException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainException';
  }
}

export class ScheduleNotFoundException extends DomainException {
  constructor(id: string) {
    super(`Agendamento com ID ${id} não foi encontrado`);
    this.name = 'ScheduleNotFoundExceptionException';
  }
}

export class InvalidStatusException extends DomainException {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidStatusException';
  }
}