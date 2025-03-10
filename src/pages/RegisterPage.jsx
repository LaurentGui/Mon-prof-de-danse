import React, { useState } from 'react';
    import { useNavigate } from 'react-router-dom';
    import { supabase } from '../App';

    function RegisterPage() {
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [firstName, setFirstName] = useState('');
      const [lastName, setLastName] = useState('');
      const [error, setError] = useState(null);
      const [success, setSuccess] = useState(false);
      const navigate = useNavigate();

      const handleRegister = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        try {
          const { data, error: authError } = await supabase.auth.signUp({
            email,
            password,
          });

          if (authError) {
            setError(authError.message);
            return;
          }

          if (data && data.user) {
            const { error: insertError } = await supabase
              .from('profiles')
              .insert({
                id: data.user.id,
                first_name: firstName,
                last_name: lastName,
                email: email,
                status: 'A approuver',
                role: 'Utilisateur',
              });

            if (insertError) {
              setError(insertError.message);
              // Supprimer l'utilisateur de l'authentification si l'insertion dans profiles échoue
              await supabase.auth.signOut();
              return;
            }

            setSuccess(true);
            // Rediriger vers la page de connexion après l'inscription réussie
            setTimeout(() => {
              navigate('/login');
            }, 2000); // Redirection après 2 secondes
          }
        } catch (error) {
          setError('Une erreur est survenue lors de l\'inscription.');
        }
      };

      return (
        <div className="form-container">
          <h2>Inscription</h2>
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">Inscription réussie ! Redirection vers la page de connexion...</p>}
          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label htmlFor="firstName">Prénom</label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Nom</label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
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
              <button type="submit">S'inscrire</button>
            </div>
            <div className="form-group">
              <p>
                Déjà un compte ? <a href="/login">Connectez-vous</a>
              </p>
            </div>
          </form>
        </div>
      );
    }

    export default RegisterPage;
