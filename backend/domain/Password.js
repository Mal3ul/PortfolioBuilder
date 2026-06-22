import { ValueObject } from "./ValueObject.js";
import { badRequest } from "../utils/httpError.js";

const MIN_LENGTH = 6;

// Value object représentant un mot de passe respectant la politique minimale.
export class Password extends ValueObject {
  constructor(value) {
    const password = String(value ?? "");
    if (password.length < MIN_LENGTH) {
      throw badRequest(`Le mot de passe doit faire au moins ${MIN_LENGTH} caractères`);
    }
    super(password);
  }

  static get minLength() {
    return MIN_LENGTH;
  }
}
