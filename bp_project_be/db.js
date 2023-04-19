const {MongoClient, ServerApiVersion} = require('mongodb');

const uri = "mongodb://meteor_usr:gvcmdQBFHrC4HXMj@10.0.1.118/app_negozi?authSource=app_negozi&directConnection=true";

MongoClient.connect('mongodb://meteor_usr:gvcmdQBFHrC4HXMj@10.0.1.118/app_negozi?authSource=app_negozi&directConnection=true', (err, client) => {
    if (err) throw err

    const db = client.db("datisede")

    db.collection('buonipasto').find().toArray((err, result) => {
        if (err) throw err

        console.log(result)
    })
})

const client = new MongoClient(uri, {
    serverApi:{
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
    }
}); 

async function run() {
    try{
        //Connect the client to the server
        await client.connect()
        console.log("Pinged your deployment. Connected successfully to MongoDB!")

        //Send a ping to confirm a successful connection
        await client.db("admin").command({ping: 1});
    
        await listDatabases(client);

        /* await createListing(client, {
            utente: "Utente prova",
            dataora: "2023-04-18 13:01:37",
            datautilizzo: "2023-04-18",
            tipo: "A"
        })

        await createMultipleListings(client, [{
            utente: "Utente prova1",
            dataora: "2023-04-18 13:01:37",
            datautilizzo: "2023-04-18",
            tipo: "A"
        },
        {
            utente: "Utente prova2",
            dataora: "2023-04-18 13:01:37",
            datautilizzo: "2023-04-18",
            tipo: "R"
        },
        {
            utente: "Utente prova3",
            dataora: "2023-04-18 13:01:37",
            datautilizzo: "2023-04-18",
            tipo: "B"
        }]
        ) 

        await findOneListingByUtente(client, "Utente prova");

        await findOneListingByTipo(client, "B");

        await updateListingByUtente(client, "Utente prova", { tipo: "B", datautilizzo:"2023-04-5" });

        await upsertListingByUtente(client, "Utente Prova1", {utente: "Utente prova1", dataeora:"2023-04-30 16:00:00"});

        await updateAllListingsToHavePropertyType(client);

        await deleteListingByUtente(client, "Utente prova2"); 

        await deleteListingsByDataUtilizzo(client, new Date('2023-04-5'));*/
        
        await findMultipleListingByTipo(client, "B");

        
        
    } finally{
        await client.close();
    }
}

run().catch(console.error);

//DELETE By Data
async function deleteListingsByDataUtilizzo(client, lastDataUtilizzo){
    const result = await client.db("datisede").collection("buonipasto").deleteMany({ 
        datautilizzo: { $regex: "2023-04-5"} });

    console.log(`${result.deletedCount} documenti sono stati eliminati`);
}

//DELETE By Utente
async function deleteListingByUtente(client, utenteOfListing) {
    const result = await client.db("datisede").collection("buonipasto").deleteOne({utente: utenteOfListing});

    console.log(`${result.deletedCount} documenti sono stati eliminati`);
}

//UPDATE(inserimento) di un campo in tutti i listing
async function updateAllListingsToHavePropertyType(client){

    const result = await client.db("datisede").collection("buonipasto").updateMany({
        property_type: { $exists: false} },
            {$set: { property_type: "Unknown" } });


    console.log(`${result.matchedCount} documenti corrispondono ai criteri della ricerca`);
    console.log(`${result.modifiedCount} documenti sono stati aggiornati`);
}

//UPDATE per utente se presente altrimenti INSERT
async function upsertListingByUtente(client, utenteOfListing, updatedListing){
    const result = await client.db("datisede").collection("buonipasto").updateOne({ utente: utenteOfListing}, { $set: updatedListing}, {upsert: true});

    console.log(`${result.matchedCount} documenti corrispondono ai criteri della ricerca`);

    if(result.upsertedCount > 0) {
        console.log(`Un documento è stato inserito con id ${result.upsertedId}`);
    } else {
        console.log(`${result.modifiedCount} documenti sono stati aggiornati`);
    }
}

//UPDATE By utente
async function updateListingByUtente(client, utenteOfListing, updatedListing ){
    const result = await client.db("datisede").collection("buonipasto").updateOne({ utente: utenteOfListing}, { $set: updatedListing});

    console.log(`${result.matchedCount} documenti corrispondono ai criteri della ricerca`);
    console.log(`${result.modifiedCount} documenti sono stati aggiornati`);
}

//SELECT All tramite tipo
async function findMultipleListingByTipo(client, tiposOfListing){
    const result = await client.db("datisede").collection("buonipasto").find({tipo: tiposOfListing}, {sort: {utente: 1}}).toArray((err, clients) => {
        console.log(clients);
    });

    if(result) {
        console.log(`Trovati dei listing nella collection con tipo '${tiposOfListing}'`);
        console.log(result);
    } else{
        console.log(`Nessun listing trovato con tipo '${tiposOfListing}'`);
    }
}

//SELECT One tramite tipo
async function findOneListingByTipo(client, tipoOfListing){
    const result = await client.db("datisede").collection("buonipasto").findOne({tipo: tipoOfListing});

    if(result) {
        console.log(`Trovato un listing nella collection con tipo '${tipoOfListing}'`);
        console.log(result);
    } else{
        console.log(`Nessun listing trovato con tipo '${tipoOfListing}'`);
    }
}

//SELECT One tramite utente
async function findOneListingByUtente(client, utenteOfListing){
    const result = await client.db("datisede").collection("buonipasto").findOne({utente: utenteOfListing});

    if(result) {
        console.log(`Trovato un listing nella collection con il nome '${utenteOfListing}'`);
        console.log(result);
    } else{
        console.log(`Nessun listing trovato con il nome di '${utenteOfListing}'`);
    }
}

//INSERT di più listing
async function createMultipleListings(client, newListings){
    const result = await client.db("datisede").collection("buonipasto").insertMany(newListings);

    console.log(`${result.insertedCount} nuove listings create con i seguenti id(s):`);
    console.log(result.insertedIds);
}

//INSERT di un singolo listing
async function createListing(client, newListing){
    const result = await client.db("datisede").collection("buonipasto").insertOne(newListing);

    console.log(`Nuovo listing creato con il seguente id: ${result.insertedId}`);
}

//SELECT di tutti i database
async function listDatabases(client) {
    const databasesList = await client.db().admin().listDatabases();

    console.log("Databases: ");
    databasesList.databases.forEach(db => {
        console.log(`- ${db.name}`)
    });
}

module.exports = {
    client,
    deleteListingsByDataUtilizzo,
    deleteListingByUtente,
    updateAllListingsToHavePropertyType,
    upsertListingByUtente,
    updateListingByUtente,
    findMultipleListingByTipo,
    findOneListingByTipo,
    findOneListingByUtente,
    createMultipleListings,
    createListing,
    listDatabases
};