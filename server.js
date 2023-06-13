const express = require("express")
const axios = require("axios")
const cors = require("cors")

const app = express()

app.use(cors())

app.listen(4000, () =>{
    console.log("app listening on port 4000")
})

app.get('/character', (req, res) =>{
    axios.get("https://anapioficeandfire.com/api/characters/3000")
        .then(response =>{
            res.json(response.data)
        })
        .catch(error =>{
            res.status(500).json({error: error})
        })
})