
import React, { useState } from 'react';
import { Users as UsersIcon, Plus, Search, Filter, Edit, Trash2, Shield, Mail, Phone } from 'lucide-react';
import Navigation from '@/components/Layout/Navigation';
import Header from '@/components/Layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Users = () => {
  const [roleFilter, setRoleFilter] = useState('all');
  
  const users = [
    {
      id: '1',
      name: 'Pierre Martin',
      email: 'pierre.martin@fleettracker.com',
      phone: '+33 6 12 34 56 78',
      role: 'admin',
      status: 'active',
      lastLogin: '2024-06-25T10:30:00',
      avatar: '/placeholder.svg'
    },
    {
      id: '2',
      name: 'Marie Dubois',
      email: 'marie.dubois@fleettracker.com',
      phone: '+33 6 23 45 67 89',
      role: 'technician',
      status: 'active',
      lastLogin: '2024-06-25T08:15:00',
      avatar: '/placeholder.svg'
    },
    {
      id: '3',
      name: 'Jean Leroy',
      email: 'jean.leroy@fleettracker.com',
      phone: '+33 6 34 56 78 90',
      role: 'manager',
      status: 'active',
      lastLogin: '2024-06-24T16:45:00',
      avatar: '/placeholder.svg'
    },
    {
      id: '4',
      name: 'Sophie Bernard',
      email: 'sophie.bernard@fleettracker.com',
      phone: '+33 6 45 67 89 01',
      role: 'driver',
      status: 'inactive',
      lastLogin: '2024-06-20T12:00:00',
      avatar: '/placeholder.svg'
    },
    {
      id: '5',
      name: 'Lucas Petit',
      email: 'lucas.petit@fleettracker.com',
      phone: '+33 6 56 78 90 12',
      role: 'technician',
      status: 'active',
      lastLogin: '2024-06-25T09:30:00',
      avatar: '/placeholder.svg'
    }
  ];

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge variant="destructive">Administrateur</Badge>;
      case 'manager':
        return <Badge className="bg-blue-100 text-blue-800">Manager</Badge>;
      case 'technician':
        return <Badge className="bg-orange-100 text-orange-800">Technicien</Badge>;
      case 'driver':
        return <Badge className="bg-green-100 text-green-800">Conducteur</Badge>;
      default:
        return <Badge variant="secondary">{role}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Actif</Badge>;
      case 'inactive':
        return <Badge className="bg-red-100 text-red-800">Inactif</Badge>;
      case 'pending':
        return <Badge className="bg-orange-100 text-orange-800">En attente</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const filteredUsers = users.filter(user => {
    if (roleFilter === 'all') return true;
    return user.role === roleFilter;
  });

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const userStats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    admins: users.filter(u => u.role === 'admin').length,
    technicians: users.filter(u => u.role === 'technician').length
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 w-full">
      <Navigation />
      
      <div className="flex-1">
        <Header />
        
        <main className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Utilisateurs
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Gestion des utilisateurs et des permissions
              </p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Nouvel utilisateur
            </Button>
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
            
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les rôles</SelectItem>
                <SelectItem value="admin">Administrateur</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="technician">Technicien</SelectItem>
                <SelectItem value="driver">Conducteur</SelectItem>
              </SelectContent>
            </Select>
            
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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Rôle</TableHead>
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
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name}</p>
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
                            {user.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell>
                        {new Date(user.lastLogin).toLocaleString('fr-FR')}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Users;
