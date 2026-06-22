import { ValueObject } from "./ValueObject.js";
import { badRequest } from "../utils/httpError.js";

// Format simple mais suffisant : "texte@texte.texte", sans espace.
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Value object représentant une adresse email valide et normalisée.
export class Email extends ValueObject {
  constructor(value) {
    const normalized = String(value ?? "").trim().toLowerCase();
    if (!EMAIL_REGEX.test(normalized)) {
      throw badRequest("Adresse email invalide");
    }
    super(normalized);
  }
}
