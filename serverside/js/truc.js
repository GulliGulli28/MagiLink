const { dbis, sync, Channel, House, Message, User, Profile } = require('./db.js');

// Appel de la fonction sync pour synchroniser les modèles avec la base de données
sync()
  .then(() => {
    // La synchronisation est terminée, vous pouvez commencer à interagir avec la base de données
    console.log('Base de données synchronisée');
    
    // Vous pouvez effectuer des opérations de requête ou d'interaction avec les modèles ici
    
  })
  .catch((error) => {
    // Une erreur s'est produite lors de la synchronisation des modèles avec la base de données
    console.error('Erreur lors de la synchronisation de la base de données:', error);
  });
