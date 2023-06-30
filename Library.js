const { MongoClient, ObjectId } = require("mongodb")

class Library {
    constructor(dbUrl, dbName, collName) {
        this.dbUrl = dbUrl
        this.dbName = dbName
        this.collName = collName
        this.dbClient
    }

    async client() {
        // console.log(`Connecting to ${this.dbUrl}`)
        this.dbClient = MongoClient.connect(this.dbUrl)
        // console.log(`Connected to database`)
        return this.dbClient
    }

    // Going further
    async displayConnection() {
        console.log(`Connecting to ${this.dbUrl}`)
        await this.client()
        console.log(`Connected to database`)
    }

    async test() {
        const client = await this.client()
        client.close()
    }

    async collection() {
        const client = await this.client()
        const db = client.db(this.dbName)
        const collection = db.collection(this.collName)
        return collection
    }

    async allBooks() {
        const collection = await this.collection()
        return collection.find({}).toArray()
    }

    async findOneBook(id) {
        const docId = ObjectId(id)
        const collection = await this.collection()
        return collection.find(docId).toArray()
    }

    async findManyBooks(query) {
        const collection = await this.collection()
        return collection.find(query).toArray()
    }

    async addBook(info) {
        const collection = await this.collection()
        
        // Going further error handling
        if (!(info instanceof Object)) throw Error("Info takes an object data type")
        if (!info.title || !info.author || !info.copies) throw Error(".title .author and .copies are required")
        return collection.insertOne(info)
    }

    async changeBook(id, newInfo) {
        try {
            const mongoId = { _id: ObjectId(id) }
            const infoObj = { $set: newInfo }
            const collection = await this.collection()
            const result = await collection.updateOne(mongoId, infoObj)
            // Handles non-existent id
            if (result.matchedCount === 0) throw Error("ID not found")
        } catch(err) {
            // Handles malformed id
            if (err.name === "BSONTypeError") console.log("Incorrect ID type")
            console.log(err)
        }
    }

    async removeBook(id) {
        const mongoId = { _id: ObjectId(id) }
        const collection = await this.collection()
        collection.deleteOne(mongoId)
        console.log(`Book deleted`)
    }

}

module.exports = Library