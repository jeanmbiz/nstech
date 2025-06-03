import { ContractNumber } from "../value-objects/contract-number";
import { CPF } from "../value-objects/cpf";
import { SchedulingStatusVO } from "../value-objects/status-scheduling";
import { TruckPlate } from "../value-objects/truck-plate";
import { InvalidStatusException } from "../exceptions/domain.exceptions";

export interface SchedulingProps {
  id: string;
  motoristaNome: string;
  motoristaCpf: CPF;
  placaCaminhao: TruckPlate;
  numeroContrato: ContractNumber;
  dataHora: Date;
  status: SchedulingStatusVO;
}

export class Scheduling {
  private props: SchedulingProps;

  constructor(props: SchedulingProps) {
    this.props = props;
  }

  get id(): string {
    return this.props.id;
  }

  get motoristaNome(): string {
    return this.props.motoristaNome;
  }

  get motoristaCpf(): CPF {
    return this.props.motoristaCpf;
  }

  get placaCaminhao(): TruckPlate {
    return this.props.placaCaminhao;
  }

  get numeroContrato(): ContractNumber {
    return this.props.numeroContrato;
  }

  get dataHora(): Date {
    return new Date(this.props.dataHora);
  }

  get status(): SchedulingStatusVO {
    return this.props.status;
  }

  changeStatus(newStatus: SchedulingStatusVO): void {
    if (!this.props.status.changeStatus(newStatus)) {
      if (this.props.status.isCompleted() && newStatus.isCanceled()) {
        throw new InvalidStatusException('Não é possível cancelar um agendamento já concluído');
      }
      if (this.props.status.isCanceled()) {
        throw new InvalidStatusException('Não é possível alterar um agendamento cancelado');
      }
    }
    this.props.status = newStatus;
  }

  hasConflict(otherScheduling: Scheduling): boolean {
    return this.dataHora.getTime() === otherScheduling.dataHora.getTime();
  }

  driverHasConflictingStatus(): boolean {
    return this.props.status.isPending() || this.props.status.isLate();
  }

  getStatusValue(): string {
    return this.props.status.getValue();
  }
}