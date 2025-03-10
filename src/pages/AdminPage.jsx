import React, { useState, useEffect } from 'react';
    import { supabase } from '../App';

    function AdminPage() {
      const [users, setUsers] = useState([]);
      const [loading, setLoading] = useState(true);
      const [successMessage, setSuccessMessage] = useState('');
      const [errorMessage, setErrorMessage] = useState('');

      useEffect(() => {
        const fetchUsers = async () => {
          setLoading(true);
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });

          if (error) {
            setErrorMessage(error.message);
          } else {
            setUsers(data);
          }
          setLoading(false);
        };

        fetchUsers();
      }, []);

      const handleUpdateUser = async (userId, field, value) => {
        setSuccessMessage('');
        setErrorMessage('');

        try {
          const { error } = await supabase
            .from('profiles')
            .update({ [field]: value })
            .eq('id', userId);

          if (error) {
            setErrorMessage(error.message);
          } else {
            setSuccessMessage('Utilisateur mis à jour avec succès!');
            // Mettre à jour l'état local des utilisateurs
            setUsers(
              users.map((user) =>
                user.id === userId ? { ...user, [field]: value } : user
              )
            );
          }
        } catch (error) {
          setErrorMessage('Une erreur est survenue lors de la mise à jour de l\'utilisateur.');
        }
      };

      if (loading) {
        return <div>Chargement des utilisateurs...</div>;
      }

      return (
        <div className="admin-container">
          <h1>Gestion des utilisateurs</h1>
          {successMessage && <p className="success-message">{successMessage}</p>}
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Email</th>
                <th>Statut</th>
                <th>Rôle</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.last_name}</td>
                  <td>{user.first_name}</td>
                  <td>{user.email}</td>
                  <td>
                    <select
                      value={user.status}
                      onChange={(e) =>
                        handleUpdateUser(user.id, 'status', e.target.value)
                      }
                    >
                      <option value="A approuver">A approuver</option>
                      <option value="Approuvé">Approuvé</option>
                    </select>
                  </td>
                  <td>
                    <select
                      value={user.role}
                      onChange={(e) =>
                        handleUpdateUser(user.id, 'role', e.target.value)
                      }
                    >
                      <option value="Utilisateur">Utilisateur</option>
                      <option value="Administrateur">Administrateur</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    export default AdminPage;
