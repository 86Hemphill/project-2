const express = require("express");
const exphbs = require("express-handlebars");
const session = require("express-session");
const dotenv = require("dotenv");
const passport = require("./config/passport");
const db = require("./models");

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/", express.static(__dirname + "/public"));
app.use("/feed", express.static(__dirname + "/public"));
app.use("/feed/search", express.static(__dirname + "/public"));
app.use("/users", express.static(__dirname + "/public"));
app.use("/posts", express.static(__dirname + "/public"));

app.use(session({ secret: "keyboard cat", resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

require("./routes/api-routes.js")(app);
require("./routes/html-routes.js")(app);

db.sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log("Server listening on: http://localhost:" + PORT);
    });
});
