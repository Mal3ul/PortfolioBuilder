import { ValueObject } from "./ValueObject.js";
import { badRequest } from "../utils/httpError.js";

const MIN_LENGTH = 8;
const HAS_DIGIT = /\d/;
const HAS_SPECIAL = /[^A-Za-z0-9]/;

// Value object représentant un mot de passe respectant la politique minimale.
export class Password extends ValueObject {
  constructor(value) {
    const password = String(value ?? "");
    if (password.length < MIN_LENGTH) {
      throw badRequest(`Le mot de passe doit faire au moins ${MIN_LENGTH} caractères`);
    }
    if (!HAS_DIGIT.test(password)) {
      throw badRequest("Le mot de passe doit contenir au moins un chiffre");
    }
    if (!HAS_SPECIAL.test(password)) {
      throw badRequest("Le mot de passe doit contenir au moins un caractère spécial");
    }
    super(password);
  }

  static get minLength() {
    return MIN_LENGTH;
  }
}
