const express = require("express");
const bodyParser = require("body-parser");
const { urlencoded } = require("body-parser");
const https = require("https")


const app = express();
app.use(bodyParser.urlencoded({ extended: true }))


app.get("/", function (req, res) {

    res.sendFile(__dirname + "/index.html")
})

app.post("/", function (req, res) {

    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    console.log(firstName + lastName + email)
    //JS object
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    //turn JS object into JSON
    const jsonData = JSON.stringify(data);

    const url = 'https://us[x].api.mailchimp.com/3.0/lists/[list-id]'

    const options = {
        method: "POST",
        auth: [MailChimp-API-Key]
    }

    //create const that contains all the data above and send to MailChimp
    //use https, get response from MailChimp server
    const request = https.request(url, options, function (response) {
        
        if(response.statusCode === 200){
            res.sendFile(__dirname +"/sucess.html");

        }else{
            res.sendFile(__dirname + "/failure.html");

        }
        
        
        response.on("data", function (data) {
            console.log(JSON.parse(data));
        })

    })

    request.write(jsonData);
    request.end();

})

app.post("/failure", function(req, res){

    res.redirect("/");
})

//process.env.PORT, dynamic port for web hosting
app.listen(process.env.PORT || 3000, function () {

    console.log("Server is up and running at port " + process.env.PORT)
})


