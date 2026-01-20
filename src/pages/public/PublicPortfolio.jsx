import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { RefreshCw, Search, X } from "lucide-react";
import PortfolioTemplate from "../dashboard/PortfolioTemplate";
import "../../styles/PortfolioTemplate.css";

export default function PublicPortfolio() {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  // Fonction pour filtrer les données en fonction du terme de recherche
  const filterData = (data, term) => {
    if (!term.trim()) {
      return data; // Pas de filtre si recherche vide
    }

    const lowerTerm = term.toLowerCase();
    
    return {
      ...data,
      projects: (data.projects || []).filter(p =>
        p.title?.toLowerCase().includes(lowerTerm) ||
        p.description?.toLowerCase().includes(lowerTerm) ||
        (Array.isArray(p.technologies) 
          ? p.technologies.some(t => t?.toLowerCase().includes(lowerTerm))
          : p.technologies?.toLowerCase().includes(lowerTerm))
      ),
      skills: (data.skills || []).filter(s =>
        s?.toLowerCase().includes(lowerTerm)
      ),
      certifications: (data.certifications || []).filter(c =>
        c.title?.toLowerCase().includes(lowerTerm) ||
        c.organization?.toLowerCase().includes(lowerTerm) ||
        c.description?.toLowerCase().includes(lowerTerm)
      ),
      experiences: (data.experiences || []).filter(e =>
        e.title?.toLowerCase().includes(lowerTerm) ||
        e.company?.toLowerCase().includes(lowerTerm) ||
        e.description?.toLowerCase().includes(lowerTerm)
      ),
      education: (data.education || []).filter(e =>
        e.diploma?.toLowerCase().includes(lowerTerm) ||
        e.school?.toLowerCase().includes(lowerTerm) ||
        e.description?.toLowerCase().includes(lowerTerm)
      )
    };
  };

  useEffect(() => {
    const fetchUserPortfolio = async () => {
      setLoading(true);
      setError(null);
      try {
        // Ajouter un timestamp pour éviter le cache
        const response = await fetch(`/api/portfolio/user/${userId}?t=${Date.now()}`);
        if (!response.ok) {
          throw new Error("Portfolio introuvable");
        }
        const data = await response.json();
        
        // Transformer les données pour le template
        const transformedData = {
          profile: {
            name: `${data.profile?.firstName || ''} ${data.profile?.lastName || ''}`.trim(),
            title: data.profile?.title || '',
            bio: data.profile?.bio || '',
            avatar: data.media?.profile_image || data.media?.profileImage || "👤"
          },
          projects: (data.projects || []).map(p => ({
            id: p.id,
            title: p.title,
            description: p.description,
            technologies: typeof p.technologies === 'string' 
              ? p.technologies.split(',').map(t => t.trim()).filter(t => t.length > 0)
              : (p.technologies || []).filter(t => t && t.length > 0)
          })),
          skills: data.skills || [],
          experiences: (data.experiences || []).map(exp => ({
            title: exp.position,
            company: exp.company,
            startDate: exp.startDate,
            endDate: exp.endDate,
            description: exp.description
          })),
          education: (data.education || []).map(edu => ({
            id: edu.id,
            diploma: edu.diploma,
            school: edu.school,
            startDate: edu.startDate,
            endDate: edu.endDate,
            description: edu.description
          })),
          certifications: (data.certifications || []).map(cert => ({
            id: cert.id,
            title: cert.title,
            organization: cert.organization || cert.issuer,
            date: cert.date,
            description: cert.description
          })),
          media: {
            cvFile: data.media?.cvFile || data.media?.cv_file || '',
            cvFileName: data.media?.cvFileName || data.media?.cv_file_name || 'CV.pdf',
            links: [
              data.media?.linkedin && { platform: "LinkedIn", url: data.media.linkedin },
              data.media?.github && { platform: "GitHub", url: data.media.github },
              data.media?.twitter && { platform: "Twitter", url: data.media.twitter },
              ...(data.media?.websites || []).map(w => ({ platform: "Website", url: typeof w === 'string' ? w : w.url }))
            ].filter(Boolean)
          }
        };
        
        setUserData(transformedData);
      } catch (err) {
        console.error("Erreur lors du chargement du portfolio:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserPortfolio();
    }
  }, [userId, refreshKey]);

  // Appliquer le filtre quand searchTerm ou userData change
  useEffect(() => {
    if (userData) {
      const filtered = filterData(userData, searchTerm);
      setFilteredData(filtered);
    }
  }, [userData, searchTerm]);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Chargement du portfolio...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p style={{ color: 'red', marginBottom: '1rem' }}>Erreur : {error}</p>
        <button onClick={handleRefresh} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative' }}>
      {/* Barre de recherche */}
      <div style={{
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1001,
        width: 'calc(100% - 40px)',
        maxWidth: '500px'
      }}>
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          alignItems: 'center'
        }}>
          <div style={{
            flex: 1,
            position: 'relative',
            display: 'flex',
            alignItems: 'center'
          }}>
            <Search size={18} style={{
              position: 'absolute',
              left: '12px',
              color: '#999',
              pointerEvents: 'none'
            }} />
            <input
              type="text"
              placeholder="Rechercher (nom, titre, technologie...)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.6rem 0.6rem 0.6rem 2.6rem',
                border: '2px solid #ddd',
                borderRadius: '8px',
                fontSize: '0.95rem',
                backgroundColor: '#ffffff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                transition: 'border-color 0.2s',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#6366f1'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
            />
            {searchTerm && (
              <button
                onClick={handleClearSearch}
                style={{
                  position: 'absolute',
                  right: '10px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#999',
                  padding: '0.2rem'
                }}
                title="Effacer la recherche"
              >
                <X size={18} />
              </button>
            )}
          </div>
          <button
            onClick={handleRefresh}
            disabled={loading}
            style={{
              padding: '0.6rem 1rem',
              backgroundColor: '#6366f1',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.9rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              opacity: loading ? 0.6 : 1,
              transition: 'all 0.2s',
              whiteSpace: 'nowrap'
            }}
            title="Rafraîchir les données"
          >
            <RefreshCw size={16} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
            {loading ? '...' : 'Rafr.'}
          </button>
        </div>
      </div>

      {/* Contenu principal avec padding pour la barre fixe */}
      <div style={{ paddingTop: '80px' }}>
        <PortfolioTemplate userData={filteredData} />
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
