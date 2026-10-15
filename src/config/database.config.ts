import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  // On applique l'encodage automatique du mot de passe ici si nécessaire
  uri: process.env.MONGO_URI,
}));