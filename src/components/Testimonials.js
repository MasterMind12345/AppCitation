// Testimonials.js - Version corrigée
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [newTestimonial, setNewTestimonial] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasTestimonialsTable, setHasTestimonialsTable] = useState(true);

  // Témoignages par défaut si la table n'existe pas
  const defaultTestimonials = [
    {
      id: 1,
      user_name: "Marie L.",
      role: "Écrivaine",
      content: "Cette plateforme m'a permis de découvrir des perles rares et de partager mes propres inspirations.",
      avatar: "👩‍💼"
    },
    {
      id: 2,
      user_name: "Pierre D.",
      role: "Enseignant",
      content: "J'utilise les citations de cette communauté pour motiver mes élèves chaque matin. Merci !",
      avatar: "👨‍🏫"
    },
    {
      id: 3,
      user_name: "Sophie T.",
      role: "Étudiante",
      content: "Quelle belle initiative ! Les citations m'aident à rester motivée dans mes études.",
      avatar: "👩‍🎓"
    },
    {
      id: 4,
      user_name: "Antoine M.",
      role: "Designer",
      content: "L'interface est magnifique et l'expérience utilisateur exceptionnelle. Bravo !",
      avatar: "👨‍🎨"
    },
    {
      id: 5,
      user_name: "Élodie R.",
      role: "Manager",
      content: "Je partage des citations inspirantes avec mon équipe chaque lundi. Très motivant !",
      avatar: "👩‍💼"
    },
    {
      id: 6,
      user_name: "Thomas B.",
      role: "Développeur",
      content: "Une communauté bienveillante et des citations de qualité. Je recommande !",
      avatar: "👨‍💻"
    }
  ];

  useEffect(() => {
    checkTestimonialsTable();
  }, []);

  const checkTestimonialsTable = async () => {
    try {
      // Vérifier si la table testimonials existe
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .limit(1);

      if (error && error.code === '42P01') {
        // Table doesn't exist
        setHasTestimonialsTable(false);
        setTestimonials(defaultTestimonials);
      } else if (data) {
        // Table exists, fetch testimonials
        setHasTestimonialsTable(true);
        fetchTestimonials();
      }
    } catch (error) {
      console.error('Erreur vérification table:', error);
      setHasTestimonialsTable(false);
      setTestimonials(defaultTestimonials);
    }
  };

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      setTestimonials(data || []);
    } catch (error) {
      console.error('Erreur:', error);
      // En cas d'erreur, utiliser les témoignages par défaut
      setTestimonials(defaultTestimonials);
    }
  };

  const handleSubmitTestimonial = async (e) => {
    e.preventDefault();
    if (!newTestimonial.trim()) return;

    setLoading(true);
    try {
      if (hasTestimonialsTable) {
        const { error } = await supabase
          .from('testimonials')
          .insert([
            {
              content: newTestimonial.trim(),
              user_name: "Membre de la communauté",
              role: "Utilisateur",
              avatar: "👤"
            }
          ]);

        if (error) throw error;
        fetchTestimonials();
      } else {
        // Si la table n'existe pas, ajouter localement
        const newTestimonialObj = {
          id: testimonials.length + 1,
          user_name: "Membre de la communauté",
          role: "Utilisateur",
          content: newTestimonial.trim(),
          avatar: "👤",
          created_at: new Date().toISOString()
        };
        setTestimonials(prev => [newTestimonialObj, ...prev]);
      }

      setNewTestimonial('');
      setShowForm(false);
      alert('Merci pour votre témoignage !' + (!hasTestimonialsTable ? ' (Stocké localement)' : ''));
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'envoi du témoignage: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 bg-gradient-to-br from-white to-gray-50 rounded-3xl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ils parlent de nous <span className="text-indigo-600">💫</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Découvrez ce que notre communauté pense de QuoteMaster
          </p>
          {!hasTestimonialsTable && (
            <p className="text-sm text-amber-600 mt-2">
              💡 Les témoignages sont actuellement affichés en démonstration
            </p>
          )}
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {testimonials.map((testimonial, index) => (
            <div 
              key={testimonial.id} 
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 animate-fadeIn"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center text-2xl">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.user_name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">"{testimonial.content}"</p>
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className="text-yellow-400">⭐</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Testimonial */}
        <div className="text-center">
          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <span className="flex items-center justify-center space-x-2">
                <span>✨</span>
                <span>Donner mon avis</span>
              </span>
            </button>
          ) : (
            <form onSubmit={handleSubmitTestimonial} className="max-w-2xl mx-auto bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="text-left mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Votre témoignage *
                </label>
                <textarea
                  value={newTestimonial}
                  onChange={(e) => setNewTestimonial(e.target.value)}
                  placeholder="Partagez votre expérience avec QuoteMaster... Que pensez-vous de notre plateforme ?"
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none transition-colors"
                  required
                />
              </div>
              <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span>Publication...</span>
                    </>
                  ) : (
                    <>
                      <span>📝</span>
                      <span>Publier mon témoignage</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
              </div>
              {!hasTestimonialsTable && (
                <p className="text-xs text-amber-600 mt-3 text-center">
                  💡 Le témoignage sera stocké localement (créer la table "testimonials" dans Supabase pour le stockage permanent)
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;