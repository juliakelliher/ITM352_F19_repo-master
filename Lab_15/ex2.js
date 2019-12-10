var express = require('express');
var app = express();
var myParser = require("body-parser");
var fs = require('fs');
var filename = 'user_data.json';
var cookieParser = require('cookie-parser');
var session = require('express-session');


app.use(session({secret: "ITM352 rocks!"}));

app.use(cookieParser());

app.get('/use_session',function (request, response) {
   response.send(`welcome, your session ID is ${request.session.id}`)
});

app.get('/set_cookie',function (request, response) {
    response.cookie('myname', 'Justin Ra', {maxAge: 5000}).send('cookie set');
});

app.get('/use_cookie',function (request, response) {
    output = "no cookie with my name"
    if(typeof request.cookies.myname != 'undefined') {
    output = `Welcome to the Use Cookie page ${request.cookies.myname}`
    }
    response.send(output);
});

app.use(myParser.urlencoded({ extended: true }));

if (fs.existsSync(filename)) {
    data = fs.readFileSync(filename, 'utf-8');

    stats = fs.statSync(filename)
    console.log(filename + ' has ' + stats.size + ' characters');

    users_reg_data = JSON.parse(data); // Takes a string and converts it into object or array

    username = 'newuser';
    users_reg_data[username] = {};
    users_reg_data[username].password = 'newpass';
    users_reg_data[username].email = 'newuser@user.com';

    fs.writeFileSync(filename, JSON.stringify(users_reg_data));

    console.log(users_reg_data);
} else {
    console.log(filename + ' does not exist!');
}


// CHANGE to Login HTML
app.get("/login", function (request, response) {
    if(typeof request.cookies.username != 'undefined') {
        response.send(`Welcome back ${request.cookies.username}` + '<br>' +
        `you last logged in on ${request.session.last_login}`);
        return;
    }
    // Give a simple login form
    str = `
        <body>
        <form action="" method="POST">
        <input type="text" name="username" size="40" placeholder="enter username" ><br />
        <input type="password" name="password" size="40" placeholder="enter password"><br />
        <input type="submit" value="Submit" id="submit">
        </form>
        </body>
    `;
    response.send(str);
});

// CHANGE to Login HTML
app.post("/login", function (request, response) {
   
    // Process login form POST and redirect to logged in page if ok, back to login page if not
    console.log(request.body);
    // Checks if username exists already USE FOR LOGIN CHECK
    the_username = request.body.username;
    if (typeof users_reg_data[the_username] != 'undefined') {
        if (users_reg_data[the_username].password == request.body.password) {
            //response.send(the_username + ' logged in!'); // REDIRECT to Invoice HTML
           msg = '';
            if(typeof request.session.last_login != 'undefined'){
                var msg = `you last logged in on ${request.session.last_login}`;
                var now = new Date();
            }else{
                now = 'first login!';
            }
            request.session.last_login = now;
            response
                .cookie('username', the_username,{maxAge: 10*1000})
                .send(msg + '<br>' +`${the_username} is logged in at ${now}`)
            
        } else {
            response.redirect('/login'); //REDIRECT to Login HTML
        }
    }
});

// Part of Exercise 4
// CHANGE to Register HTML
app.get("/register", function (request, response) {
    // Give a simple register form
    str = `
        <body>
        <form action="" method="POST">
        <input type="text" name="username" size="40" placeholder="enter username" ><br />
        <input type="password" name="password" size="40" placeholder="enter password"><br />
        <input type="password" name="repeat_password" size="40" placeholder="enter password again"><br />
        <input type="email" name="email" size="40" placeholder="enter email"><br />
        <input type="submit" value="Submit" id="submit">
        </form>
        </body>
    `;
    response.send(str);
});

app.post("/register", function (request, response) {
    // process a simple register form

    //validate registration data

    //all good so save the new user
    username = request.body.username;
    users_reg_data[username] = {};
    users_reg_data[username].password = request.body.password;
    users_reg_data[username].email = request.body.email;

    fs.writeFileSync(filename, JSON.stringify(users_reg_data));
    
    response.send(`${username} registered!`);
});

app.listen(8080, () => console.log(`listening on port 8080`));