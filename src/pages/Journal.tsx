
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Calendar, Upload, Trash2, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

interface JournalEntry {
  action: 'upload' | 'delete' | 'view';
  section: string;
  page?: string;
  caption?: string;
  date: string;
  imageDate?: string;
  id: string;
}

const Journal: React.FC = () => {
  const [journal, setJournal] = useState<JournalEntry[]>([]);
  
  useEffect(() => {
    const savedJournal = localStorage.getItem('astro-journal');
    if (savedJournal) {
      setJournal(JSON.parse(savedJournal));
    }
  }, []);
  
  // Fonction pour formater la date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // Fonction pour déterminer l'URL de l'image
  const getImageUrl = (entry: JournalEntry) => {
    if (entry.section === 'Messier') {
      const parts = entry.id.split('-');
      if (parts.length >= 3) {
        const page = parts[1];
        const imageId = parts[2];
        
        if (entry.id.includes('extra')) {
          const extraId = parts[4];
          return `/messier/extra/${page}/${imageId}/${extraId}`;
        }
        
        return `/messier/detail/${page}/${imageId}`;
      }
    } else if (entry.section === 'NightCam') {
      const parts = entry.id.split('-');
      if (parts.length >= 3) {
        const pageId = parts[1];
        const imageId = parts[2];
        return `/nightcam/${pageId}/${imageId}`;
      }
    } else if (entry.section === 'Système Solaire') {
      const parts = entry.id.split('-');
      if (parts.length >= 2) {
        const imageId = parts[2];
        return `/solar-system/detail/${imageId}`;
      }
    } else if (entry.section === 'Autres Vues') {
      const parts = entry.id.split('-');
      if (parts.length >= 2) {
        const imageId = parts[2];
        return `/other-views/detail/${imageId}`;
      }
    }
    
    return '#';
  };
  
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10 animate-fade-in-up">
          <span className="text-sm px-2.5 py-1 rounded-full bg-cosmic-purple/30 text-white/90 mb-4 inline-block border border-cosmic-purple/30">
            Journal
          </span>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">
            Journal d'activité
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto">
            Consultez l'historique des dernières actions effectuées sur vos collections astronomiques.
          </p>
        </div>
        
        <div className="space-y-4">
          {journal.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-white/50">Aucune activité à afficher pour le moment</p>
            </div>
          ) : (
            journal.map((entry, index) => (
              <div key={index} className="glass-card rounded-lg p-4 animate-fade-in-up" style={{ animationDelay: `${0.05 * index}s` }}>
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    entry.action === 'upload' 
                      ? 'bg-green-500/20' 
                      : entry.action === 'delete'
                        ? 'bg-red-500/20'
                        : 'bg-blue-500/20'
                  }`}>
                    {entry.action === 'upload' && <Upload className="w-5 h-5 text-green-400" />}
                    {entry.action === 'delete' && <Trash2 className="w-5 h-5 text-red-400" />}
                    {entry.action === 'view' && <Eye className="w-5 h-5 text-blue-400" />}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                      <h3 className="text-lg font-medium text-white">
                        {entry.action === 'upload' && "Image ajoutée"}
                        {entry.action === 'delete' && "Image supprimée"}
                        {entry.action === 'view' && "Image consultée"}
                      </h3>
                      <div className="flex items-center text-white/60 text-sm">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>{formatDate(entry.date)}</span>
                      </div>
                    </div>
                    
                    <p className="text-white/80">
                      {entry.section}
                      {entry.page && ` - ${entry.page}`}
                      {entry.caption && ` - "${entry.caption}"`}
                      {entry.imageDate && ` (${entry.imageDate})`}
                    </p>
                    
                    {entry.action !== 'delete' && (
                      <div className="mt-2">
                        <Link 
                          to={getImageUrl(entry)}
                          className="text-cosmic-purple hover:text-cosmic-purple/80 text-sm inline-flex items-center gap-1"
                        >
                          <Eye className="w-4 h-4" />
                          <span>Voir l'image</span>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Journal;
