import type { Scheduling } from "../entities/scheduling";

export class SchedulingDomainService {
  static validateConflicts(newScheduling: Scheduling, existingScheduling: Scheduling[]): void {
    this.validateTimeConflict(newScheduling, existingScheduling);
    this.validateDriverConflict(newScheduling, existingScheduling);
  }

  private static validateTimeConflict(
    newScheduling: Scheduling,
    existingScheduling: Scheduling[],
  ): void {
    const conflict = existingScheduling.some((scheduling) => newScheduling.hasConflict(scheduling));

    if (conflict) {
      throw new Error("Conflito de agendamento");
    }
  }

  private static validateDriverConflict(
    newScheduling: Scheduling,
    existingScheduling: Scheduling[],
  ): void {
    const driverHasConflict = existingScheduling.some(
      (scheduling) =>
        scheduling.motoristaCpf.equals(newScheduling.motoristaCpf) &&
        scheduling.driverHasConflictingStatus(),
    );

    if (driverHasConflict) {
      throw new Error("Conflito de agendamento");
    }
  }
}
