import React from 'react';
    import { Routes, Route, Navigate } from 'react-router-dom';
    import { useState, useEffect } from 'react';
    import { createClient } from '@supabase/supabase-js';
    import './App.css';

    // Import des composants de pages
    import LoginPage from './pages/LoginPage';
    import RegisterPage from './pages/RegisterPage';
    import ProfilePage from './pages/ProfilePage';
    import AdminPage from './pages/AdminPage';
    import HomePage from './pages/HomePage';

    // Configuration Supabase
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    export const supabase = createClient(supabaseUrl, supabaseAnonKey);

    function App() {
      const [session, setSession] = useState(null);
      const [loading, setLoading] = useState(true);

      useEffect(() => {
        const fetchSession = async () => {
          const { data: { session } } = await supabase.auth.getSession();
          setSession(session);
          setLoading(false);
        };
        fetchSession();

        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
          setSession(session);
        });

        return () => {
          authListener?.unsubscribe();
        };
      }, []);

      if (loading) {
        return <div>Chargement...</div>;
      }

      return (
        <div className="app-container">
          <Routes>
            <Route path="/" element={<HomePage session={session} />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile" element={session ? <ProfilePage session={session} /> : <Navigate to="/login" />} />
            <Route path="/admin" element={session && session.user.email === 'admin@example.com' ? <AdminPage /> : <Navigate to="/" />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      );
    }

    export default App;
