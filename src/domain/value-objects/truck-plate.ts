export class TruckPlate {
  private readonly value: string;

  constructor(plate: string) {
    if (!this.isValid(plate)) {
      throw new Error("plate do caminhão inválida");
    }
    this.value = plate.toUpperCase();
  }

  getValue(): string {
    return this.value;
  }

  private isValid(plate: string): boolean {
    const platePattern = /^[A-Z]{3}-\d{4}$/;
    return platePattern.test(plate.toUpperCase());
  }

  equals(other: TruckPlate): boolean {
    return this.value === other.value;
  }
}
