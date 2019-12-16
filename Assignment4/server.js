//Creating a server via express//
var data = require('./public/tetris.js'); //get the data from product_data.js
var express = require('express'); //Server requires express to run//
var app = express(); //Run the express function and start express//
var myParser = require("body-parser");
var cookieParser = require('cookie-parser');

app.use(cookieParser());

app.all('*', function (request, response, next) {
  console.log(request.method + ' to ' + request.path)
  next();
});

fs = require('fs');
var filename = 'user_data.json';
//Better to use variable because its more flexible for when things change

if (fs.existsSync(filename)) {
  //Checks to see if file exists. Goes to check and returns boolean true if path exists or false. Use sync so that it doesnt go off and do the next thing before doing what you need to do.

  stats = fs.statSync(filename);
  //Allows you to get certain information about your file.

  console.log(filename + ' has ' + stats.size + ' characters');

  data = fs.readFileSync(filename, 'utf-8');
  //Asynchronous by nature, once you call it it goes off and runs on its own. readFileSync reads file, waits till its read, returns back with stuff in file and then continues with code. (Blocking function) Set what you get back to data.

  console.log(typeof data);
  //Read file and saved it as a string.

  users_reg_data = JSON.parse(data);
  //Takes string and converts it into an object.


  //Adds another user to user_reg_data, but its stuck in memory, needs to be saved into file

  username = 'newuser';
  users_reg_data[username] = {};
  users_reg_data[username].username = 'newpass1';
  users_reg_data[username].password = 'newpass';
  users_reg_data[username].email = 'newuser@user.com';


  //Turns it into a JSON string in the file so it can be saved in that file and used again.
  fs.writeFileSync(filename, JSON.stringify(users_reg_data));

  console.log(users_reg_data);
  //As long as usernames are identifiers you can use dot notation. Has to follow identifier rules
} else {
  console.log(filename + ' does not exist!');
}

//When we get here we want to have the user registration data already 
//If server gets a GET request to login it will get this code. 

app.get("/login", function (request, response) {
  // Give a simple login form
  str = `
  <body>

  <h1>Tetris Login</h1> 
  <p>To play you must be a member<br> Login or Register as Player 1</p> <!--Login for player 1-->
  <link rel="stylesheet" href="login_style.css">
  <form name="login for player 1" method="POST">
      <div class="w3-card-4">
      <div class="w3-container w3-gray">
         <h2>Login</h2>
         </div>
  <form class="w3-container">
      <label>First Name</label>
      <input class="w3-input" type="text">
      <label>Last Name</label>
      <input class="w3-input" type="text">
  </form>
      </div>
  </form>
  <script>
      login.action = "./login.html" + document.location.search;
  </script>
</body>
    `;
  response.send(str);
});

app.post("/login", function (request, response) {
  // Process login form POST and redirect to logged in page if ok, back to login page if not
  console.log(request.body);
  //Diagnostic
  the_username = request.body.username;
  if (typeof users_reg_data[the_username] != 'undefined') {
    //Asking object if it has matching username, if it doesnt itll be undefined.
    if (users_reg_data[the_username].password == request.body.password) {
      response.send(the_username + " Logged In!");
      //Redirect them to invoice here if they logged in correctly
    } else {
      response.redirect('/login');
    }
    //Sees if password matches what was typed
  }
});

//Creates registration form

app.get("/register", function (request, response) {
  // Give a simple register form
  str = `
  <body>
    <div>
        <form method="POST" action="" name="Register">
            <input type="text" name="fullname" size="40" pattern="[a-zA-Z]+[ ]+[a-zA-Z]+"
                placeholder="Enter First & Last Name"><br />
            <input type="text" name="username" size="40" pattern=".[a-z0-9]{3,10}" required
                title="Minimum 4 Characters, Maximum 10 Characters, Numbers/Letters Only"
                placeholder="Enter Username"><br />
            <input type="email" name="email" size="40" placeholder="Enter Email"
                pattern="[a-z0-9._]+@[a-z0-9]+\.[a-z]{3,}$" required title="Please enter valid email."><br />
            <input type="password" id="password" name="password" size="40" pattern=".{8,}" required
                title="8 Characters Minimum" placeholder="Enter Password"><br />
            <input type="password" id="repeat_password" name="repeat_password" size="40" pattern=".{8,}" required
                title="8 Characters Minimum" placeholder="Repeat Password"><br />

            <input type="submit" value="Register" id="submit">
        </form>
        <script>
            Register.action = "./register.html" + document.location.search;
        </script>
    </div>
</body>
    `;
  response.send(str);
});

app.post("/register", function (request, response) {
  // process a simple register form

  //Validate: User must not exist already, case sensitive,password certain length with certain characters, email is email

  //Save new user to file name (users_reg_data)
  username = request.body.username;

  //Checks to see if username already exists
  errors = [];
  //If array stays empty move on
  if (typeof users_reg_data[username] != 'undefined') {
    errors.push("Username is Taken");
  }
  console.log(errors, users_reg_data);
  if (errors.length == 0) {
    users_reg_data[username] = {};
    users_reg_data[username].password = request.body.password;
    users_reg_data[username].email = request.body.email;

    fs.writeFileSync(filename, JSON.stringify(users_reg_data));

    response.redirect("/login");
  } else {
    response.redirect("/register");
  }

});

app.use(express.static('./public')); //Creates a static server using express from the public folder
app.listen(8080, () => console.log(`listen on port 8080`))