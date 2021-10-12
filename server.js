const { log } = require("console");
const express = require("express");
const app = express();
const PORT = 3000;

const multer = require('multer');

app.use(express.static(__dirname + "/public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

const upload = multer();
app.post(
  "", upload.single('audio'), async (req, res) => {
    console.log('받았슈');
  });

app.listen(PORT, () => { console.log(`Listen : ${PORT}`);});