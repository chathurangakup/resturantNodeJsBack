const express = require("express");
const app = express();
const bodyParser = require('body-parser')
const morgan = require("morgan");
const mongoose = require("mongoose");

var url="mongodb+srv://uditha:tgGoV07wfdhvPofU@cluster0.t6pkg.mongodb.net/?retryWrites=true&w=majority";



const userRoutes = require("./api/routes/users");
 const itemsRoutes = require("./api/routes/items");
 const itemcategoriesRoutes = require("./api/routes/itemcategories");
const likes = require("./api/routes/likes");
const cart = require("./api/routes/cart");
const address = require("./api/routes/address");
const datetime = require("./api/routes/datetime");


mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("DB Connected");
  });
//db connection Error handling
mongoose.connection.on("error", err => {
  console.log(`DB Connection Error:${err.message}`);
});


app.use(morgan("dev"));
app.use(bodyParser.json({  limit: '10mb',
extended: true }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
      res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
      return res.status(200).json({});
    }
    next();
});

app.use("/users", userRoutes);
 app.use("/items",itemsRoutes)
 app.use("/itemscategory",itemcategoriesRoutes)
app.use("/likes",likes)
app.use("/cart",cart)
app.use("/address",address)
app.use("/datetime",datetime)


app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
  });
  
  app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
      error: {
        message: error.message
      }
    });
  });

 module.exports=app;