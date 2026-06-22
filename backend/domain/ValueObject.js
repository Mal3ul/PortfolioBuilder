// Classe de base abstraite pour les "value objects" du domaine.
//
// Principes POO illustrés ici :
// - Encapsulation : la valeur est exposée en lecture seule (getter, pas de setter).
// - Immuabilité : l'objet est gelé à la construction (Object.freeze).
// - Égalité par valeur : deux value objects sont égaux s'ils portent la même valeur.
// - Abstraction : cette classe ne s'instancie pas directement, seules ses
//   sous-classes (Email, Password, ...) le peuvent.
export class ValueObject {
  constructor(value) {
    if (new.target === ValueObject) {
      throw new Error("ValueObject est une classe abstraite : utilisez une sous-classe.");
    }
    this._value = value;
    Object.freeze(this);
  }

  get value() {
    return this._value;
  }

  equals(other) {
    return other instanceof ValueObject && other.value === this._value;
  }

  toString() {
    return String(this._value);
  }
}
