
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https")

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html");
})

app.post("/", function(req, res) {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merged_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }

    var jsonData = JSON.stringify(data);

    const url = "https://us21.api.mailchimp.com/3.0/lists/a89f83a496";

    const options = {
        method: "POST",
        auth: "jake21:bf346780a4d0ffa5530f77c82bd1b921-us21"
    }

    const request = https.request(url, options, function(response) {

        console.log("Status code: " + response.error_code);
        if(response.statusCode == 200) {
            res.sendFile(__dirname + "/failure.html");
        }
        else {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function(data) {
            const responseData = JSON.parse(data);
            const error = responseData.errors[0].error_code;
            console.log("Error: " + error);
            if(error == "ERROR_CONTACT_EXISTS") {
                res.sendFile(__dirname + "/failure.html");
            }
        })

    });

    request.write(jsonData);
    request.end();
})

app.post("/failure", function(req, res) {
    res.redirect("/");
})

app.listen(process.env.PORT || 3000, function(req, res) {
    console.log("Listening on port 3000");
})

// Audience/List ID: a89f83a496

/*
API Key: bf346780a4d0ffa5530f77c82bd1b921-us21
*/