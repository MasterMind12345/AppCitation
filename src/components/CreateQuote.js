// CreateQuote.js - Nouveau composant
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

const CreateQuote = ({ user, userProfile, onSuccess }) => {
  const [formData, setFormData] = useState({
    author: '',
    content: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.author.trim() || !formData.content.trim()) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('quotes')
        .insert([
          {
            author: formData.author.trim(),
            content: formData.content.trim(),
            user_id: user.id,
            user_username: userProfile?.username || user.email,
            likes: 0,
            shares: 0,
            liked_by: []
          }
        ]);

      if (error) throw error;

      setFormData({ author: '', content: '' });
      alert('Citation publiée avec succès !');
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la publication: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Créer une citation inspirante
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
              Auteur de la citation *
            </label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              placeholder="Ex: Victor Hugo, Albert Einstein..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              required
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Contenu de la citation *
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Écrivez votre citation inspirante ici..."
              rows="6"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"
              required
            />
          </div>

          <div className="flex justify-between items-center pt-4">
            <button
              type="button"
              onClick={() => setFormData({ author: '', content: '' })}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Effacer
            </button>
            
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors font-semibold"
            >
              {loading ? 'Publication...' : 'Publier la citation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateQuote;