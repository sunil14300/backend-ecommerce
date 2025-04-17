const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const mail = require('./mailsend');
const AuthRouter = require("./router/routes");

const PORT = process.env.PORT || 8080;

// ✅ Connect to MongoDB (Fixing Error Handling)
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("MongoDB Atlas connected"))
.catch((err) => console.error("MongoDB Atlas connection error:", err));

// ✅ Middleware (Placed in Correct Order)
app.use(cors()); // First
app.use(bodyParser.json()); // JSON Parser

// ✅ API Routes
app.get("/",(req,res)=>{
    res.send("server running");
})
app.use('/auth', AuthRouter);
app.get("/", mail);

// ✅ Start Server
app.listen(PORT, () => {
    console.log(`Listening at port ${PORT}`);
});
