import React, { useState } from 'react';
    import { useNavigate } from 'react-router-dom';
    import { supabase } from '../App';
    import './LoginPage.css';

    function LoginPage() {
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [error, setError] = useState(null);
      const navigate = useNavigate();

      const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);

        try {
          const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) {
            setError(error.message);
          } else {
            navigate('/profile');
          }
        } catch (error) {
          setError('Une erreur est survenue lors de la connexion.');
        }
      };

      return (
        <div className="form-container">
          <h2>Connexion</h2>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Mot de passe</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <button type="submit">Se connecter</button>
            </div>
            <div className="form-group">
              <p>
                Pas de compte ? <a href="/register">Inscrivez-vous</a>
              </p>
            </div>
          </form>
        </div>
      );
    }

    export default LoginPage;
