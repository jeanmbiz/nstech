import type { Scheduling } from "../entities/scheduling";

export function validateConflicts(newScheduling: Scheduling, existingScheduling: Scheduling[]): void {
  validateTimeConflict(newScheduling, existingScheduling);
  validateDriverConflict(newScheduling, existingScheduling);
}

function validateTimeConflict(
  newScheduling: Scheduling,
  existingScheduling: Scheduling[],
): void {
  const conflict = existingScheduling.some((scheduling) => newScheduling.hasConflict(scheduling));

  if (conflict) {
    throw new Error("Conflito de agendamento");
  }
}

function validateDriverConflict(
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
