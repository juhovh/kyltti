var sqlite3 = require('sqlite3');
var fs = require('fs');
var _ = require('underscore');

var dbname = process.argv[2];
var dumpname = process.argv[3];

if (typeof(dbname) !== 'string') {
  console.log('Please give a database file as the first argument');
  process.exit(1);
}

if (typeof(dumpname) !== 'string') {
  console.log('Please give a database dump file as the second argument');
  process.exit(1);
}

if (!fs.existsSync(dbname)) {
  console.log('Provided database file "' + dbname + '" does not exist');
  process.exit(1);
}

if (!fs.existsSync(dumpname)) {
  console.log('Provided database dump file "' + dumpname + '" does not exist');
  process.exit(1);
}

var db = new sqlite3.Database(dbname, sqlite3.OPEN_READWRITE, function(err) {
  if (err) {
    console.log('Opening database file "' + dbname + '" failed');
    process.exit(1);
  }
  var data;
  try {
    data = fs.readFileSync(dumpname, 'utf-8');
  } catch (e) {
    console.log('Reading database dump file "' + dumpname + '" failed');
    process.exit(1);
  }
  insertOriginalDump(db, data);
});

function getTableValues(data, tablename) {
  var stringRegex = "'([^\\\\']|\\\\.)*'";
  var numberRegex = "\\d+";
  var fieldRegex = "("+stringRegex+"|"+numberRegex+")";
  var rowRegex = "\\("+fieldRegex+"(,"+fieldRegex+")*\\)";
  var valuesRegex = rowRegex+"(,"+rowRegex+")*";
  var fullRegex = "INSERT INTO `"+tablename+"` VALUES ("+valuesRegex+");";
  var match = data.match(new RegExp(fullRegex));
  if (match) {
    var rows = match[1].match(new RegExp(rowRegex, 'g'));
    return _.map(rows, function(row) {
      var fields = row.match(new RegExp(fieldRegex, 'g'));
      return _.map(fields, function(field) {
        if (field.match(new RegExp(stringRegex))) {
          return field.substring(1, field.length-1);
        } else {
          return field;
        }
      });
    });
  }
}

function insertOriginalDump(db, data) {
  var kuvat = getTableValues(data, "kuvat");
  var message = getTableValues(data, "message");
  var palaute = getTableValues(data, "palaute");
  var user = getTableValues(data, "user");
  var vastaus = getTableValues(data, "vastaus");
}
