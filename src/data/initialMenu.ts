import { createMenuItem, createMenuGroup } from '../utils/translation';

// Define groups
export const initialGroups = [
  createMenuGroup(
    'basics',
    '🥣',
    'Básicos',
    'Pratos que abraçam, confortam e nunca decepcionam.',
    1
  ),
];

// Define menu items
export const initialMenuItems = [
  createMenuItem(
    'rice-beans-steak',
    'Arroz, feijão e bife acebolado',
    'O clássico almoço brasileiro com arroz soltinho, feijão cremoso e bife acebolado suculento.',
    25.90,
    'basics',
    '🥣',
    'Básicos',
    'Pratos que abraçam, confortam e nunca decepcionam.',
    true,
    undefined,
    1
  ),
  createMenuItem(
    'garlic-pasta',
    'Macarrão ao alho e óleo',
    'Massa italiana al dente com azeite extra virgem e alho dourado.',
    22.90,
    'basics',
    '🥣',
    'Básicos',
    'Pratos que abraçam, confortam e nunca decepcionam.',
    true,
    undefined,
    2
  ),
  createMenuItem(
    'cheese-omelet',
    'Omelete de queijo com pão na chapa',
    'Omelete fofinho recheado com queijo derretido, acompanhado de pão na chapa crocante.',
    18.90,
    'basics',
    '🥣',
    'Básicos',
    'Pratos que abraçam, confortam e nunca decepcionam.',
    true,
    undefined,
    3
  ),
  createMenuItem(
    'grandmas-soup',
    'Sopa de legumes da vovó',
    'Sopa caseira com legumes frescos e macarrão, feita com muito carinho.',
    19.90,
    'basics',
    '🥣',
    'Básicos',
    'Pratos que abraçam, confortam e nunca decepcionam.',
    true,
    undefined,
    4
  ),
];
