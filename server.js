const express = require("express")
const Library = require("./Library")
const cors = require("cors")
const app = express()
const db = new Library("mongodb://127.0.0.1:27017", "library", "books")
const PORT = 4000

app.use(cors())
app.use(express.urlencoded({ extended: true}))
app.use(express.json())
app.use(express.static(`${__dirname}/public`))

app.get("/", async (req, res) => {
    res.sendFile(`${__dirname}/public/index.html`)
})

app.get("/all", async (req, res) => {
    try {
        const findAll = await db.allBooks()
        res.status(200).json(findAll)
    } catch(err) {
        console.log(err)
        res.status(500).json({
            message: `${err}`
        })
    }
})

app.post("/create", async (req, res) => {
    try {
        const addOne = await db.addBook(req.body)
        res.status(200).redirect("/")
    } catch(err) {
        console.log(err)
        res.status(500).json({
            message: `${err}`
        })
    }
})

app.listen(PORT, () => {
    console.log(`[server] listening on ${PORT}`)
})