import { Scheduling } from "../../domain/entities/scheduling";
import { SchedulingRepository } from "../../domain/repositories/scheduling.repository";


export class InMemorySchedulingRepository implements SchedulingRepository {
  private schedulings: Scheduling[] = [];

  async save(scheduling: Scheduling): Promise<Scheduling> {
    this.schedulings.push(scheduling);
    return scheduling;
  }

  async allScheduling(): Promise<Scheduling[]> {
    return [...this.schedulings];
  }

  async schedulingById(id: string): Promise<Scheduling | null> {
    return this.schedulings.find(a => a.id === id) || null;
  }

  async update(scheduling: Scheduling): Promise<Scheduling> {
    const index = this.schedulings.findIndex(scheduling => scheduling.id === scheduling.id);

    if (index === -1) {
      throw new Error(`Scheduling com ID ${scheduling.id} não encontrado`);
    }

    this.schedulings[index] = scheduling;
    return scheduling;
  }
}