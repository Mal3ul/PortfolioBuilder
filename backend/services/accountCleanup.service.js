import * as userRepository from "../repositories/user.repository.js";
import * as portfolioRepository from "../repositories/portfolio.repository.js";
import { sendInactivityWarningEmail } from "../utils/email.js";
import { INACTIVITY_DAYS, INACTIVITY_GRACE_DAYS } from "../config.js";

// Nettoyage des comptes inactifs (politique de conservation des données).
//
// Cycle de vie d'un compte inactif :
//   1. Pas de connexion depuis INACTIVITY_DAYS jours  -> e-mail d'avertissement.
//   2. Toujours pas de connexion INACTIVITY_GRACE_DAYS jours après l'e-mail
//      -> suppression définitive (compte + données en cascade).
// Toute reconnexion réarme le cycle (cf. userRepository.updateLastLogin).

const warnInactiveAccounts = async () => {
  const users = await userRepository.findInactiveToWarn(INACTIVITY_DAYS);
  let warned = 0;

  for (const user of users) {
    const result = await sendInactivityWarningEmail(
      user.email,
      user.name,
      INACTIVITY_GRACE_DAYS
    );

    if (result.success) {
      await userRepository.markInactivityWarning(user.id);
      warned += 1;
    } else {
      // On ne marque pas l'avertissement si l'envoi a échoué : nouvelle
      // tentative au prochain passage du job.
      console.error(`[CLEANUP] Échec de l'e-mail d'avertissement pour ${user.email}:`, result.error);
    }
  }

  return warned;
};

const deleteInactiveAccounts = async () => {
  const users = await userRepository.findInactiveToDelete(INACTIVITY_DAYS, INACTIVITY_GRACE_DAYS);
  let deleted = 0;

  for (const user of users) {
    await portfolioRepository.deleteByUserId(user.id);
    await userRepository.remove(user.id);
    console.log(`[CLEANUP] Compte inactif supprimé : ${user.email} (id=${user.id})`);
    deleted += 1;
  }

  return deleted;
};

// Exécute un cycle complet (avertissement puis suppression).
// Exporté pour pouvoir être déclenché manuellement ou testé.
export const runInactiveAccountCleanup = async () => {
  console.log('[CLEANUP] Démarrage du nettoyage des comptes inactifs…');
  try {
    const warned = await warnInactiveAccounts();
    const deleted = await deleteInactiveAccounts();
    console.log(`[CLEANUP] Terminé : ${warned} avertissement(s), ${deleted} suppression(s).`);
    return { warned, deleted };
  } catch (error) {
    console.error('[CLEANUP] Erreur pendant le nettoyage des comptes inactifs:', error);
    return { warned: 0, deleted: 0, error: error.message };
  }
};
