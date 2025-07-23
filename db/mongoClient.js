import { MongoClient } from "mongodb";



const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

let riddlesCollection;

export async function getRiddlesCollection() {
    if(!riddlesCollection){
        try{
            console.log(uri)
            await client.connect();
            const db = client.db('riddlesdb');
            riddlesCollection = db.collection('riddles')
            console.log('mongo canaction')
        }catch(err){
            console.error(err.message)
            throw err
           }
        }
        return riddlesCollection
}

  


