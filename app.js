const express = require("express");
const bodyParser = require("body-parser");
const { urlencoded } = require("body-parser");
const https = require("https")
const dotenv = require("dotenv").config();
const api_key = process.env.MAILCHIMP_API;
const list_id = process.env.LIST_ID;

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
    const jsonData = JSON.stringify(data)

    const url = `https://us1.api.mailchimp.com/3.0/lists/${list_id}`

    const options = {
        method: "POST",
        auth: `wayne1:${api_key}`
    }

    //create const that contains all the data above and send to MailChimp
    //use https, get response from MailChimp server
    const request = https.request(url, options, function (response) {

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/sucess.html");
            // console.log("Environment Variables:");
            // console.log(process.env.MAILCHIMP_API);

        } else {
            res.sendFile(__dirname + "/failure.html");
        }


        response.on("data", function (data) {
            console.log(JSON.parse(data));
        })

    })

    request.write(jsonData);
    request.end();

})

app.post("/failure", function (req, res) {

    res.redirect("/");
})


let port = process.env.PORT
if( port == null || port == ""){
    port = 3000;
}


app.listen(port , function () {
    console.log("Server is up and running at port "+ port + " successfully")
})



