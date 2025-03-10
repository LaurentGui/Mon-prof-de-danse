import React from 'react';
    import { Link } from 'react-router-dom';

    function HomePage({ session }) {
      return (
        <div className="home-container">
          <h1>Bienvenue sur Mon Prof de Danse</h1>
          <p>
            {session
              ? `Bonjour, ${session.user.email}!`
              : 'Connectez-vous ou inscrivez-vous pour commencer.'}
          </p>
          {!session && (
            <>
              <Link to="/login">Se connecter</Link>
              <br />
              <Link to="/register">S'inscrire</Link>
            </>
          )}
        </div>
      );
    }

    export default HomePage;
