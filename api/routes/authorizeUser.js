var express = require("express");
var router = express.Router();
var fetch = require("node-fetch");
var querystring = require("querystring");
var encodeFormData = require("../helpers/encodeFormData");
// handle user login process
//user logs in
router.get("/login", async (req, res) => {
  let scopes = "user-read-private user-read-email";
  res.redirect(
    `https://accounts.spotify.com/authorize?client_id=${process.env.CLIENT_ID}&response_type=code&redirect_uri=${process.env.REDIRECT_URI}&scope=${scopes}&show_dialog=true`
  );
});

//user accept or denies the login
router.get("/logged", async (req, res) => {
  console.log("working");
  //body to be URLencoded
  let body = {
    grant_type: "authorization_code",
    code: req.query.code,
    redirect_uri: process.env.REDIRECT_URI,
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
  };
  console.log(body);
  //fetch for access and refresh token for user
  await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: encodeFormData(body),
  })
    .then((resp) => resp.json())
    .then((data) => {
      let query = querystring.stringify(data);
      res.redirect(`http://localhost:3000/${query}`);
    });
});
module.exports = router;
