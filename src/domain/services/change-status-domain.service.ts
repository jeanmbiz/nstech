import type { Scheduling } from "../entities/scheduling";
import { ScheduleNotFoundException } from "../exceptions/domain.exceptions";
import type { SchedulingStatusVO } from "../value-objects/status-scheduling";

export function changeStatus(
  schedulings: Scheduling[],
  id: string,
  newStatus: SchedulingStatusVO,
): Scheduling {
  const scheduling = schedulings.find((a) => a.id === id);

  if (!scheduling) {
    throw new ScheduleNotFoundException(id);
  }
  scheduling.changeStatus(newStatus);

  return scheduling;
}
