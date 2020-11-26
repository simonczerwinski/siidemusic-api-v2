const { response } = require("express");
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
router.get("/userAuth", async (req, res) => {
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
      res.redirect(`http://localhost:3000/?${query}`);
    });
});

// gives access token for user data
router.get("/getUser/:token", async(req, res)=>{
  await fetch("https:api.spotify.com/v1/me", {
    headers: {
      "Authorization": `Bearer ${req.params.token}`
    }
  })
  .then(resp => resp.json())
  .then(data=> {
    userID = data.id;
    req.json(data);
  })
});

// get all playlists
router.get("/playlists/:token", async(req, res)=>{
  await fetch("https:api.spotify.com/v1/me/playlists", {
    headers: {
      "Authorization": `Bearer ${req.params.token}`
    }
  })
  .then(resp => resp.json())
  .then(data => res.json(data));
});

// MAKE SEARCH ENDPOINT/
router.post("/search/:token", async(req, res)=>{
  //split up the body so it can be encoded in the query
  let unchangedQueryBody = req.body.message.split(" ");
  let changedQueryBody = unchangedQueryBody.join("%20");
  fetch(`https:api.spotify.com/search?q=${changedQueryBody}&type=artist,track`, {
    headers: {
      "Authorization": `Bearer ${req.params.token}`
    }
  })
  .then(resp => resp.json())
  .then(data => res.json(data));
});


module.exports = router;
