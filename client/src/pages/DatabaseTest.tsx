import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

interface TestResult {
  success: boolean;
  message?: string;
  error?: string;
  data?: any;
}

export default function DatabaseTest() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [userTableResult, setUserTableResult] = useState<TestResult | null>(null);
  const [usersTableResult, setUsersTableResult] = useState<TestResult | null>(null);
  const [jointureResult, setJointureResult] = useState<TestResult | null>(null);
  const [bcryptTestResult, setBcryptTestResult] = useState<TestResult | null>(null);
  const [commonPasswordsResult, setCommonPasswordsResult] = useState<TestResult | null>(null);
  const [userAuthResult, setUserAuthResult] = useState<TestResult | null>(null);
  const [allUsersResult, setAllUsersResult] = useState<TestResult | null>(null);

  const runTest = async (testName: string, endpoint: string) => {
    try {
      const response = await fetch(endpoint);
      const data = await response.json();
      
      const result: TestResult = {
        success: response.ok,
        message: `Test ${testName}: ${response.ok ? 'Réussi' : 'Échoué'}`,
        data: data
      };
      
      setResults(prev => [...prev, result]);
    } catch (error) {
      const result: TestResult = {
        success: false,
        message: `Test ${testName}: Erreur`,
        error: (error as Error).message
      };
      setResults(prev => [...prev, result]);
    }
  };

  const testUserTableConnection = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/test-user-table');
      if (response.ok) {
        const data = await response.json();
        setUserTableResult(data);
      } else {
        setUserTableResult({ 
          success: false, 
          message: 'Erreur de connexion à la table USER',
          error: 'Erreur de connexion à la table USER' 
        });
      }
    } catch (error) {
      setUserTableResult({ 
        success: false, 
        message: 'Erreur: ' + (error as Error).message,
        error: 'Erreur: ' + (error as Error).message 
      });
    } finally {
      setLoading(false);
    }
  };

  const testUsersTableConnection = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/test-users-table');
      if (response.ok) {
        const data = await response.json();
        setUsersTableResult(data);
      } else {
        setUsersTableResult({ 
          success: false, 
          message: 'Erreur de connexion à la table users',
          error: 'Erreur de connexion à la table users' 
        });
      }
    } catch (error) {
      setUsersTableResult({ 
        success: false, 
        message: 'Erreur: ' + (error as Error).message,
        error: 'Erreur: ' + (error as Error).message 
      });
    } finally {
      setLoading(false);
    }
  };

  const runAllTests = async () => {
    setLoading(true);
    setResults([]);
    
    await runTest('Connexion DB', '/api/test-db');
    await runTest('Table VEHICULE', '/api/test-vehicule');
    await runTest('Table CLIENT', '/api/test-client');
    await runTest('Table USER', '/api/test-user');
    
    setLoading(false);
  };

  const testJointure = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/test-jointure');
      if (response.ok) {
        const data = await response.json();
        setJointureResult(data);
      } else {
        setJointureResult({ 
          success: false, 
          message: 'Erreur de connexion à la jointure',
          error: 'Erreur de connexion à la jointure' 
        });
      }
    } catch (error) {
      setJointureResult({ 
        success: false, 
        message: 'Erreur: ' + (error as Error).message,
        error: 'Erreur: ' + (error as Error).message 
      });
    } finally {
      setLoading(false);
    }
  };

  const testBcrypt = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/test-bcrypt');
      if (response.ok) {
        const data = await response.json();
        setBcryptTestResult(data);
      } else {
        setBcryptTestResult({ 
          success: false, 
          message: 'Erreur lors du test bcrypt',
          error: 'Erreur lors du test bcrypt' 
        });
      }
    } catch (error) {
      setBcryptTestResult({ 
        success: false, 
        message: 'Erreur: ' + (error as Error).message,
        error: 'Erreur: ' + (error as Error).message 
      });
    } finally {
      setLoading(false);
    }
  };

  const testCommonPasswords = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/test-common-passwords');
      if (response.ok) {
        const data = await response.json();
        setCommonPasswordsResult(data);
      } else {
        setCommonPasswordsResult({ 
          success: false, 
          message: 'Erreur lors du test mots de passe',
          error: 'Erreur lors du test mots de passe' 
        });
      }
    } catch (error) {
      setCommonPasswordsResult({ 
        success: false, 
        message: 'Erreur: ' + (error as Error).message,
        error: 'Erreur: ' + (error as Error).message 
      });
    } finally {
      setLoading(false);
    }
  };

  const testUserAuth = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/test-user-auth');
      if (response.ok) {
        const data = await response.json();
        setUserAuthResult(data);
      } else {
        setUserAuthResult({ 
          success: false, 
          message: 'Erreur lors du test authentification',
          error: 'Erreur lors du test authentification' 
        });
      }
    } catch (error) {
      setUserAuthResult({ 
        success: false, 
        message: 'Erreur: ' + (error as Error).message,
        error: 'Erreur: ' + (error as Error).message 
      });
    } finally {
      setLoading(false);
    }
  };

  const listAllUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/list-all-users');
      if (response.ok) {
        const data = await response.json();
        setAllUsersResult(data);
      } else {
        setAllUsersResult({ 
          success: false, 
          message: 'Erreur lors de la récupération des utilisateurs',
          error: 'Erreur lors de la récupération des utilisateurs' 
        });
      }
    } catch (error) {
      setAllUsersResult({ 
        success: false, 
        message: 'Erreur: ' + (error as Error).message,
        error: 'Erreur: ' + (error as Error).message 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Test de la Base de Données</CardTitle>
            <CardDescription>
              Vérification de la connexion et de la structure des tables MySQL
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={runAllTests} 
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Tests en cours...' : 'Lancer tous les tests'}
            </Button>

            <div className="space-y-3">
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    result.success 
                      ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800' 
                      : 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {result.success ? (
                      <span className="text-green-600 dark:text-green-400">✓</span>
                    ) : (
                      <span className="text-red-600 dark:text-red-400">✗</span>
                    )}
                    <span className="font-medium">{result.message}</span>
                  </div>
                  
                  {result.error && (
                    <div className="mt-2 text-sm text-red-600 dark:text-red-400">
                      Erreur: {result.error}
                    </div>
                  )}
                  
                  {result.data && (
                    <div className="mt-2">
                      <details className="text-sm">
                        <summary className="cursor-pointer text-gray-600 dark:text-gray-400">
                          Voir les données ({typeof result.data === 'object' ? 
                            Array.isArray(result.data) ? 
                              `${result.data.length} éléments` : 
                              `${Object.keys(result.data).length} propriétés`
                            : 'données'})
                        </summary>
                        <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs overflow-auto max-h-40">
                          {JSON.stringify(result.data, null, 2)}
                        </pre>
                      </details>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {results.length > 0 && !loading && (
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <h3 className="font-medium text-blue-900 dark:text-blue-100">
                  Résumé des tests
                </h3>
                <div className="mt-2 text-sm text-blue-800 dark:text-blue-200">
                  <p>✓ Réussis: {results.filter(r => r.success).length}</p>
                  <p>✗ Échoués: {results.filter(r => !r.success).length}</p>
                  <p>Total: {results.length}</p>
                </div>
              </div>
            )}

            <div className="border p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-4">Test Table USER</h2>
              <button 
                onClick={testUserTableConnection}
                disabled={loading}
                className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                {loading ? 'Test en cours...' : 'Tester Connexion Table USER'}
              </button>
              
              {userTableResult && (
                <div className="mt-4 p-3 border rounded">
                  <h3 className="font-semibold">Résultat :</h3>
                  <pre className="text-sm bg-gray-100 p-2 rounded mt-2 overflow-auto">
                    {JSON.stringify(userTableResult, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            <div className="border p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-4">Test Table users</h2>
              <button 
                onClick={testUsersTableConnection}
                disabled={loading}
                className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                {loading ? 'Test en cours...' : 'Tester Connexion Table users'}
              </button>
              
              {usersTableResult && (
                <div className="mt-4 p-3 border rounded">
                  <h3 className="font-semibold">Résultat :</h3>
                  <pre className="text-sm bg-gray-100 p-2 rounded mt-2 overflow-auto">
                    {JSON.stringify(usersTableResult, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            <div className="border p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-4">📋 Liste des utilisateurs Table USER</h2>
              <div className="text-sm text-gray-600 mb-4">
                Voir tous les utilisateurs de la table USER pour identifier le bon email
              </div>
              
              <button 
                onClick={listAllUsers}
                disabled={loading}
                className="bg-indigo-600 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                {loading ? 'Chargement...' : 'Lister tous les utilisateurs USER'}
              </button>
              
              {allUsersResult && (
                <div className={`mt-4 p-3 border rounded ${allUsersResult.success ? 'border-blue-500 bg-blue-50' : 'border-red-500 bg-red-50'}`}>
                  <h3 className="font-semibold">
                    {allUsersResult.success ? `📋 ${allUsersResult.data?.count || 0} utilisateur(s) trouvé(s)` : '❌ Erreur'}
                  </h3>
                  
                  {allUsersResult.data?.emailsList && (
                    <div className="mt-2 p-2 bg-yellow-100 rounded">
                      <strong>📧 Emails dans la table :</strong>
                      <ul className="list-disc list-inside mt-1">
                        {allUsersResult.data.emailsList.map((email: string, index: number) => (
                          <li key={index} className="text-sm">
                            {email} {email === "dev@techni-park.com" && "⭐ (recherché)"}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <pre className="text-sm bg-gray-100 p-2 rounded mt-2 overflow-auto">
                    {JSON.stringify(allUsersResult, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            <div className="border p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-4">🔐 Test Authentification Table USER</h2>
              <div className="text-sm text-gray-600 mb-4">
                Test d'authentification avec la table USER (mots de passe en clair)
                <br />
                Email de test : dev@techni-park.com
                <br />
                Mot de passe de test : DEV
              </div>
              
              <button 
                onClick={testUserAuth}
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                {loading ? 'Test en cours...' : 'Tester Authentification Table USER'}
              </button>
              
              {userAuthResult && (
                <div className={`mt-4 p-3 border rounded ${
                  userAuthResult.data?.canLogin ? 'border-green-500 bg-green-50' : 
                  userAuthResult.success ? 'border-orange-500 bg-orange-50' : 'border-red-500 bg-red-50'
                }`}>
                  <h3 className="font-semibold">
                    {userAuthResult.data?.canLogin ? '✅ Authentification possible' : 
                     userAuthResult.success ? '⚠️ Problème détecté' : '❌ Erreur'}
                  </h3>
                  <pre className="text-sm bg-gray-100 p-2 rounded mt-2 overflow-auto">
                    {JSON.stringify(userAuthResult, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            <div className="border p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-4">Test bcrypt avec mot de passe "123456"</h2>
              <div className="text-sm text-gray-600 mb-4">
                Test de vérification du hash bcrypt avec le mot de passe "123456"
                <br />
                Hash en base : $2y$10$ZglZoahK99IfUXzzerUQfOQT4HwNw33a0MUwRiii7dT4.3xU8uhzS
              </div>
              
              <div className="space-y-2">
                <button 
                  onClick={testBcrypt}
                  disabled={loading}
                  className="bg-orange-500 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                  {loading ? 'Test en cours...' : 'Tester bcrypt avec "123456"'}
                </button>
                
                <button 
                  onClick={testCommonPasswords}
                  disabled={loading}
                  className="bg-purple-500 text-white px-4 py-2 rounded disabled:opacity-50 ml-2"
                >
                  {loading ? 'Test en cours...' : 'Tester mots de passe courants'}
                </button>
              </div>
              
              {bcryptTestResult && (
                <div className={`mt-4 p-3 border rounded ${bcryptTestResult.success ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
                  <h3 className="font-semibold">Résultat du test bcrypt :</h3>
                  <pre className="text-sm bg-gray-100 p-2 rounded mt-2 overflow-auto">
                    {JSON.stringify(bcryptTestResult, null, 2)}
                  </pre>
                </div>
              )}
              
              {commonPasswordsResult && (
                <div className={`mt-4 p-3 border rounded ${commonPasswordsResult.success && commonPasswordsResult.data?.validPassword ? 'border-green-500 bg-green-50' : 'border-orange-500 bg-orange-50'}`}>
                  <h3 className="font-semibold">Résultat test mots de passe courants :</h3>
                  <pre className="text-sm bg-gray-100 p-2 rounded mt-2 overflow-auto">
                    {JSON.stringify(commonPasswordsResult, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            <div className="border p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-4">Format des mots de passe (bcrypt)</h2>
              <div className="text-sm text-gray-600 mb-2">
                Les mots de passe en base utilisent le hachage bcrypt.
                <br />
                Format : $2y$10$salt...hash...
                <br />
                Exemple : $2y$10$ZglZoahK99IfUXzzerUQfOQT4HwNw33a0MUwRiii7dT4.3xU8uhzS
              </div>
              <div className="bg-green-50 p-3 rounded border">
                <strong>✅ Bcrypt détecté :</strong> Le système utilise maintenant bcrypt pour la vérification sécurisée des mots de passe.
                <br />
                <strong>Avantages :</strong> 
                <ul className="list-disc list-inside mt-1">
                  <li>Salt automatique intégré</li>
                  <li>Résistant aux attaques par force brute</li>
                  <li>Standard de sécurité moderne</li>
                </ul>
              </div>
            </div>

            <div className="border p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-4">Test Jointure users + USER</h2>
              <button 
                onClick={testJointure}
                disabled={loading}
                className="bg-purple-500 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                {loading ? 'Test en cours...' : 'Tester Jointure'}
              </button>
              
              {jointureResult && (
                <div className="mt-4 p-3 border rounded">
                  <h3 className="font-semibold">Résultat :</h3>
                  <pre className="text-sm bg-gray-100 p-2 rounded mt-2 overflow-auto">
                    {JSON.stringify(jointureResult, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}