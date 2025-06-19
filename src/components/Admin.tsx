import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem as MuiMenuItem,
  InputLabel,
  FormControl,
  Tab,
  Tabs,
  IconButton,
  Alert,
  Snackbar,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import type { MenuItem, MenuGroup } from '../types/MenuItem';
import { menuService } from '../services/menuService';

const emptyMenuItem: Omit<MenuItem, 'id'> = {
  name: '',
  description: '',
  group: {
    id: '',
    emoji: '',
    name: '',
    description: '',
  },
  isAvailable: true,
  image: '',
  order: 0,
};

const emptyMenuGroup: Omit<MenuGroup, 'id'> = {
  emoji: '',
  name: '',
  description: '',
  order: 0,
};

const Admin = () => {
  const [tab, setTab] = useState<'items' | 'groups'>('items');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [menuGroups, setMenuGroups] = useState<MenuGroup[]>([]);
  const [newItem, setNewItem] = useState<Omit<MenuItem, 'id'>>(emptyMenuItem);
  const [newGroup, setNewGroup] = useState<Omit<MenuGroup, 'id'>>(emptyMenuGroup);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [editingGroup, setEditingGroup] = useState<MenuGroup | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch menu items and groups
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [groups, items] = await Promise.all([
          menuService.getGroups(),
          menuService.getItems()
        ]);
        setMenuGroups(groups);
        setMenuItems(items);
      } catch (error) {
        setError('Erro ao carregar dados do menu');
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Add/Update menu item
  const handleSubmitItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const selectedGroup = menuGroups.find(g => g.id === newItem.group.id);
      if (!selectedGroup) return;

      const itemToAdd = {
        ...newItem,
        group: selectedGroup,
        order: menuItems.length + 1,
      };

      if (editingItem) {
        const updatedItem = await menuService.updateItem(Number(editingItem.id), itemToAdd);
        setMenuItems(menuItems.map(item => 
          item.id === editingItem.id ? updatedItem : item
        ));
        setEditingItem(null);
      } else {
        const newItemResult = await menuService.createItem(itemToAdd);
        setMenuItems([...menuItems, newItemResult]);
      }

      setNewItem(emptyMenuItem);
    } catch (error) {
      setError('Erro ao salvar item');
      console.error('Error saving item:', error);
    }
  };

  // Add/Update menu group
  const handleSubmitGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const groupToAdd = {
        ...newGroup,
        order: menuGroups.length + 1,
      };

      if (editingGroup) {
        const updatedGroup = await menuService.updateGroup(Number(editingGroup.id), groupToAdd);
        setMenuGroups(menuGroups.map(group => 
          group.id === editingGroup.id ? updatedGroup : group
        ));
        setEditingGroup(null);
      } else {
        const newGroupResult = await menuService.createGroup(groupToAdd);
        setMenuGroups([...menuGroups, newGroupResult]);
      }

      setNewGroup(emptyMenuGroup);
    } catch (error) {
      setError('Erro ao salvar grupo');
      console.error('Error saving group:', error);
    }
  };

  // Delete menu item
  const handleDeleteItem = async (id: string) => {
    try {
      await menuService.deleteItem(Number(id));
      setMenuItems(menuItems.filter(item => item.id !== id));
    } catch (error) {
      setError('Erro ao excluir item');
      console.error('Error deleting item:', error);
    }
  };

  // Delete menu group
  const handleDeleteGroup = async (id: string) => {
    try {
      // Check if group has items
      const hasItems = menuItems.some(item => item.group.id === id);
      if (hasItems) {
        setError('Não é possível excluir um grupo que contém itens');
        return;
      }

      await menuService.deleteGroup(Number(id));
      setMenuGroups(menuGroups.filter(group => group.id !== id));
    } catch (error) {
      setError('Erro ao excluir grupo');
      console.error('Error deleting group:', error);
    }
  };

  // Toggle item availability
  const handleToggleAvailability = async (id: string, currentAvailability: boolean) => {
    try {
      const itemToUpdate = menuItems.find(item => item.id === id);
      if (!itemToUpdate) return;

      const updatedItem = await menuService.updateItem(Number(id), {
        ...itemToUpdate,
        isAvailable: !currentAvailability
      });

      setMenuItems(menuItems.map(item =>
        item.id === id ? updatedItem : item
      ));
    } catch (error) {
      setError('Erro ao atualizar disponibilidade');
      console.error('Error updating availability:', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Administração do Menu
      </Typography>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      <Tabs value={tab} onChange={(_, newValue) => setTab(newValue)} sx={{ mb: 3 }}>
        <Tab label="Itens do Menu" value="items" />
        <Tab label="Grupos" value="groups" />
      </Tabs>

      {tab === 'items' ? (
        <>
          <Paper sx={{ p: 3, mb: 3 }}>
            <form onSubmit={handleSubmitItem}>
              <Box sx={{ display: 'grid', gap: 2, maxWidth: 800 }}>
                <FormControl>
                  <InputLabel>Grupo</InputLabel>
                  <Select
                    value={newItem.group.id}
                    onChange={(e) => {
                      const group = menuGroups.find(g => g.id === e.target.value);
                      if (group) {
                        setNewItem({ ...newItem, group });
                      }
                    }}
                    required
                  >
                    {menuGroups.map((group) => (
                      <MuiMenuItem key={group.id} value={group.id}>
                        {group.emoji} {group.name}
                      </MuiMenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  label="Nome do Item"
                  value={newItem.name}
                  onChange={e => setNewItem({
                    ...newItem,
                    name: e.target.value
                  })}
                  required
                  fullWidth
                />

                <TextField
                  label="Descrição"
                  value={newItem.description}
                  onChange={e => setNewItem({
                    ...newItem,
                    description: e.target.value
                  })}
                  required
                  multiline
                  rows={2}
                  fullWidth
                />

                <TextField
                  label="URL da Imagem"
                  value={newItem.image}
                  onChange={e => setNewItem({ ...newItem, image: e.target.value })}
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={newItem.isAvailable}
                      onChange={e => setNewItem({ ...newItem, isAvailable: e.target.checked })}
                    />
                  }
                  label="Disponível"
                />

                <Button type="submit" variant="contained" color="primary">
                  {editingItem ? 'Atualizar Item' : 'Adicionar Item'}
                </Button>

                {editingItem && (
                  <Button 
                    variant="outlined" 
                    color="secondary" 
                    onClick={() => {
                      setEditingItem(null);
                      setNewItem(emptyMenuItem);
                    }}
                  >
                    Cancelar Edição
                  </Button>
                )}
              </Box>
            </form>
          </Paper>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Grupo</TableCell>
                  <TableCell>Nome</TableCell>
                  <TableCell>Descrição</TableCell>
                  <TableCell>Disponível</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {menuItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.group.emoji} {item.group.name}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={item.isAvailable}
                            onChange={() => handleToggleAvailability(item.id, item.isAvailable)}
                          />
                        }
                        label=""
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton 
                        onClick={() => {
                          setEditingItem(item);
                          setNewItem(item);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteItem(item.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      ) : (
        <>
          <Paper sx={{ p: 3, mb: 3 }}>
            <form onSubmit={handleSubmitGroup}>
              <Box sx={{ display: 'grid', gap: 2, maxWidth: 800 }}>
                <TextField
                  label="Emoji"
                  value={newGroup.emoji}
                  onChange={e => setNewGroup({ ...newGroup, emoji: e.target.value })}
                  required
                />

                <TextField
                  label="Nome do Grupo"
                  value={newGroup.name}
                  onChange={e => setNewGroup({
                    ...newGroup,
                    name: e.target.value
                  })}
                  required
                  fullWidth
                />

                <TextField
                  label="Descrição do Grupo"
                  value={newGroup.description}
                  onChange={e => setNewGroup({
                    ...newGroup,
                    description: e.target.value
                  })}
                  required
                  multiline
                  rows={2}
                  fullWidth
                />

                <Button type="submit" variant="contained" color="primary">
                  {editingGroup ? 'Atualizar Grupo' : 'Adicionar Grupo'}
                </Button>

                {editingGroup && (
                  <Button 
                    variant="outlined" 
                    color="secondary" 
                    onClick={() => {
                      setEditingGroup(null);
                      setNewGroup(emptyMenuGroup);
                    }}
                  >
                    Cancelar Edição
                  </Button>
                )}
              </Box>
            </form>
          </Paper>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Emoji</TableCell>
                  <TableCell>Nome</TableCell>
                  <TableCell>Descrição</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {menuGroups.map((group) => (
                  <TableRow key={group.id}>
                    <TableCell>{group.emoji}</TableCell>
                    <TableCell>{group.name}</TableCell>
                    <TableCell>{group.description}</TableCell>
                    <TableCell>
                      <IconButton 
                        onClick={() => {
                          setEditingGroup(group);
                          setNewGroup(group);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteGroup(group.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Box>
  );
};

export default Admin;
