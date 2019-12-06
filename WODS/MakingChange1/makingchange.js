amount = 175;

quarters = parseInt(amount/25);
postQuarters = amount%25;
dimes = parseInt(amount/10);
postDimes = postQuarters%10;
nickels = parseInt(postDimes/5);
postNickels = postDimes%5;
pennies = parseInt(postNickels);
console.log ('For'+amount+'cents,'+quarters+'quarters,'+dimes+'dimes,'+nickels+'nickels'+pennies+'pennies')
