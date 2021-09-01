const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = express();
const pinRoute = require("./routes/pins");
const userRoute = require("./routes/users");

dotenv.config();
app.use(express.json());

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => {
    console.log("Mongo is connected...");
}).catch((err) => {
    console.log(err);
});



app.use("/api/users", userRoute);
app.use("/api/pins", pinRoute);


app.listen(process.env.PORT || 8000, () => {
    console.log("Server is running now...");
})