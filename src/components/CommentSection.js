// CommentSection.js - Version corrigée
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const CommentSection = ({ quoteId, currentUser }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasCommentsTable, setHasCommentsTable] = useState(true);

  useEffect(() => {
    checkCommentsTable();
  }, [quoteId]);

  const checkCommentsTable = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('quote_id', quoteId)
        .limit(1);

      if (error && error.code === '42P01') {
        setHasCommentsTable(false);
      } else if (data !== null) {
        setHasCommentsTable(true);
        fetchComments();
      }
    } catch (error) {
      console.error('Erreur vérification table comments:', error);
      setHasCommentsTable(false);
    }
  };

  const fetchComments = async () => {
    if (!hasCommentsTable) return;
    
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('quote_id', quoteId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      if (hasCommentsTable) {
        const { error } = await supabase
          .from('comments')
          .insert([
            {
              quote_id: quoteId,
              user_id: currentUser.id,
              user_username: currentUser.user_metadata?.username || currentUser.email,
              content: newComment.trim()
            }
          ]);

        if (error) throw error;
      }
      
      // Ajouter le commentaire localement dans tous les cas
      const newCommentObj = {
        id: Date.now(), // ID temporaire
        quote_id: quoteId,
        user_id: currentUser.id,
        user_username: currentUser.user_metadata?.username || currentUser.email,
        content: newComment.trim(),
        created_at: new Date().toISOString()
      };
      
      setComments(prev => [...prev, newCommentObj]);
      setNewComment('');
      
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'envoi du commentaire: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      {/* Formulaire de commentaire */}
      <form onSubmit={handleSubmitComment} className="mb-6">
        <div className="flex space-x-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              {currentUser.email.charAt(0).toUpperCase()}
            </div>
          </div>
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Ajouter un commentaire..."
              rows="3"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none transition-colors"
            />
            <div className="flex justify-between items-center mt-2">
              {!hasCommentsTable && (
                <p className="text-xs text-amber-600">
                  💡 Les commentaires sont stockés localement
                </p>
              )}
              <button
                type="submit"
                disabled={loading || !newComment.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                {loading ? 'Envoi...' : 'Commenter'}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Liste des commentaires */}
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
          <span>💬</span>
          <span>Commentaires ({comments.length})</span>
        </h4>
        
        {comments.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">💭</div>
            <p className="text-gray-500">
              Aucun commentaire pour le moment. Soyez le premier à réagir !
            </p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex space-x-4 animate-fadeIn">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                  {comment.user_username.charAt(0).toUpperCase()}
                </div>
              </div>
              <div className="flex-1 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-semibold text-gray-900 text-sm">
                    {comment.user_username}
                  </span>
                  <span className="text-gray-400 text-xs">•</span>
                  <span className="text-gray-500 text-xs">
                    {new Date(comment.created_at).toLocaleDateString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {comment.content}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;