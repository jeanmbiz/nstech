import type { Scheduling } from "../entities/scheduling";

export interface SchedulingRepository {
  save(scheduling: Scheduling): Promise<Scheduling>;
  allScheduling(): Promise<Scheduling[]>;
  schedulingById(id: string): Promise<Scheduling | null>;
  update(scheduling: Scheduling): Promise<Scheduling>;
}
