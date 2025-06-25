
import React from 'react';
import { FileText, Download, Upload, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface VehicleDocumentsProps {
  vehicle: any;
}

const VehicleDocuments: React.FC<VehicleDocumentsProps> = ({ vehicle }) => {
  const documents = [
    {
      id: '1',
      name: 'Carte grise',
      type: 'official',
      uploadDate: '2024-01-15',
      expiryDate: null,
      status: 'valid',
      size: '2.4 MB'
    },
    {
      id: '2',
      name: 'Assurance',
      type: 'insurance',
      uploadDate: '2024-01-01',
      expiryDate: vehicle.insurance,
      status: 'valid',
      size: '1.8 MB'
    },
    {
      id: '3',
      name: 'Contrôle technique',
      type: 'technical',
      uploadDate: '2023-10-20',
      expiryDate: vehicle.technicalControl,
      status: 'expiring_soon',
      size: '3.2 MB'
    },
    {
      id: '4',
      name: 'Facture dernière révision',
      type: 'maintenance',
      uploadDate: '2024-05-15',
      expiryDate: null,
      status: 'valid',
      size: '892 KB'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'valid':
        return <Badge className="bg-green-100 text-green-800">Valide</Badge>;
      case 'expiring_soon':
        return <Badge className="bg-orange-100 text-orange-800">Expire bientôt</Badge>;
      case 'expired':
        return <Badge className="bg-red-100 text-red-800">Expiré</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getDocumentTypeLabel = (type: string) => {
    switch (type) {
      case 'official':
        return 'Document officiel';
      case 'insurance':
        return 'Assurance';
      case 'technical':
        return 'Contrôle technique';
      case 'maintenance':
        return 'Maintenance';
      default:
        return 'Autre';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Documents</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Gestion des documents du véhicule
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un document
        </Button>
      </div>

      <div className="grid gap-4">
        {documents.map((document) => (
          <Card key={document.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileText className="w-8 h-8 text-blue-500" />
                  <div>
                    <h4 className="font-medium">{document.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {getDocumentTypeLabel(document.type)} • {document.size}
                    </p>
                    <p className="text-xs text-gray-500">
                      Ajouté le {new Date(document.uploadDate).toLocaleDateString('fr-FR')}
                      {document.expiryDate && (
                        <span className="ml-2">
                          • Expire le {new Date(document.expiryDate).toLocaleDateString('fr-FR')}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(document.status)}
                  <Button variant="outline" size="sm">
                    <Download className="w-3 h-3 mr-1" />
                    Télécharger
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {documents.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">Aucun document disponible</p>
            <Button>
              <Upload className="w-4 h-4 mr-2" />
              Uploader le premier document
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VehicleDocuments;
