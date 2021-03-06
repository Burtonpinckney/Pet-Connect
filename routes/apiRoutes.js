/* eslint camelcase: "off" */
var db = require("../models");
var axios = require("axios");
module.exports = function(app) {
  // Get all customers
  app.get("/api/customers", function(req, res) {
    db.customers.findAll().then(function(results) {
      res.json(results);
    });
  });

  // Create a new customers
  app.post("/api/customers", function(req, res) {
    db.customers
      .create({
        name: req.body.name,
        email: req.body.email,
        number: req.body.number
      })
      .then(function(results) {
        res.json(results);
      });
  });
  app.post("/api/animal", function(req, res) {
    var holder = req.body;
    // console.log(holder);
    var options = {
      method: "POST",
      data: {
        grant_type: "client_credentials",
        client_id: process.env.api_key,
        client_secret: process.env.api_secret
      },
      url: "https://api.petfinder.com/v2/oauth2/token"
    };
    axios(options)
      .then(function(token) {
        petCall(token.data.access_token);
      })
      .catch(function(err) {
        console.log(err);
      });
    function petCall(bearer) {
      console.log(bearer);
      var config = {
        headers: { Authorization: "Bearer " + bearer }
      };
      var coat = "";
      if (holder.q9 !== null) {
        coat = "&coat=" + holder.q9;
      }

      var urlID =
        "https://api.petfinder.com/v2/animals?limit=3&type=" +
        holder.type +
        "&location=" +
        holder.q1 +
        "&distance=" +
        parseInt(holder.q2) +
        "&age=" +
        holder.q4 +
        "&good_with_children=" +
        holder.q5 +
        "&good_with_dogs=" +
        holder.q6 +
        "&good_with_cats=" +
        holder.q7 +
        "&size=" +
        holder.q8 +
        coat;
      if (holder.q3 !== "unknown") {
        urlID += "&gender=" + holder.q3;
      }
      console.log(urlID);
      axios
        // .get("https://api.petfinder.com/v2/animals?type=dog&page=2", config)
        .get(urlID, config)
        .then(function(pets) {
          console.log(pets.data);
          res.render("results", {
            pets: pets.data.animals
          });
        })
        .catch(function(err) {
          console.log(err);
        });
    }
  });
};
