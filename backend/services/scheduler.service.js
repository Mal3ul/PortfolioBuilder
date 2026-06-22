import cron from "node-cron";
import { runInactiveAccountCleanup } from "./accountCleanup.service.js";

// Planification des tâches récurrentes. Démarrée depuis server.js (pas depuis
// app.js) pour ne pas lancer de cron pendant les tests (supertest importe app.js).

// Tous les jours à 03h00 (heure du serveur). Surchargeable via CLEANUP_CRON.
const CLEANUP_SCHEDULE = process.env.CLEANUP_CRON || '0 3 * * *';

export const startScheduledJobs = () => {
  // Permet de désactiver complètement le planificateur (ex. CI, environnement
  // sans base) via SCHEDULER_ENABLED=false.
  if ((process.env.SCHEDULER_ENABLED || 'true').toLowerCase() === 'false') {
    console.log('[SCHEDULER] Désactivé (SCHEDULER_ENABLED=false).');
    return;
  }

  if (!cron.validate(CLEANUP_SCHEDULE)) {
    console.error('[SCHEDULER] Expression cron invalide:', CLEANUP_SCHEDULE);
    return;
  }

  cron.schedule(CLEANUP_SCHEDULE, () => {
    runInactiveAccountCleanup();
  });

  console.log(`[SCHEDULER] Nettoyage des comptes inactifs planifié (${CLEANUP_SCHEDULE}).`);
};
