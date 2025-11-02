// QuotesList.js - Version améliorée avec commentaires et téléchargement d'image
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';
import CommentSection from './CommentSection';
import html2canvas from 'html2canvas';

const QuotesList = ({ currentUser }) => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedQuote, setExpandedQuote] = useState(null);
  const [generatingImage, setGeneratingImage] = useState(null);

  useEffect(() => {
    fetchQuotes();
    const subscription = supabase
      .channel('quotes_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'quotes' }, 
        () => fetchQuotes()
      )
      .subscribe();

    return () => subscription.unsubscribe();
  }, []);

  const fetchQuotes = async () => {
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuotes(data || []);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (quote) => {
    const userIdentifier = currentUser.email;
    const isLiked = quote.liked_by?.includes(userIdentifier);

    try {
      const newLikedBy = isLiked 
        ? quote.liked_by.filter(id => id !== userIdentifier)
        : [...(quote.liked_by || []), userIdentifier];

      const { error } = await supabase
        .from('quotes')
        .update({
          likes: isLiked ? quote.likes - 1 : quote.likes + 1,
          liked_by: newLikedBy
        })
        .eq('id', quote.id);

      if (error) throw error;
      fetchQuotes();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const toggleComments = (quoteId) => {
    setExpandedQuote(expandedQuote === quoteId ? null : quoteId);
  };

  const downloadQuoteAsImage = async (quote) => {
    setGeneratingImage(quote.id);
    
    try {
      // Créer un élément temporaire pour la capture
      const tempDiv = document.createElement('div');
      tempDiv.style.cssText = `
        position: fixed;
        left: -9999px;
        top: -9999px;
        width: 800px;
        height: 600px;
        padding: 60px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        font-family: 'Georgia', 'Times New Roman', serif;
        border-radius: 30px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        z-index: 10000;
      `;

      // Contenu de la citation
      tempDiv.innerHTML = `
        <div style="font-size: 16px; opacity: 0.8; letter-spacing: 4px; margin-bottom: 20px; text-transform: uppercase;">
          Citation Inspirante
        </div>
        <div style="font-size: 32px; line-height: 1.5; font-style: italic; margin-bottom: 40px; padding: 0 40px; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          "${quote.content}"
        </div>
        <div style="border-top: 1px solid rgba(255,255,255,0.3); padding-top: 30px; width: 100%;">
          <div style="font-size: 24px; font-weight: bold; margin-bottom: 8px;">
            ${quote.author}
          </div>
          <div style="font-size: 16px; opacity: 0.8;">
            ${quote.user_username}
          </div>
          <div style="font-size: 14px; opacity: 0.6; margin-top: 10px;">
            ${new Date(quote.created_at).toLocaleDateString('fr-FR', { 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric' 
            })}
          </div>
        </div>
        <div style="position: absolute; bottom: 30px; font-size: 12px; opacity: 0.5;">
          Inspirations • Communauté de citations
        </div>
      `;

      document.body.appendChild(tempDiv);

      // Capturer l'image
      const canvas = await html2canvas(tempDiv, {
        scale: 3, // Haute résolution
        useCORS: true,
        backgroundColor: null,
        logging: false,
        width: 800,
        height: 600,
      });

      // Télécharger l'image
      const link = document.createElement('a');
      const fileName = `citation-${quote.author.replace(/\s+/g, '-')}-${Date.now()}.png`;
      link.download = fileName;
      link.href = canvas.toDataURL('image/png', 1.0);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Nettoyer
      document.body.removeChild(tempDiv);

      // Mettre à jour le compteur de partages
      const { error } = await supabase
        .from('quotes')
        .update({
          shares: (quote.shares || 0) + 1
        })
        .eq('id', quote.id);

      if (error) throw error;
      
      // Recharger les quotes pour avoir le compteur à jour
      fetchQuotes();

    } catch (error) {
      console.error('Erreur lors de la génération de l\'image:', error);
      alert('Erreur lors du téléchargement de l\'image');
    } finally {
      setGeneratingImage(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          📖 Citations de la communauté
        </h2>
        <p className="text-gray-600 text-lg">
          Découvrez les plus belles pensées partagées par notre communauté
        </p>
      </div>
      
      <div className="space-y-6">
        {quotes.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl shadow-sm">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucune citation pour le moment
            </h3>
            <p className="text-gray-600 mb-6">
              Soyez le premier à inspirer notre communauté !
            </p>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
              Créer la première citation
            </button>
          </div>
        ) : (
          quotes.map((quote) => (
            <div 
              key={quote.id} 
              className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-100 overflow-hidden"
            >
              {/* Quote Card */}
              <div className="p-6">
                {/* Author Header */}
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">
                      {quote.author.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-lg">{quote.author}</h3>
                    <p className="text-gray-500 text-sm">
                      {new Date(quote.created_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                {/* Quote Content */}
                <blockquote className="text-gray-800 text-xl italic border-l-4 border-indigo-500 pl-6 py-2 mb-6 leading-relaxed">
                  "{quote.content}"
                </blockquote>

                {/* Actions Footer */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0 pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-6 text-gray-600">
                    <button
                      onClick={() => handleLike(quote)}
                      className={`flex items-center space-x-2 transition-all duration-300 ${
                        quote.liked_by?.includes(currentUser.email) 
                          ? 'text-red-500 transform scale-110' 
                          : 'text-gray-500 hover:text-red-500 hover:scale-105'
                      }`}
                    >
                      <span className="text-xl">❤️</span>
                      <span className="font-semibold">{quote.likes || 0}</span>
                    </button>
                    
                    <button
                      onClick={() => toggleComments(quote.id)}
                      className="flex items-center space-x-2 text-gray-500 hover:text-indigo-600 transition-colors"
                    >
                      <span className="text-xl">💬</span>
                      <span className="font-semibold">Commenter</span>
                    </button>

                    <button
                      onClick={() => downloadQuoteAsImage(quote)}
                      disabled={generatingImage === quote.id}
                      className="flex items-center space-x-2 text-gray-500 hover:text-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Télécharger en image"
                    >
                      <span className={`text-xl ${generatingImage === quote.id ? 'animate-pulse' : ''}`}>
                        {generatingImage === quote.id ? '⏳' : '📥'}
                      </span>
                      <span className="font-semibold">
                        {generatingImage === quote.id ? 'Génération...' : (quote.shares || 0)}
                      </span>
                    </button>
                  </div>
                  
                  <div className="text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
                    Publié par <span className="text-indigo-600 font-semibold">{quote.user_username}</span>
                  </div>
                </div>
              </div>

              {/* Comment Section */}
              {expandedQuote === quote.id && (
                <div className="border-t border-gray-100 bg-gray-50/50 animate-fadeIn">
                  <CommentSection 
                    quoteId={quote.id} 
                    currentUser={currentUser}
                  />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default QuotesList;