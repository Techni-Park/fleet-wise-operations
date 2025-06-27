import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { storage } from "./storage";

passport.use(new LocalStrategy(
  { usernameField: 'email' }, // Use EMAILP from USER table
  async (email, password, done) => {
    try {
      console.log('Tentative de connexion avec table USER native pour:', email);
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        console.log('Utilisateur non trouvé dans la table USER pour l\'email:', email);
        return done(null, false, { message: 'Email incorrect.' });
      }
      
      console.log('Utilisateur trouvé dans USER:', { 
        IDUSER: user.IDUSER, 
        EMAILP: user.EMAILP, 
        IARCHIVE: user.IARCHIVE,
        PASSWORD: user.PASSWORD ? '[PRÉSENT]' : '[ABSENT]'
      });
      
      // Vérifier si l'utilisateur est actif (IARCHIVE = 0)
      if (user.IARCHIVE !== 0) {
        console.log('Utilisateur archivé (IARCHIVE != 0) pour:', email);
        return done(null, false, { message: 'Compte archivé.' });
      }
      
      // Comparer le mot de passe en clair (pas de hachage)
      console.log('Comparaison mot de passe en clair...');
      console.log('Mot de passe saisi:', password);
      console.log('Mot de passe stocké:', user.PASSWORD);
      
      if (user.PASSWORD !== password) {
        console.log('Mot de passe incorrect pour:', email);
        return done(null, false, { message: 'Mot de passe incorrect.' });
      }
      
      console.log('Authentification réussie pour:', email);
      
      return done(null, user);
    } catch (err) {
      console.error('Erreur lors de l\'authentification:', err);
      return done(err);
    }
  }
));

passport.serializeUser((user, done) => {
  console.log('Sérialisation utilisateur:', (user as any).IDUSER);
  done(null, (user as any).IDUSER); // Utiliser IDUSER de la table USER
});

passport.deserializeUser(async (idUser: number, done) => {
  try {
    console.log('Désérialisation utilisateur:', idUser);
    const user = await storage.getUser(idUser);
    console.log('Données désérialisées:', user ? 'Trouvées' : 'Non trouvées');
    done(null, user);
  } catch (err) {
    console.error('Erreur lors de la désérialisation:', err);
    done(err);
  }
});
