
import React, { useState, useEffect, useCallback } from 'react';
import { Users as UsersIcon, Plus, Search, Filter, Edit, Trash2, Shield, Mail, Phone, Loader, RefreshCw } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import AppLayout from '@/components/Layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Users = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadUsers = useCallback(async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
      setUsers([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const getStatusBadge = (active: number) => {
    if (active === 1) {
      return <Badge className="bg-green-100 text-green-800">Actif</Badge>;
    } else {
      return <Badge className="bg-red-100 text-red-800">Inactif</Badge>;
    }
  };

  const filteredUsers = users; // No role filter for now

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName ? firstName[0] : ''}${lastName ? lastName[0] : ''}`.toUpperCase();
  };

  const handleDelete = async (userId: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        const response = await fetch(`/api/users/${userId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          loadUsers();
        } else {
          alert(`Erreur lors de la suppression de l'utilisateur`);
        }
      } catch (error) {
        console.error('Erreur:', error);
        alert(`Erreur lors de la suppression de l'utilisateur`);
      }
    }
  };

  const userStats = {
    total: users.length,
    active: users.filter(u => u.active === 1).length,
    // No direct role information from the database for now
    admins: 0,
    technicians: 0
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p>Chargement des utilisateurs...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Utilisateurs
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Gestion des utilisateurs et des permissions
            </p>
          </div>
          <div className="flex space-x-3">
            <Button 
              onClick={() => loadUsers(true)} 
              disabled={refreshing}
              variant="outline"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
            <Link to="/users/create">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Nouvel utilisateur
              </Button>
            </Link>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <UsersIcon className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{userStats.total}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Utilisateurs totaux</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <div>
                  <p className="text-2xl font-bold">{userStats.active}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Utilisateurs actifs</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Shield className="w-8 h-8 text-red-500" />
                <div>
                  <p className="text-2xl font-bold">{userStats.admins}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Administrateurs</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <div>
                  <p className="text-2xl font-bold">{userStats.technicians}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Techniciens</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtres et recherche */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher un utilisateur..."
                className="pl-10"
              />
            </div>
          </div>
          
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filtres
          </Button>
        </div>

        {/* Liste des utilisateurs */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des utilisateurs</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredUsers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Aucun utilisateur trouvé.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Dernière connexion</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={user.avatar} alt={`${user.firstName} ${user.lastName}`} />
                            <AvatarFallback>{getInitials(user.firstName, user.lastName)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.firstName} {user.lastName}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Mail className="w-4 h-4 mr-1 text-gray-400" />
                            {user.email}
                          </div>
                          <div className="flex items-center text-sm">
                            <Phone className="w-4 h-4 mr-1 text-gray-400" />
                            {user.phone || 'N/A'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(user.active)}</TableCell>
                      <TableCell>
                        {user.lastLogin ? new Date(user.lastLogin).toLocaleString('fr-FR') : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Link to={`/users/${user.id}/edit`}>
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button variant="destructive" size="sm" onClick={() => handleDelete(user.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Users;
