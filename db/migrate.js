var passwordHash = require('password-hash');
var fs = require('fs');
var _ = require('underscore');

var dumpname = process.argv[2];

if (typeof(dumpname) !== 'string') {
  console.log('Please give a database dump file as the second argument');
  process.exit(1);
}

if (!fs.existsSync(dumpname)) {
  console.log('Provided database dump file "' + dumpname + '" does not exist');
  process.exit(1);
}

var data;
try {
  data = fs.readFileSync(dumpname, 'utf-8');
} catch (e) {
  console.log('Reading database dump file "' + dumpname + '" failed');
  process.exit(1);
}
insertOriginalDump(data);




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
          return field.replace(/\\'/g, "''").replace(/\\"/g, "\"");
        } else {
          return field;
        }
      });
    });
  }
}

function generateGroups(kuvat) {
  var groups = _.groupBy(kuvat, function(arr) { return arr[0]; });
  return _.map(groups, function(value, key) {
    var match = value[0][1].match(new RegExp("^'(.*)\\d+'$"))
    if (!match) {
      throw new Error("Invalid name: " + value[0][1]);
    }
    var prefix = "'"+match[1]+"'";
    return [key, prefix];
  });
}

function nameUpperCase(name) {
  name = name.slice(1, -1);

  // Convert first character to upper case
  name = name.charAt(0).toUpperCase() + name.slice(1);

  // If there are multiple words, convert all first characters to upper case
  var match;
  while (match = name.match(/(^|\s)[a-z]/)) {
    var matchidx = match.index === 0 ? match.index : match.index+1;
    name = name.slice(0, matchidx) + name.charAt(matchidx).toUpperCase() + name.slice(matchidx+1);
  }
  return "'"+name+"'";
}

function insertOriginalDump(data) {
  var users = getTableValues(data, "user");
  var kuvat = getTableValues(data, "kuvat");
  var message = getTableValues(data, "message");
  var palaute = getTableValues(data, "palaute");
  var vastaus = getTableValues(data, "vastaus");
  var groups = generateGroups(kuvat);

  console.log("BEGIN TRANSACTION;");
  _.each(users, function(user) {
    var password = user[1].slice(1, -1).replace(/''/g, "'");
    var hashed = passwordHash.generate(password, {algorithm: 'sha256', saltLength: 12});
    console.log("INSERT INTO `user` ('username','password') VALUES("+user[0]+",'"+hashed+"');");
  });
  _.each(groups, function(group) {
    var name = nameUpperCase(group[0]);
    console.log("INSERT INTO `group` ('name','prefix') VALUES ("+name+","+group[1]+");");
  });
  _.each(kuvat, function(photo) {
    var group_name = nameUpperCase(photo[0]);
    console.log("INSERT INTO `photo` ('group_id','name','description') VALUES ((SELECT id FROM `group` WHERE name = "+group_name+"),"+photo[1]+","+photo[2]+");");
  });
  _.each(message, function(comment) {
    if (comment[4] === "''") return;
    if (comment[4] === "'matkaan'") {
      console.log("INSERT INTO `comment` ('type','date','nick','message','deleted') VALUES ('matkaan',"+comment[2]+","+comment[3]+","+comment[1]+","+comment[7]+");");
    } else {
      console.log("INSERT INTO `comment` ('photo_id','date','nick','message','deleted') VALUES ((SELECT id FROM `photo` WHERE name = "+comment[4]+"),"+comment[2]+","+comment[3]+","+comment[1]+","+comment[7]+");");
    }
  });
  _.each(palaute, function(comment) {
    var response = _.find(vastaus, function(resp) { return resp[0] == comment[0]; });
    if (response) {
      console.log("INSERT INTO `comment` ('type','date','nick','message','deleted','response') VALUES ('palaute',"+comment[3]+","+comment[2]+","+comment[4]+","+(comment[5] != 0 ? "0" : "1")+","+response[1]+");");
    } else {
      console.log("INSERT INTO `comment` ('type','date','nick','message','deleted') VALUES ('palaute',"+comment[3]+","+comment[2]+","+comment[4]+","+(comment[5] != 0 ? "0" : "1")+");");
    }
  });
  console.log("COMMIT;");
}
