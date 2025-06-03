export class ContractNumber {
  private readonly value: string;

  constructor(contractNumber: string) {
    if (!contractNumber || contractNumber.trim().length === 0) {
      throw new Error('Número do contrato não pode ser vazio');
    }
    this.value = contractNumber.trim();
  }

  getValue(): string {
    return this.value;
  }

  equals(other: ContractNumber): boolean {
    return this.value === other.value;
  }
}