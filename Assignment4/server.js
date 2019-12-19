var fs = require('fs');
var express = require('express');
var app = express();
var myParser = require("body-parser");
var querystring = require('querystring');

app.use(myParser.urlencoded({ extended: true }));
var filename = 'user_data.json';

if (fs.existsSync(filename)) {
    stats = fs.statSync(filename);

    console.log(filename + ' has ' + stats.size + ' characters');

    data = fs.readFileSync(filename, 'utf-8');

    users_reg_data = JSON.parse(data);

} else {
    console.log(filename + ' does not exist!');
}




app.post("/logUserin", function (request, response) {
    // Process login form POST and redirect to logged in page if ok, back to login page if not
    console.log(request.body);
    //Diagnostic
    the_username = request.body.username;
    if (typeof users_reg_data[the_username] != 'undefined') {    //Asking object if it has matching username, if it doesnt itll be undefined.
    }else{
        response.redirect('./incorrectUsername.html');
    }
  
      if (users_reg_data[the_username].password == request.body.password) {
        response.redirect('playbutton.html');
        //Redirect them to play button here if they logged in correctly
      } else {
      
        response.redirect('./incorrectPassword.html');
      }
      
     
    
  });



  app.post("/registerMember", function (req, res) { 
    qstr = req.body;
    console.log(qstr);
   
  
    
    var errors = []; //assume no errors at first,
  
    //name contains only letters 
    if (/^[a-zA-Z0-9_]+( [a-zA-Z0-9_]+)*$/.test(req.body.name)) {
    }
    else {
      errors.push('Invalid character, only use letters for name!')
    }
    
    // length of full name is between 0 and 25 
    if ((req.body.name.length > 25 && req.body.name.length <0)) {
      errors.push('Full Name Too Long')
    }
    
    
    
    //checks to see if username already exists
  
    var reguser = qstr.username.toLowerCase(); 
    if (typeof users_reg_data[reguser] != 'undefined') { 
      errors.push('Username taken')
    }
    //validating username 
    //Check letters and numbers only
    
    if (/^[0-9a-zA-Z]+$/.test(req.body.username)) {
    }
    else {
      errors.push('Please only use letters and numbers for username no spaaces between them!')
    }
    if ((req.body.username.length < 5 && req.body.username.length > 20)) {
      errors.push('username must be between 5 and 20 characters')
    }
  //validating password 
    //password is min 6 characters long 
    if ((req.body.password.length < 5)) {
      errors.push('Password must be longer than 5 characters')
    }
    // check to see if passwords match
    if (req.body.password !== req.body.passConfirm) { 
      errors.push('Passwords do not match!')
    }
  
    
  


    if (errors == 0) {
        users_reg_data[reguser] = {};
        users_reg_data[reguser].name = qstr.username;
        users_reg_data[reguser].password = qstr.password;
        users_reg_data[reguser].email = qstr.email;
        console.log(users_reg_data[reguser], "New User Updated");

        fs.writeFileSync(filename, JSON.stringify(users_reg_data));

res.redirect('./playbutton.html?' + querystring.stringify(req.query))
  
    }
    if (errors.length > 0) {
      console.log(errors)
      req.query.name = req.body.name;
      req.query.username = req.body.username;
      req.query.password = req.body.password;
      req.query.confirmpsw = req.body.confirmpsw;
      req.query.email = req.body.email;
  
      req.query.errors = errors.join(';');
      res.redirect('./register.html?' + querystring.stringify(req.query)) 
    }
  
    //add errors to querystring
  
  }

  );
  

app.use(express.static('./public'));
app.listen(8080, () => console.log(`listening on port 8080`));