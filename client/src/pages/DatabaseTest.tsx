import React, { useEffect, useState } from 'react';
import { Database, CheckCircle, XCircle, Loader } from 'lucide-react';
import AppLayout from '@/components/Layout/AppLayout';

interface DatabaseTestResult {
  success: boolean;
  message?: string;
  database?: string;
  tables?: number;
  tableNames?: string[];
  error?: string;
}

const DatabaseTest = () => {
  const [testResult, setTestResult] = useState<DatabaseTestResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await fetch('/api/db-test');
        const data = await response.json();
        setTestResult(data);
      } catch (error) {
        setTestResult({
          success: false,
          error: 'Erreur de connexion au serveur'
        });
      } finally {
        setLoading(false);
      }
    };

    testConnection();
  }, []);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p>Test de connexion à la base de données...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Test de connexion MySQL
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Vérification de la connexion à la base de données distante
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Database className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Résultat du test
            </h2>
          </div>

          {testResult?.success ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-green-600 font-medium">Connexion réussie</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">Base de données</h3>
                  <p className="text-green-700 dark:text-green-300">{testResult.database}</p>
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">Nombre de tables</h3>
                  <p className="text-blue-700 dark:text-blue-300">{testResult.tables}</p>
                </div>
              </div>

              {testResult.tableNames && testResult.tableNames.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-3">Tables disponibles</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {testResult.tableNames.map((tableName, index) => (
                      <div key={index} className="bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded text-sm">
                        {tableName}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <XCircle className="w-5 h-5 text-red-600" />
                <span className="text-red-600 font-medium">Échec de la connexion</span>
              </div>
              
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                <p className="text-red-700 dark:text-red-300">
                  {testResult?.error || 'Erreur inconnue'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default DatabaseTest;