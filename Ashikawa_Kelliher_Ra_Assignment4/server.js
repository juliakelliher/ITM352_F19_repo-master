//A working server using express
//Used similar server base from Kelliher and Ashikawas Assignment2 Lab14

var fs = require('fs');
var express = require('express');// requiring the server to use express
var app = express();//Run the express function and start express
var myParser = require("body-parser");
var querystring = require('querystring');
var filename = 'user_data.json';//Pulling the user data from JSON file to ceate a working login and registration

app.use(myParser.urlencoded({ extended: true }));// to allow us to use request.body


if (fs.existsSync(filename)) { //only loads if its true 
    stats = fs.statSync(filename); // gets stats from file

    console.log(filename + ' has ' + stats.size + ' characters');// logs in the console how many charecters we have in out user_data.JSON file

    data = fs.readFileSync(filename, 'utf-8');// opens filename and named it data

    users_reg_data = JSON.parse(data);//makes it a return value and use JSON.parse to change to an object and name it user_reg_data

} else {// if it is falls...
    console.log(filename + ' does not exist!');// logs that the file doesn't exist
}



//makes the user go to our play button page if login data is true, if false redirects users to another login page that states which one they got wrong (Username or password)
app.post("/logUserin", function (request, response) {
    // Process login form POST and redirect to playbutton page if ok, redirect back to incorrect login form if not
    console.log(request.body);   //Diagnostic
 
    the_username = request.body.username;//asking for the username from the JSON file
    
    if (typeof users_reg_data[the_username] != 'undefined') {//Asking object if it has matching username, if it doesnt itll be undefined.
    
    }else{  // if username is incorrect... 
       
        response.redirect('./incorrectUsername.html');//redirects the user to a re-attempt login page that says wrong username
    }
  
      if (users_reg_data[the_username].password == request.body.password) {//Checks to see if the password is exactly the same
        
        response.redirect('playbutton.html');//If username and password is true, redirects user to playbutton
        
      } else {//If password is wrong...
      
        response.redirect('./incorrectPassword.html');//Redirects user to another re-attempt login page that states wrong password try again

      }
      
     
    
  });


//function for the registration form once "New user" is pressed
  app.post("/registerMember", function (req, res) { 
      // function allows user to register through POST and if the registration is no good it alerts and redirects back.
   
    qstr = req.body; 
    console.log(qstr);
   
  
    
    var errors = []; //assume no errors at first,
  
  //To specify that you can use letters and space, but nothing else
    if (/^[a-zA-Z_]+( [a-zA-Z_]+)*$/.test(req.body.name)) {//checks to see if all charecters are corrrect
    }
    else {//if there are any invalid charecters it will oush it into a query
      errors.push('Invalid characters, only use letters for name!')
    }
    
    // length of full name is between 0 and 25 
    if ((req.body.name.length > 25 && req.body.name.length <0)) {
      errors.push('Full Name Too Long') //if more than 25 letters push errors
    }
    
    
    
    //checks to see if username already exists
    var reguser = qstr.username.toLowerCase(); //makes it not case sensitive 
    if (typeof users_reg_data[reguser] != 'undefined') { //if checks to see if username is already exists in JSON file
      errors.push('Username taken')// if username does exist gives pushes to errors
    }

    //validating username 
    if (/^[0-9a-zA-Z]+$/.test(req.body.username)) { //Check letters and numbers only
    }
    else {//if there are anythings else...
      errors.push('Please only use letters and numbers for username, no spaces between them!')//pushes message to errors
    }
    if ((req.body.username.length < 5 && req.body.username.length > 20)) {//checks to see if username has more than 5 letters but less than 20
      errors.push('username must be between 5 and 20 characters')//if it doesn't meet the criteria push message to errors
    }
  //validating password 
    if ((req.body.password.length < 5)) { //password is min 5 characters long 
      errors.push('Password must be longer than 5 characters')//if password is shorter than 5 letters push message to errrors
    }
    // check to see if passwords match
    if (req.body.password !== req.body.passConfirm) { 
      errors.push('Passwords do not match!')//if new users password doesn't match push to errors
    }
  
    
  

//if the errors query length is 0, meaning no errors, it will console log new user updted and create a new file into user_data.JSON
    if (errors == 0) {
        users_reg_data[reguser] = {};
        users_reg_data[reguser].name = qstr.username;
        users_reg_data[reguser].password = qstr.password;
        users_reg_data[reguser].email = qstr.email;
        console.log(users_reg_data[reguser], "New User Updated");

        fs.writeFileSync(filename, JSON.stringify(users_reg_data));

res.redirect('./playbutton.html?' + querystring.stringify(req.query))
  
    }
    if (errors.length > 0) { //If errors qeury length is more than 0 it will log what the errors is and send it to register.html for the alert box function in there
      console.log(errors) //logs all the errors into console 
      req.query.name = req.body.name;
      req.query.username = req.body.username;
      req.query.password = req.body.password;
      req.query.confirmpsw = req.body.confirmpsw;
      req.query.email = req.body.email;
  
      req.query.errors = errors.join(';');//joins the errors into one query
      res.redirect('./register.html?' + querystring.stringify(req.query)) 
    }
  
    //add errors to querystring
  
  }

  );
  

app.use(express.static('./public'));//creats a static server with express that uses the public directory
app.listen(8080, () => console.log(`listening on port 8080`));// makes the server listen on port 8080