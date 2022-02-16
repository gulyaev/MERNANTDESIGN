const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const authRouter = require("./routes/auth.routes");
const fileRouter = require("./routes/file.routes");
var bodyParser = require('body-parser')
const app = express();
const PORT = config.get('serverPort');
const corsMiddleware = require ('./middleware/cors.middleware');
const fileUpload = require("express-fileupload");

app.use(bodyParser.json())
app.use(fileUpload({}));
app.use(corsMiddleware);
app.use(express.json());
app.use(express.static('static'));
app.use("/api/auth", authRouter);
app.use("/api/files", fileRouter);

const start = async () => {
    try {
        await mongoose.connect(config.get("dburl"));
        
        app.listen(PORT, () => {
            console.log("Server started on port " + PORT);
        });
    } catch (error) {
        
    }
}

start();
