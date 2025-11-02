// Stats.js - Nouveau composant pour les statistiques
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const Stats = () => {
  const [stats, setStats] = useState({
    totalQuotes: 0,
    totalUsers: 0,
    totalLikes: 0,
    todayQuotes: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Total quotes
      const { count: totalQuotes } = await supabase
        .from('quotes')
        .select('*', { count: 'exact', head: true });

      // Total users
      const { count: totalUsers } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      // Today's quotes
      const today = new Date().toISOString().split('T')[0];
      const { count: todayQuotes } = await supabase
        .from('quotes')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today);

      // Total likes (approximatif)
      const { data: quotes } = await supabase
        .from('quotes')
        .select('likes');
      
      const totalLikes = quotes?.reduce((sum, quote) => sum + (quote.likes || 0), 0) || 0;

      setStats({
        totalQuotes: totalQuotes || 0,
        totalUsers: totalUsers || 0,
        totalLikes,
        todayQuotes: todayQuotes || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const statCards = [
    { label: 'Citations Total', value: stats.totalQuotes, icon: '📚', color: 'from-blue-500 to-cyan-500' },
    { label: 'Membres', value: stats.totalUsers, icon: '👥', color: 'from-green-500 to-emerald-500' },
    { label: 'Likes Total', value: stats.totalLikes, icon: '❤️', color: 'from-red-500 to-pink-500' },
    { label: "Aujourd'hui", value: stats.todayQuotes, icon: '🆕', color: 'from-purple-500 to-indigo-500' }
  ];

  return (
    <section className="py-12">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div 
            key={index}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center text-white text-xl`}>
                {stat.icon}
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
            <p className="text-gray-600 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Stats;