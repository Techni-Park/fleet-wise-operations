import React, { useEffect, useState } from 'react';
import { Database, Server, CheckCircle, Users, Wrench, AlertTriangle, FileText, Loader, RefreshCw } from 'lucide-react';
import AppLayout from '@/components/Layout/AppLayout';

interface DatabaseInfo {
  success: boolean;
  message?: string;
  database?: string;
  tables?: number;
  tableNames?: string[];
}

interface TableData {
  machines: any[];
  contacts: any[];
  anomalies: any[];
  actions: any[];
}

const MySQLDashboard = () => {
  const [dbInfo, setDbInfo] = useState<DatabaseInfo | null>(null);
  const [tableData, setTableData] = useState<TableData>({
    machines: [],
    contacts: [],
    anomalies: [],
    actions: []
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      // Test de connexion
      const dbResponse = await fetch('/api/db-test');
      const dbData = await dbResponse.json();
      setDbInfo(dbData);

      // Chargement des données des tables
      const [machinesRes, contactsRes, anomaliesRes] = await Promise.all([
        fetch('/api/machines'),
        fetch('/api/contacts'), 
        fetch('/api/anomalies')
      ]);

      const [machines, contacts, anomalies] = await Promise.all([
        machinesRes.json(),
        contactsRes.json(),
        anomaliesRes.json()
      ]);

      setTableData({
        machines: Array.isArray(machines) ? machines : [],
        contacts: Array.isArray(contacts) ? contacts : [],
        anomalies: Array.isArray(anomalies) ? anomalies : [],
        actions: []
      });

    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p>Connexion à la base MySQL distante...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Base MySQL - gestinter_test
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Serveur: 85.31.239.121:3306 - {dbInfo?.tables || 0} tables disponibles
            </p>
          </div>
          <button
            onClick={() => loadData(true)}
            disabled={refreshing}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Actualiser</span>
          </button>
        </div>

        {/* Statut de connexion */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Database className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold">Statut de la connexion</h2>
          </div>
          
          {dbInfo?.success ? (
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-600 font-medium">Connexion active</span>
              <span className="text-gray-500">•</span>
              <span className="text-gray-600">{dbInfo.database}</span>
              <span className="text-gray-500">•</span>
              <span className="text-gray-600">{dbInfo.tables} tables</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span className="text-red-600 font-medium">Connexion échouée</span>
            </div>
          )}
        </div>

        {/* Statistiques des données */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border">
            <div className="flex items-center space-x-3">
              <Wrench className="w-8 h-8 text-blue-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Machines</h3>
                <p className="text-2xl font-bold text-blue-600">{tableData.machines.length}</p>
                <p className="text-sm text-gray-500">MACHINE_MNT</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border">
            <div className="flex items-center space-x-3">
              <Users className="w-8 h-8 text-green-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Contacts</h3>
                <p className="text-2xl font-bold text-green-600">{tableData.contacts.length}</p>
                <p className="text-sm text-gray-500">CONTACT</p>
              </div>
            </div>
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-8 h-8 text-red-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Anomalies</h3>
                <p className="text-2xl font-bold text-red-600">{tableData.anomalies.length}</p>
                <p className="text-sm text-gray-500">ANOMALIE</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border">
            <div className="flex items-center space-x-3">
              <Server className="w-8 h-8 text-purple-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Tables</h3>
                <p className="text-2xl font-bold text-purple-600">{dbInfo?.tables || 0}</p>
                <p className="text-sm text-gray-500">Total base</p>
              </div>
            </div>
          </div>
        </div>

        {/* Aperçu des données récentes */}
        {tableData.contacts.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold mb-4">Contacts récents</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">ID</th>
                    <th className="text-left p-2">Nom</th>
                    <th className="text-left p-2">Prénom</th>
                    <th className="text-left p-2">Email</th>
                    <th className="text-left p-2">Société</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.contacts.slice(0, 5).map((contact, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-2">{contact.IDCONTACT}</td>
                      <td className="p-2">{contact.NOMFAMILLE || '-'}</td>
                      <td className="p-2">{contact.PRENOM || '-'}</td>
                      <td className="p-2">{contact.EMAIL || '-'}</td>
                      <td className="p-2">{contact.IDSOCIETE || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tables disponibles */}
        {dbInfo?.tableNames && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold mb-4">Tables de la base gestinter_test</h3>
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 text-sm">
              {dbInfo.tableNames.slice(0, 30).map((tableName, index) => (
                <div key={index} className="bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded text-center">
                  {tableName}
                </div>
              ))}
              {dbInfo.tableNames.length > 30 && (
                <div className="bg-blue-100 dark:bg-blue-900/20 px-3 py-2 rounded text-center text-blue-600">
                  +{dbInfo.tableNames.length - 30} autres
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default MySQLDashboard;