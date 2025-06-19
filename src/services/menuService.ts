import type { MenuItem, MenuGroup } from '../types/MenuItem';
import { initialGroups, initialMenuItems } from '../data/initialMenu';

const IS_PRODUCTION = window.location.hostname !== 'localhost';
const API_URL = 'http://localhost:3000/api';

// Convert initial data to the correct types
const convertGroup = (group: typeof initialGroups[0]): MenuGroup => ({
  ...group,
  name: typeof group.name === 'object' ? group.name.pt : group.name,
  description: typeof group.description === 'object' ? group.description.pt : group.description,
  order: group.order || 0,
});

const convertMenuItem = (item: typeof initialMenuItems[0]): MenuItem => ({
  ...item,
  name: typeof item.name === 'object' ? item.name.pt : item.name,
  description: typeof item.description === 'object' ? item.description.pt : item.description,
  group: convertGroup(item.group),
  order: item.order || 0,
});

const convertedGroups = initialGroups.map(convertGroup);
const convertedMenuItems = initialMenuItems.map(convertMenuItem);

export const menuService = {
  // Groups
  async getGroups(): Promise<MenuGroup[]> {
    if (IS_PRODUCTION) {
      return Promise.resolve(convertedGroups);
    }
    
    try {
      const response = await fetch(`${API_URL}/groups`);
      if (!response.ok) throw new Error('Erro ao buscar grupos');
      return response.json();
    } catch (error) {
      console.warn('Fallback to static data:', error);
      return convertedGroups;
    }
  },

  async createGroup(group: Omit<MenuGroup, 'id'>): Promise<MenuGroup> {
    if (IS_PRODUCTION) {
      throw new Error('Operação não permitida em produção');
    }
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
    if (IS_PRODUCTION) {
      throw new Error('Operação não permitida em produção');
    }
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
    if (IS_PRODUCTION) {
      throw new Error('Operação não permitida em produção');
    }
    const response = await fetch(`${API_URL}/groups/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Erro ao excluir grupo');
    return response.json();
  },

  // Items
  async getItems(): Promise<MenuItem[]> {
    if (IS_PRODUCTION) {
      return Promise.resolve(convertedMenuItems);
    }
    
    try {
      const response = await fetch(`${API_URL}/items`);
      if (!response.ok) throw new Error('Erro ao buscar itens');
      return response.json();
    } catch (error) {
      console.warn('Fallback to static data:', error);
      return convertedMenuItems;
    }
  },

  async createItem(item: Omit<MenuItem, 'id'>): Promise<MenuItem> {
    if (IS_PRODUCTION) {
      throw new Error('Operação não permitida em produção');
    }
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
    if (IS_PRODUCTION) {
      throw new Error('Operação não permitida em produção');
    }
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
    if (IS_PRODUCTION) {
      throw new Error('Operação não permitida em produção');
    }
    const response = await fetch(`${API_URL}/items/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Erro ao excluir item');
    return response.json();
  },
};
