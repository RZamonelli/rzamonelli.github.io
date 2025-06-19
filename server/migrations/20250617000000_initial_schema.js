exports.up = function(knex) {
  return knex.schema
    .createTable('menu_groups', function(table) {
      table.increments('id');
      table.string('name').notNullable();
      table.string('description').notNullable();
      table.string('emoji').notNullable();
      table.integer('order').notNullable();
      table.timestamps(true, true);
    })
    .createTable('menu_items', function(table) {
      table.increments('id');
      table.string('name').notNullable();
      table.text('description').notNullable();
      table.boolean('is_available').notNullable().defaultTo(true);
      table.string('image');
      table.integer('order').notNullable();
      table.integer('group_id').unsigned().notNullable();
      table.foreign('group_id').references('menu_groups.id');
      table.timestamps(true, true);
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTable('menu_items')
    .dropTable('menu_groups');
};
