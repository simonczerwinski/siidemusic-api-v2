var express = require("express");
var router = express.Router();
var cors = require("cors");

router.get("/{id}", cors(), async (req, res) => {
  let body = {
    grant_type: "authorization_code",
    code: req.query.code,
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
  };

  try {
    const result = await fetch("https://api.spotify.com/v1/tracks/{id}", {
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: encodeURI(body),
    })
      .then((resp) => resp.json())
      .then((data) => {
        let query = data;
      });
    console.log(result);
    //   const json = await result.json();
    //   console.log(json);
    //   res.status(200).send(json);
  } catch (ex) {
    console.log(ex);
    res.status(500).send(ex.message);
  }
});
module.exports = router;
