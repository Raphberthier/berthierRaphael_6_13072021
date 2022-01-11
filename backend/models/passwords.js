const passwordValidator = require('password-validator');

/* Création d'un schéma de données pour les mots  de passe */
const passwordSchema = new passwordValidator();
passwordSchema
.is().min(8)                                    // Minimum length 8
.is().max(100)                                  // Maximum length 100
.has().uppercase()                              
.has().lowercase()                              
.has().digits(2)                               
.has().not().spaces()                           
.is().not().oneOf(['Passw0rd', 'Password123']); 

module.exports = passwordSchema;