if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const path = require("path");
const request = require("request");
const ejsMate = require("ejs-mate");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const { query } = require("express");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const app = express();
const fetch = require("node-fetch");
const fs = require("fs-extra");
const centresLoc = require("./seeds/centres.json");

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", function (req, res) {
  res.render("search");
});

app.get("/results", function (req, res) {
  var pinQuery = req.query.pincode;
  var dateQuery = req.query.date;
  var gotDate = new Date(dateQuery);
  var fullDate =
    gotDate.getDate() + "-" + gotDate.getMonth() + "-" + gotDate.getFullYear();
  console.log(fullDate);
  var url =
    "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode=" +
    pinQuery +
    "&date=" +
    fullDate;
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var data = JSON.parse(body);
      res.render("results", { data: data });
      console.log(data);
      // console.log(body);
    } else {
      res.render("error");
      console.log(error);
    }
  });
});

app.get("/covidUpdates", function (req, res) {
  res.render("temp");
});

app.get("/vaccineCentres", function (req, res) {
  res.render("vaccineCentres");
});
app.get("/vaccineUpdates", function (req, res) {
  res.render("vaccineUpdates");
});

app.get("/alerts", function (req, res) {
  res.render("temp");
});

app.get("/donate", function (req, res) {
  res.render("temp");
});

app.get("*", function (req, res) {
  res.redirect("/");
});

const port = process.env.PORT || 3000;
app.listen(port, process.env.IP, function () {
  console.log(`Vaccine Availabity app is running now on ${port}`);
});
