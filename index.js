const express = require("express");
const app = express();
const port = 10001
const morgan = require("morgan");


app.use(morgan("dev"));
app.get('/', (req, res) => {
    res.send("Hello");
})

app.listen(port, () => {
    console.log(`server is listening on port: ${port}`)
})