const express = require('express');
const cors = require('cors');
const knex = require('knex');
const knexConfig = require('./knexfile');

const app = express();
const db = knex(knexConfig.development);

app.use(cors());
app.use(express.json());

// Rotas para grupos
app.get('/api/groups', async (req, res) => {
  try {
    const groups = await db('menu_groups').orderBy('order');
    res.json(groups);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar grupos' });
  }
});

app.post('/api/groups', async (req, res) => {
  try {
    const [id] = await db('menu_groups').insert(req.body);
    const group = await db('menu_groups').where({ id }).first();
    res.json(group);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar grupo' });
  }
});

app.put('/api/groups/:id', async (req, res) => {
  try {
    await db('menu_groups').where({ id: req.params.id }).update(req.body);
    const group = await db('menu_groups').where({ id: req.params.id }).first();
    res.json(group);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar grupo' });
  }
});

app.delete('/api/groups/:id', async (req, res) => {
  try {
    // Verificar se existem itens usando este grupo
    const items = await db('menu_items').where({ group_id: req.params.id });
    if (items.length > 0) {
      return res.status(400).json({ 
        error: 'Não é possível excluir um grupo que contém itens' 
      });
    }

    await db('menu_groups').where({ id: req.params.id }).delete();
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao excluir grupo' });
  }
});

// Rotas para itens
app.get('/api/items', async (req, res) => {
  try {
    const items = await db('menu_items')
      .join('menu_groups', 'menu_items.group_id', '=', 'menu_groups.id')
      .select(
        'menu_items.*',
        'menu_groups.emoji as group_emoji',
        'menu_groups.name as group_name',
        'menu_groups.description as group_description'
      )
      .orderBy('menu_items.order');
    
    // Formatar os itens para manter a estrutura atual
    const formattedItems = items.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description,
      isAvailable: item.is_available,
      image: item.image,
      order: item.order,
      group: {
        id: item.group_id,
        emoji: item.group_emoji,
        name: item.group_name,
        description: item.group_description
      }
    }));

    res.json(formattedItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar itens' });
  }
});

app.post('/api/items', async (req, res) => {
  try {
    const itemData = {
      name: req.body.name,
      description: req.body.description,
      is_available: req.body.isAvailable,
      image: req.body.image,
      order: req.body.order,
      group_id: req.body.group.id
    };

    const [id] = await db('menu_items').insert(itemData);
    const item = await db('menu_items')
      .join('menu_groups', 'menu_items.group_id', '=', 'menu_groups.id')
      .where('menu_items.id', id)
      .first();

    res.json({
      id: item.id,
      name: item.name,
      description: item.description,
      isAvailable: item.is_available,
      image: item.image,
      order: item.order,
      group: {
        id: item.group_id,
        emoji: item.emoji,
        name: item.name,
        description: item.description
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar item' });
  }
});

app.put('/api/items/:id', async (req, res) => {
  try {
    const itemData = {
      name: req.body.name,
      description: req.body.description,
      is_available: req.body.isAvailable,
      image: req.body.image,
      order: req.body.order,
      group_id: req.body.group.id
    };

    await db('menu_items').where({ id: req.params.id }).update(itemData);
    const item = await db('menu_items')
      .join('menu_groups', 'menu_items.group_id', '=', 'menu_groups.id')
      .where('menu_items.id', req.params.id)
      .first();

    res.json({
      id: item.id,
      name: item.name,
      description: item.description,
      isAvailable: item.is_available,
      image: item.image,
      order: item.order,
      group: {
        id: item.group_id,
        emoji: item.emoji,
        name: item.name,
        description: item.description
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar item' });
  }
});

app.delete('/api/items/:id', async (req, res) => {
  try {
    await db('menu_items').where({ id: req.params.id }).delete();
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao excluir item' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
