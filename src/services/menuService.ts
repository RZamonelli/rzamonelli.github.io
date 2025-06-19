import type { MenuItem, MenuGroup } from '../types/MenuItem';

const API_URL = 'http://localhost:3000/api';

export const menuService = {
  // Grupos
  async getGroups(): Promise<MenuGroup[]> {
    const response = await fetch(`${API_URL}/groups`);
    if (!response.ok) throw new Error('Erro ao buscar grupos');
    return response.json();
  },

  async createGroup(group: Omit<MenuGroup, 'id'>): Promise<MenuGroup> {
    const response = await fetch(`${API_URL}/groups`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(group),
    });
    if (!response.ok) throw new Error('Erro ao criar grupo');
    return response.json();
  },

  async updateGroup(id: number, group: Omit<MenuGroup, 'id'>): Promise<MenuGroup> {
    const response = await fetch(`${API_URL}/groups/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(group),
    });
    if (!response.ok) throw new Error('Erro ao atualizar grupo');
    return response.json();
  },

  async deleteGroup(id: number): Promise<{ success: boolean }> {
    const response = await fetch(`${API_URL}/groups/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Erro ao excluir grupo');
    return response.json();
  },

  // Itens
  async getItems(): Promise<MenuItem[]> {
    const response = await fetch(`${API_URL}/items`);
    if (!response.ok) throw new Error('Erro ao buscar itens');
    return response.json();
  },

  async createItem(item: Omit<MenuItem, 'id'>): Promise<MenuItem> {
    const response = await fetch(`${API_URL}/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    });
    if (!response.ok) throw new Error('Erro ao criar item');
    return response.json();
  },

  async updateItem(id: number, item: Omit<MenuItem, 'id'>): Promise<MenuItem> {
    const response = await fetch(`${API_URL}/items/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    });
    if (!response.ok) throw new Error('Erro ao atualizar item');
    return response.json();
  },

  async deleteItem(id: number): Promise<{ success: boolean }> {
    const response = await fetch(`${API_URL}/items/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Erro ao excluir item');
    return response.json();
  },
};
