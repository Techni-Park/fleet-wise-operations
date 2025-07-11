import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Gestion sécurisée du contexte d'authentification
  let login: (email: string, password: string) => Promise<any>;
  
  try {
    const auth = useAuth();
    login = auth.login;
  } catch (error) {
    console.error('[Login] Erreur contexte auth:', error);
    
    // Fallback si le contexte n'est pas disponible
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-red-600">Erreur d'initialisation</CardTitle>
            <CardDescription>
              L'application n'a pas pu s'initialiser correctement. Veuillez recharger la page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button 
                onClick={() => window.location.reload()} 
                className="w-full"
              >
                Recharger la page
              </Button>
              <div className="text-center text-sm text-gray-600">
                Si le problème persiste, essayez en mode navigation privée.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(email, password);
      
      if (result.success) {
        console.log('Connexion réussie');
        navigate(from, { replace: true });
      } else {
        setError(result.error || 'Échec de la connexion');
      }
    } catch (err) {
      setError('Une erreur inattendue s\'est produite. Veuillez réessayer.');
      console.error('Erreur de connexion:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Connexion</CardTitle>
          <CardDescription>Entrez votre email et mot de passe pour accéder à votre compte.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Entrez votre adresse email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                autoComplete="email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="Entrez votre mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                autoComplete="current-password"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Connexion...' : 'Se connecter'}
            </Button>
            <div className="text-center text-sm">
              <a href="/forgot-password" className="text-blue-600 hover:underline">
                Mot de passe oublié ?
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
