const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000
const {AllUsers} = require("./queries.js");
const routes = require ("./Routes/userRoutes.js");

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)
app.listen(port,() => console.log("API server is running...."));

app.get('/',(request,response)=>{
    response.json({info: 'Node.js,Express,Postgesql API'})
})

app.use("/user",routes);