day = 23;
month = "June";
year = 1999;

step1 = year % 100;
step2 = parseInt(step1/4);
step3 = step2 + step1;
if(month == "Jan") {
} else{
    switch(month){
        case "June":
            step4 = 4; 
    }
    step6 = step4 + step3;
    step7 = day + step6;
    
}
step8 = (typeof step5 !== 'undefined') ? step5 : step7;
    //check if leap year
isLeapYear = ((year % 4 == 0) && (year % 100 !== 0) && (year % 400 == 0));

if(parseInt(year/100) == 19) {
    // 1900's path

}
else{
    // 2000's path
}
step10 = step8 % 7;
if(step10 == 0) {
    dow = 'Wednesday'
}

console.log(step10)