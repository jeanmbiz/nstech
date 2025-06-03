export class CPF {
  private readonly value: string;

  constructor(cpf: string) {
    if (!this.isValid(cpf)) {
      throw new Error("CPF inválido");
    }
    this.value = this.clean(cpf);
  }

  getValue(): string {
    return this.value;
  }

  private clean(cpf: string): string {
    return cpf.replace(/\D/g, "");
  }

  private isValid(cpf: string): boolean {
    const cleanCpf = this.clean(cpf);
    return cleanCpf.length === 11 && /^\d+$/.test(cleanCpf);
  }

  equals(other: CPF): boolean {
    return this.value === other.value;
  }
}
