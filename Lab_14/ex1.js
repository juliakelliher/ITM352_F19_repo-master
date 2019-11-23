fs = require('fs');

var filename = 'user_data.json';

data = fs.readFileSync(filename, 'utf-8');

users_reg_data = JSON.parse(data);

console.log(users_reg_data);