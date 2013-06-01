var sqlite3 = require('sqlite3');

module.exports = new sqlite3.cached.Database('database.sqlite', sqlite3.READWRITE);
