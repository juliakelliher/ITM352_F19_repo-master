fs = require('fs');

var filename = 'user_data.json';

//this will check to see if file exists, might as well use if statement
if (fs.existsSync(filename)) {
    stats = fs.statSync(filename);

    console.log(filename + 'has' + stats.size + 'characters');

data = fs.readFileSync(filename, 'utf-8');

users_reg_data = JSON.parse(data);

console.log(users_reg_data);
} else {
    console.log(filename + `does not exist!`);
}