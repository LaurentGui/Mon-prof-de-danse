import React, { useState, useEffect } from 'react';
    import { useNavigate } from 'react-router-dom';
    import { supabase } from '../App';

    function ProfilePage({ session }) {
      const [profile, setProfile] = useState(null);
      const [firstName, setFirstName] = useState('');
      const [lastName, setLastName] = useState('');
      const [email, setEmail] = useState('');
      const [successMessage, setSuccessMessage] = useState('');
      const [errorMessage, setErrorMessage] = useState('');
      const navigate = useNavigate();

      useEffect(() => {
        const fetchProfile = async () => {
          if (session && session.user) {
            const { data, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (error) {
              setErrorMessage(error.message);
            } else if (data) {
              setProfile(data);
              setFirstName(data.first_name);
              setLastName(data.last_name);
              setEmail(data.email);
            }
          }
        };

        fetchProfile();
      }, [session]);

      const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
        setErrorMessage('');

        try {
          const { error } = await supabase
            .from('profiles')
            .update({
              first_name: firstName,
              last_name: lastName,
              email: email,
            })
            .eq('id', session.user.id);

          if (error) {
            setErrorMessage(error.message);
          } else {
            setSuccessMessage('Profil mis à jour avec succès!');
            // Rafraîchir les données du profil après la mise à jour
            const { data, error: fetchError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (fetchError) {
              setErrorMessage(fetchError.message);
            } else if (data) {
              setProfile(data);
            }
          }
        } catch (error) {
          setErrorMessage('Une erreur est survenue lors de la mise à jour du profil.');
        }
      };

      const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
      };

      if (!session || !profile) {
        return <div>Chargement du profil...</div>;
      }

      return (
        <div className="profile-container">
          <h1>Mon Profil</h1>
          {successMessage && <p className="success-message">{successMessage}</p>}
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <form onSubmit={handleUpdateProfile}>
            <div className="form-group">
              <label htmlFor="firstName">Prénom</label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Nom</label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <button type="submit">Mettre à jour le profil</button>
            </div>
          </form>
          <button className="logout-button" onClick={handleLogout}>
            Déconnexion
          </button>
        </div>
      );
    }

    export default ProfilePage;
