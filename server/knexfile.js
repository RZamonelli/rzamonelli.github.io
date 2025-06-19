module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './database.sqlite'
    },
    migrations: {
      directory: './migrations'
    },
    useNullAsDefault: true
  }
};
