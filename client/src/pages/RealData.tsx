import React, { useEffect, useState } from 'react';
import { Database, Wrench, Users, AlertTriangle, Loader, RefreshCw } from 'lucide-react';
import AppLayout from '@/components/Layout/AppLayout';

interface DataStats {
  machines: number;
  contacts: number;
  anomalies: number;
}

const RealData = () => {
  const [stats, setStats] = useState<DataStats>({ machines: 0, contacts: 0, anomalies: 0 });
  const [loading, setLoading] = useState(true);
  const [machines, setMachines] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [anomalies, setAnomalies] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('machines');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [machinesRes, contactsRes, anomaliesRes] = await Promise.all([
        fetch('/api/machines'),
        fetch('/api/contacts'),
        fetch('/api/anomalies')
      ]);

      const machinesData = await machinesRes.json();
      const contactsData = await contactsRes.json();
      const anomaliesData = await anomaliesRes.json();

      setMachines(Array.isArray(machinesData) ? machinesData : []);
      setContacts(Array.isArray(contactsData) ? contactsData : []);
      setAnomalies(Array.isArray(anomaliesData) ? anomaliesData : []);

      setStats({
        machines: Array.isArray(machinesData) ? machinesData.length : 0,
        contacts: Array.isArray(contactsData) ? contactsData.length : 0,
        anomalies: Array.isArray(anomaliesData) ? anomaliesData.length : 0
      });
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderMachines = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Machines ({machines.length})</h3>
      <div className="grid gap-4">
        {machines.slice(0, 10).map((machine, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
              <div><strong>Code:</strong> {machine.CD_MACHINE || machine.cdMachine || 'N/A'}</div>
              <div><strong>Libellé:</strong> {machine.LIB_MACHINE || machine.libMachine || 'N/A'}</div>
              <div><strong>Marque:</strong> {machine.MARQUE || machine.marque || 'N/A'}</div>
              <div><strong>Modèle:</strong> {machine.MODELE || machine.modele || 'N/A'}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderContacts = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Contacts ({contacts.length})</h3>
      <div className="grid gap-4">
        {contacts.slice(0, 10).map((contact, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
              <div><strong>Nom:</strong> {contact.NOMFAMILLE || contact.nomFamille || 'N/A'}</div>
              <div><strong>Prénom:</strong> {contact.PRENOM || contact.prenom || 'N/A'}</div>
              <div><strong>Email:</strong> {contact.EMAIL || contact.email || 'N/A'}</div>
              <div><strong>Téléphone:</strong> {contact.TEL1 || contact.tel1 || 'N/A'}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAnomalies = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Anomalies ({anomalies.length})</h3>
      <div className="grid gap-4">
        {anomalies.slice(0, 10).map((anomalie, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div><strong>Libellé:</strong> {anomalie.LIB_ANOMALIE || anomalie.libAnomalie || 'N/A'}</div>
              <div><strong>Criticité:</strong> {anomalie.CRITICITE || anomalie.criticite || 'N/A'}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p>Chargement des données...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Données réelles
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Visualisation des données de votre base MySQL distante
            </p>
          </div>
          <button
            onClick={loadData}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Actualiser</span>
          </button>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
            <div className="flex items-center space-x-3">
              <Wrench className="w-8 h-8 text-blue-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Machines</h3>
                <p className="text-2xl font-bold text-blue-600">{stats.machines}</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
            <div className="flex items-center space-x-3">
              <Users className="w-8 h-8 text-green-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Contacts</h3>
                <p className="text-2xl font-bold text-green-600">{stats.contacts}</p>
              </div>
            </div>
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-8 h-8 text-red-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Anomalies</h3>
                <p className="text-2xl font-bold text-red-600">{stats.anomalies}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Onglets */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'machines', label: 'Machines', icon: Wrench },
                { id: 'contacts', label: 'Contacts', icon: Users },
                { id: 'anomalies', label: 'Anomalies', icon: AlertTriangle }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'machines' && renderMachines()}
            {activeTab === 'contacts' && renderContacts()}
            {activeTab === 'anomalies' && renderAnomalies()}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default RealData;