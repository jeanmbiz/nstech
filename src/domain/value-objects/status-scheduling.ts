import { InvalidStatusException } from "../exceptions/domain.exceptions";
import { SchedulingStatus } from "../shared/scheduling-status";

export class SchedulingStatusVO {
  private readonly value: SchedulingStatus;

  constructor(status: string) {
    if (!this.isValid(status)) {
      throw new InvalidStatusException(`Status '${status}' is not valid`);
    }
    this.value = status as SchedulingStatus;
  }

  getValue(): SchedulingStatus {
    return this.value;
  }

  private isValid(status: string): boolean {
    return Object.values(SchedulingStatus).includes(status as SchedulingStatus);
  }

  equals(other: SchedulingStatusVO): boolean {
    return this.value === other.value;
  }

  isPending(): boolean {
    return this.value === SchedulingStatus.PENDING;
  }

  isCompleted(): boolean {
    return this.value === SchedulingStatus.COMPLETED;
  }

  isLate(): boolean {
    return this.value === SchedulingStatus.LATE;
  }

  isCanceled(): boolean {
    return this.value === SchedulingStatus.CANCELED;
  }

  changeStatus(newStatus: SchedulingStatusVO): boolean {
    if (this.isCanceled()) {
      return false;
    }

    if (this.isCompleted() && newStatus.isCanceled()) {
      return false;
    }

    return true;
  }

  toString(): string {
    return this.value
  }
}
