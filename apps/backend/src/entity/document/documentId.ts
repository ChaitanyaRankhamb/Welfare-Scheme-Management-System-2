export class DocumentId {
  constructor(public readonly value: string) {}

  equals(other: DocumentId): boolean {
    return this.value === other.value;
  }
}
