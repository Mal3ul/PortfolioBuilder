import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import "../../styles/LegalPage.css";

export default function Confidentialite() {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <Link to="/" className="legal-back">
          <ArrowLeft size={16} aria-hidden="true" /> Retour à l'accueil
        </Link>

        <h1 className="legal-title">Politique de confidentialité et de protection des données</h1>
        <p className="legal-updated">Dernière mise à jour : 22/06/2026</p>

        <p>
          La présente politique a pour objet d'informer les utilisateurs du site{" "}
          <strong>PortfolioBuilder</strong> (accessible à l'adresse{" "}
          <strong>https://portfoliobuilder.nessia.eu</strong>, ci-après « le Service ») sur la
          manière dont leurs données personnelles sont collectées, utilisées et protégées,
          conformément au Règlement Général sur la Protection des Données (RGPD - Règlement UE
          2016/679) et à la loi « Informatique et Libertés ».
        </p>
        <p>
          Les informations relatives à l'identité de l'éditeur, à ses coordonnées, à la
          propriété intellectuelle et à l'hébergement figurent dans les{" "}
          <Link to="/mentions-legales">Mentions légales</Link>.
        </p>

        <h2>1. Responsable du traitement</h2>
        <p>
          Le responsable du traitement est l'éditrice du Service, Nessia Bouchouit. Contact pour
          les questions liées aux données : <strong>contact@nessia.eu</strong>. Aucun délégué à
          la protection des données (DPO) n'est désigné, celui-ci n'étant pas requis pour ce
          projet.
        </p>

        <h2>2. Données personnelles collectées</h2>
        <p><strong>À la création de compte et à l'authentification :</strong></p>
        <ul>
          <li>Nom</li>
          <li>Adresse e-mail</li>
          <li>Mot de passe (stocké uniquement sous forme hachée via bcrypt — jamais en clair)</li>
          <li>Date de dernière connexion (gestion des comptes inactifs, voir §5)</li>
        </ul>
        <p><strong>Lors de la création du portfolio (données fournies volontairement) :</strong></p>
        <ul>
          <li>Prénom, nom, titre, biographie</li>
          <li>Adresse e-mail de contact, téléphone, localisation</li>
          <li>Expériences, formations, certifications, compétences, projets</li>
          <li>Liens vers réseaux sociaux et sites web (LinkedIn, GitHub, Twitter, etc.)</li>
        </ul>
        <p><strong>Données techniques :</strong></p>
        <ul>
          <li>Journal d'activité interne au compte</li>
          <li>Jeton d'authentification (JWT) stocké localement dans le navigateur (voir §7)</li>
        </ul>

        <h2>3. Finalités et bases légales</h2>
        <table className="legal-table">
          <thead>
            <tr><th>Finalité</th><td><strong>Base légale (RGPD)</strong></td></tr>
          </thead>
          <tbody>
            <tr><th>Création et gestion du compte</th><td>Exécution du contrat (art. 6.1.b)</td></tr>
            <tr><th>Hébergement et publication du portfolio</th><td>Exécution du contrat (art. 6.1.b)</td></tr>
            <tr><th>Authentification et sécurité</th><td>Intérêt légitime / Exécution du contrat</td></tr>
            <tr><th>Réinitialisation du mot de passe</th><td>Exécution du contrat</td></tr>
            <tr><th>Avertissement et suppression des comptes inactifs</th><td>Intérêt légitime / Minimisation (art. 5.1.e)</td></tr>
            <tr><th>Amélioration et bon fonctionnement</th><td>Intérêt légitime (art. 6.1.f)</td></tr>
          </tbody>
        </table>

        <h2>4. Destinataires et sous-traitants</h2>
        <p>
          Les données ne sont ni vendues, ni louées, ni cédées à des tiers à des fins
          commerciales. Elles peuvent être traitées par les sous-traitants techniques suivants :
        </p>
        <table className="legal-table">
          <thead>
            <tr><th>Prestataire</th><td><strong>Rôle</strong></td></tr>
          </thead>
          <tbody>
            <tr><th>IONOS SARL</th><td>Hébergement du serveur et de la base de données (UE)</td></tr>
            <tr><th>Cloudflare, Inc.</th><td>Réseau de distribution, tunnel et certificat TLS (États-Unis)</td></tr>
            <tr><th>Brevo (Sendinblue SAS)</th><td>Envoi des e-mails transactionnels (France)</td></tr>
          </tbody>
        </table>
        <p className="legal-note-box">
          <strong>Important :</strong> les portfolios publiés sont susceptibles d'être
          accessibles publiquement. Les informations que vous choisissez d'y faire figurer sont
          donc visibles par toute personne disposant du lien.
        </p>

        <h2>5. Durée de conservation</h2>
        <ul>
          <li>Données de compte et de portfolio : conservées tant que le compte est actif.</li>
          <li>
            Comptes inactifs : un e-mail d'avertissement est envoyé après 90 jours sans
            connexion ; sans reconnexion dans un délai de grâce de 7 jours, le compte et toutes
            les données associées sont supprimés définitivement (suppression en cascade).
          </li>
          <li>Jeton de réinitialisation de mot de passe : à durée de validité limitée, expiré automatiquement.</li>
          <li>Sauvegardes : conservées pour une durée limitée puis écrasées par rotation.</li>
        </ul>

        <h2>6. Sécurité</h2>
        <ul>
          <li>Hachage des mots de passe (bcrypt) ;</li>
          <li>Authentification par jeton (JWT) à durée de validité limitée ;</li>
          <li>Contrôle d'accès aux ressources selon le rôle de l'utilisateur ;</li>
          <li>Chiffrement des communications via HTTPS/TLS (certificat géré par Cloudflare) ;</li>
          <li>Base de données non exposée publiquement.</li>
        </ul>

        <h2>7. Cookies et stockage local</h2>
        <p>
          Le Service <strong>n'utilise pas de cookies publicitaires ni de cookies de suivi /
          traçage tiers.</strong> Il utilise uniquement le stockage local du navigateur
          (<code>localStorage</code>) pour conserver le jeton d'authentification (<code>token</code>)
          et les informations de session de l'utilisateur connecté (<code>user</code>). Ces
          éléments sont strictement nécessaires au fonctionnement, ne sont pas partagés avec des
          tiers et sont supprimés à la déconnexion.
        </p>
        <p>
          Le réseau Cloudflare peut déposer un cookie technique (ex. <code>__cf_bm</code>)
          strictement nécessaire à la sécurité et au bon acheminement du trafic ; il ne sert pas
          au suivi publicitaire.
        </p>

        <h2>8. Vos droits</h2>
        <p>Conformément au RGPD, vous disposez des droits suivants :</p>
        <ul>
          <li>Droit d'accès, de rectification et d'effacement (« droit à l'oubli ») ;</li>
          <li>Droit à la limitation et à la portabilité ;</li>
          <li>Droit d'opposition et de retrait du consentement, le cas échéant.</li>
        </ul>
        <p>
          Vous pouvez exercer une partie de ces droits directement depuis votre espace personnel
          (modification ou suppression de votre compte). Pour toute autre demande, contactez-nous
          à <strong>contact@nessia.eu</strong>. Vous pouvez également introduire une réclamation
          auprès de la <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">CNIL</a>.
        </p>

        <h2>9. Modification de la politique</h2>
        <p>
          L'éditeur se réserve le droit de modifier la présente politique à tout moment. La
          version applicable est celle en vigueur à la date de consultation.
        </p>
      </div>
    </div>
  );
}
