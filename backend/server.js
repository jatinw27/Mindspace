require('dotenv').config()
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const authRoutes = require("./routes/authroutes")
const journalRoutes = require('./routes/journalRoutes');

const app = express()
const PORT = process.env.PORT || 5000



// Middleware
app.use(express.json())
app.use(cors())


// Routes
app.use('/api/auth', authRoutes)
app.use('/api/journals', journalRoutes);

app.get('/', (req, res) => {
  res.send("Mindspace Api is Running")
})

// Db connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {

  console.log("MongoDb connected");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

}).catch((err) => {
  console.log("MongoDb connection error", err);
})
