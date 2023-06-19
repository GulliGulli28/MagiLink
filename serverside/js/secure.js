const sanitizeHtml = require('sanitize-html');

function secure(userInput) {
  // Filtrage des caractères spéciaux
  const sanitizedInput = sanitizeHtml(userInput);

  // Échappement des caractères spéciaux
  return sanitizedInput.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}  

const userInput = 'Exemple de texte contenant des caractères spéciaux: $^*{}';
const escapedInput = secure(userInput);

console.log(escapedInput);
  

