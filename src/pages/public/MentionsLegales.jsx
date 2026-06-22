import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import "../../styles/LegalPage.css";

export default function MentionsLegales() {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <Link to="/" className="legal-back">
          <ArrowLeft size={16} aria-hidden="true" /> Retour à l'accueil
        </Link>

        <h1 className="legal-title">Mentions légales</h1>
        <p className="legal-updated">Dernière mise à jour : 22/06/2026</p>

        <p>
          Conformément à l'article 6 de la loi n° 2004-575 du 21 juin 2004 pour la confiance
          dans l'économie numérique (LCEN), les présentes mentions légales sont portées à la
          connaissance des utilisateurs du site <strong>PortfolioBuilder</strong>, accessible à
          l'adresse <strong>https://portfoliobuilder.nessia.eu</strong>.
        </p>

        <h2>1. Identité de l'éditeur</h2>
        <table className="legal-table">
          <tbody>
            <tr><th>Nom</th><td>Nessia Bouchouit</td></tr>
            <tr><th>Forme juridique</th><td>Projet étudiant — personne physique (activité non commerciale)</td></tr>
            <tr><th>SIRET / RCS / Capital / TVA</th><td>Non applicable (projet étudiant)</td></tr>
            <tr><th>Responsable de la publication</th><td>Nessia Bouchouit</td></tr>
          </tbody>
        </table>

        <h2>2. Coordonnées</h2>
        <table className="legal-table">
          <tbody>
            <tr><th>Adresse</th><td>Strasbourg 67000</td></tr>
            <tr><th>E-mail de contact</th><td>contact@nessia.eu</td></tr>
          </tbody>
        </table>

        <h2>3. Propriété intellectuelle</h2>
        <p>
          L'ensemble des éléments composant le site <strong>PortfolioBuilder</strong> (structure,
          code source, interface, charte graphique, logo, textes, illustrations, et plus
          généralement tout contenu produit par l'éditeur) est protégé par le droit de la
          propriété intellectuelle et demeure la propriété exclusive de Nessia Bouchouit, sauf
          mention contraire.
        </p>
        <p>
          Toute reproduction, représentation, modification, publication, adaptation ou
          exploitation de tout ou partie de ces éléments, sans l'autorisation écrite préalable
          de l'éditeur, est interdite et constituerait une contrefaçon sanctionnée par les
          articles L.335-2 et suivants du Code de la propriété intellectuelle.
        </p>
        <p>
          <strong>Composants tiers (open source) :</strong> le site s'appuie sur des
          bibliothèques open source (React, Vite, Express, PostgreSQL, Lucide, etc.) qui restent
          soumises à leurs licences respectives.
        </p>
        <p>
          <strong>Contenus publiés par l'utilisateur :</strong> l'utilisateur reste seul
          propriétaire des contenus qu'il publie via le service. En les publiant, il garantit en
          détenir les droits et concède à l'éditeur une licence strictement limitée à
          l'hébergement et à l'affichage de son portfolio.
        </p>

        <h2>4. Hébergement</h2>
        <p>
          Le site est exploité sur un serveur privé virtuel (VPS) et distribué via le réseau
          Cloudflare (tunnel et certificat TLS).
        </p>
        <table className="legal-table">
          <tbody>
            <tr><th>Hébergeur (VPS)</th><td>IONOS SARL — 7 place de la Gare, BP 70109, 57201 Sarreguemines Cedex, France — 0970 808 911</td></tr>
            <tr><th>Distribution / réseau (CDN &amp; TLS)</th><td>Cloudflare, Inc. — 101 Townsend Street, San Francisco, CA 94107, États-Unis</td></tr>
            <tr><th>Localisation des serveurs</th><td>Union européenne</td></tr>
          </tbody>
        </table>

        <h2>5. Protection des données personnelles</h2>
        <p>
          Le traitement des données personnelles des utilisateurs est décrit dans la{" "}
          <Link to="/confidentialite">Politique de confidentialité et de protection des données</Link>.
        </p>

        <h2>6. Contact</h2>
        <p>
          Pour toute question relative aux présentes mentions légales, vous pouvez contacter
          l'éditeur à l'adresse <strong>contact@nessia.eu</strong>.
        </p>
      </div>
    </div>
  );
}
