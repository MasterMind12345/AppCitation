// Dashboard.js - Version améliorée avec animations et responsive
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import CreateQuote from './CreateQuote';
import QuotesList from './QuotesList';
import Testimonials from './Testimonials';
import Stats from './Stats';

const Dashboard = ({ session }) => {
  const [activeTab, setActiveTab] = useState('home');
  const [userProfile, setUserProfile] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, [session]);

  const fetchUserProfile = async () => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', session.user.user_metadata?.username || session.user.email)
      .single();
    
    if (data) setUserProfile(data);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100">
      {/* Header amélioré avec menu mobile */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  QuoteMaster
                </h1>
              </div>
              
              {/* Navigation Desktop */}
              <nav className="hidden md:ml-8 md:flex md:space-x-4">
                <button
                  onClick={() => setActiveTab('home')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    activeTab === 'home' 
                    ? 'bg-indigo-100 text-indigo-700 shadow-sm transform scale-105' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  🏠 Accueil
                </button>
                <button
                  onClick={() => setActiveTab('create')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    activeTab === 'create' 
                    ? 'bg-indigo-100 text-indigo-700 shadow-sm transform scale-105' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  ✨ Créer
                </button>
                <button
                  onClick={() => setActiveTab('quotes')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    activeTab === 'quotes' 
                    ? 'bg-indigo-100 text-indigo-700 shadow-sm transform scale-105' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  📚 Citations
                </button>
              </nav>
            </div>
            
            {/* User Info & Mobile Menu Button */}
            <div className="flex items-center space-x-4">
              {/* User Info Desktop */}
              <div className="hidden md:flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {userProfile?.username || session.user.email}
                  </p>
                  <p className="text-xs text-gray-500">En ligne</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-semibold text-sm">
                    {userProfile?.username?.charAt(0).toUpperCase() || session.user.email.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {/* Logout Button Desktop */}
              <button
                onClick={handleLogout}
                className="hidden md:flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <span>🚪</span>
                <span>Déconnexion</span>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200 animate-fadeIn">
              <div className="flex flex-col space-y-3">
                <button
                  onClick={() => { setActiveTab('home'); setIsMobileMenuOpen(false); }}
                  className={`px-4 py-3 rounded-lg text-left font-medium transition-all ${
                    activeTab === 'home' 
                    ? 'bg-indigo-100 text-indigo-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  🏠 Accueil
                </button>
                <button
                  onClick={() => { setActiveTab('create'); setIsMobileMenuOpen(false); }}
                  className={`px-4 py-3 rounded-lg text-left font-medium transition-all ${
                    activeTab === 'create' 
                    ? 'bg-indigo-100 text-indigo-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  ✨ Créer une citation
                </button>
                <button
                  onClick={() => { setActiveTab('quotes'); setIsMobileMenuOpen(false); }}
                  className={`px-4 py-3 rounded-lg text-left font-medium transition-all ${
                    activeTab === 'quotes' 
                    ? 'bg-indigo-100 text-indigo-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  📚 Toutes les citations
                </button>
                
                {/* User Info Mobile */}
                <div className="px-4 py-3 border-t border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-xs">
                        {userProfile?.username?.charAt(0).toUpperCase() || session.user.email.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {userProfile?.username || session.user.email}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg font-medium transition-colors"
                >
                  <span>🚪</span>
                  <span>Se déconnecter</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {activeTab === 'home' && (
          <div className="space-y-16">
            {/* Hero Section améliorée */}
            <section className="text-center py-12 lg:py-20">
              <div className="animate-fadeInUp">
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  Bienvenue sur <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">QuoteMaster</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
                  🌟 Découvrez un univers d'inspiration où chaque mot compte. 
                  Partagez vos plus belles pensées, connectez-vous avec des esprits créatifs 
                  et laissez-vous emporter par la magie des mots.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <button
                    onClick={() => setActiveTab('create')}
                    className="group bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <span className="flex items-center justify-center space-x-2">
                      <span>✨</span>
                      <span>Créer ma première citation</span>
                    </span>
                  </button>
                  <button
                    onClick={() => setActiveTab('quotes')}
                    className="group border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                  >
                    <span className="flex items-center justify-center space-x-2">
                      <span>🔍</span>
                      <span>Explorer les citations</span>
                    </span>
                  </button>
                </div>
              </div>
            </section>

            {/* Stats Section */}
            <Stats />

            {/* Features Section améliorée */}
            <section className="py-12">
              <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
                Pourquoi choisir <span className="text-indigo-600">QuoteMaster</span> ?
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  {
                    icon: '🎨',
                    title: 'Créativité Illimitée',
                    description: 'Exprimez vos pensées les plus profondes dans un espace dédié à la créativité'
                  },
                  {
                    icon: '🌍',
                    title: 'Communauté Globale',
                    description: 'Rejoignez une communauté internationale de passionnés de belles phrases'
                  },
                  {
                    icon: '🚀',
                    title: 'Inspiration Quotidienne',
                    description: 'Découvrez de nouvelles citations inspirantes chaque jour'
                  },
                  {
                    icon: '💫',
                    title: 'Interaction Sociale',
                    description: 'Likez, commentez et partagez vos citations préférées'
                  }
                ].map((feature, index) => (
                  <div 
                    key={index}
                    className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100"
                  >
                    <div className="text-4xl mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Testimonials Section */}
            <Testimonials />

            {/* CTA Section */}
            <section className="text-center py-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl text-white">
              <div className="max-w-2xl mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Prêt à inspirer le monde ?
                </h2>
                <p className="text-lg md:text-xl mb-8 opacity-90">
                  Rejoignez des milliers de personnes qui partagent déjà leur inspiration quotidienne.
                </p>
                <button
                  onClick={() => setActiveTab('create')}
                  className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl"
                >
                  Commencer maintenant 🚀
                </button>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'create' && (
          <CreateQuote 
            user={session.user} 
            userProfile={userProfile}
            onSuccess={() => setActiveTab('quotes')}
          />
        )}

        {activeTab === 'quotes' && (
          <QuotesList currentUser={session.user} />
        )}
      </main>

      {/* Footer amélioré */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-4">
                QuoteMaster
              </h3>
              <p className="text-gray-400 mb-4 max-w-md">
                La plateforme ultime pour découvrir, créer et partager des citations inspirantes. 
                Rejoignez notre communauté et laissez les mots transformer votre quotidien.
              </p>
              <div className="flex space-x-4">
                {['📘', '🐦', '📷', '💼'].map((icon, index) => (
                  <button key={index} className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
                    {icon}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Navigation</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => setActiveTab('home')} className="hover:text-white transition-colors">Accueil</button></li>
                <li><button onClick={() => setActiveTab('create')} className="hover:text-white transition-colors">Créer</button></li>
                <li><button onClick={() => setActiveTab('quotes')} className="hover:text-white transition-colors">Citations</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Légal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button className="hover:text-white transition-colors">Confidentialité</button></li>
                <li><button className="hover:text-white transition-colors">Conditions</button></li>
                <li><button className="hover:text-white transition-colors">Cookies</button></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              Créé avec passion par <span className="text-indigo-400 font-semibold">MasterMind</span> • 
              Partager l'inspiration, un mot à la fois ✨
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;