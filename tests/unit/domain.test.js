import { describe, it, expect } from 'vitest';
import { ValueObject } from '../../backend/domain/ValueObject.js';
import { Email } from '../../backend/domain/Email.js';
import { Password } from '../../backend/domain/Password.js';

// Petit utilitaire : capture l'erreur levée par une fonction synchrone.
const capture = (fn) => {
  try {
    fn();
    return null;
  } catch (error) {
    return error;
  }
};

describe('ValueObject (POO - classe abstraite)', () => {
  it('ne peut pas être instanciée directement', () => {
    expect(() => new ValueObject('x')).toThrow();
  });
});

describe('Email (value object)', () => {
  it('accepte une adresse valide et la normalise (trim + minuscules)', () => {
    const email = new Email('  Jane@Example.COM ');
    expect(email.value).toBe('jane@example.com');
  });

  it('rejette une adresse invalide (400)', () => {
    expect(capture(() => new Email('pas-un-email'))).toMatchObject({ status: 400 });
  });

  it('compare par valeur avec equals()', () => {
    expect(new Email('a@b.co').equals(new Email('A@B.CO'))).toBe(true);
  });

  it('est immuable (la valeur ne peut pas être modifiée)', () => {
    const email = new Email('a@b.co');
    expect(() => { email._value = 'pirate@x.co'; }).toThrow();
  });
});

describe('Password (value object)', () => {
  it('accepte un mot de passe valide (8+, chiffre, caractère spécial)', () => {
    expect(new Password('secret1!').value).toBe('secret1!');
  });

  it('rejette un mot de passe trop court (400)', () => {
    expect(capture(() => new Password('Aa1!'))).toMatchObject({ status: 400 });
  });

  it('rejette un mot de passe sans chiffre (400)', () => {
    expect(capture(() => new Password('secret!!'))).toMatchObject({ status: 400 });
  });

  it('rejette un mot de passe sans caractère spécial (400)', () => {
    expect(capture(() => new Password('secret12'))).toMatchObject({ status: 400 });
  });

  it('expose la longueur minimale', () => {
    expect(Password.minLength).toBe(8);
  });
});
