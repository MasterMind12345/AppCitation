// ShareQuoteButtonEnhanced.js
import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';

const ShareQuoteButtonEnhanced = ({ quote }) => {
  const quoteRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const designs = [
    {
      name: 'Classique',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      textColor: 'white'
    },
    {
      name: 'Moderne',
      background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
      textColor: 'white'
    },
    {
      name: 'Élégant',
      background: '#1a202c',
      textColor: '#e2e8f0'
    },
    {
      name: 'Nature',
      background: 'linear-gradient(135deg, #48bb78, #38a169)',
      textColor: 'white'
    }
  ];

  const downloadQuoteAsImage = async (design) => {
    setIsGenerating(true);
    
    // Mettre à jour le style selon le design choisi
    const element = quoteRef.current;
    if (element) {
      element.style.background = design.background;
      element.style.color = design.textColor;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 100)); // Petite pause pour le rendu

      const canvas = await html2canvas(quoteRef.current, {
        scale: 4, // Très haute résolution
        useCORS: true,
        backgroundColor: null,
        logging: false,
        width: 800,
        height: 600,
      });

      const link = document.createElement('a');
      link.download = `citation-${quote.author.replace(/\s+/g, '-')}-${design.name.toLowerCase()}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
      
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la génération de l\'image');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      {/* Citation cachée pour la capture */}
      <div 
        ref={quoteRef}
        style={{
          position: 'absolute',
          left: '-9999px',
          top: '-9999px',
          width: '800px',
          height: '600px',
          padding: '60px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          fontFamily: "'Playfair Display', Georgia, serif",
          borderRadius: '30px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center'
        }}
      >
        <div style={{ fontSize: '16px', opacity: 0.8, letterSpacing: '4px', marginBottom: '20px' }}>
          CITATION INSPIRANTE
        </div>

        <div style={{
          fontSize: '32px',
          lineHeight: '1.5',
          fontStyle: 'italic',
          marginBottom: '40px',
          padding: '0 40px',
          textShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          "{quote.content}"
        </div>

        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.3)',
          paddingTop: '30px',
          width: '100%'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>
            {quote.author}
          </div>
          <div style={{ fontSize: '16px', opacity: 0.8 }}>
            {quote.user_username}
          </div>
          <div style={{ fontSize: '14px', opacity: 0.6, marginTop: '10px' }}>
            {new Date(quote.created_at).toLocaleDateString('fr-FR', { 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric' 
            })}
          </div>
        </div>

        <div style={{
          position: 'absolute',
          bottom: '30px',
          fontSize: '12px',
          opacity: 0.5
        }}>
          Inspirations • Communauté de citations
        </div>
      </div>

      {/* Menu déroulant pour choisir le design */}
      <div className="relative group">
        <button
          disabled={isGenerating}
          className="flex items-center space-x-2 text-gray-500 hover:text-green-600 transition-colors disabled:opacity-50"
          title="Télécharger en image"
        >
          <span className="text-xl">📥</span>
          <span className="font-semibold">
            {isGenerating ? 'Génération...' : 'Télécharger'}
          </span>
        </button>
        
        <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-white rounded-lg shadow-xl border border-gray-200 p-2 min-w-[150px] z-10">
          {designs.map((design, index) => (
            <button
              key={index}
              onClick={() => downloadQuoteAsImage(design)}
              className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md transition-colors text-sm"
            >
              {design.name}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default ShareQuoteButtonEnhanced;