import { ObjectId } from 'mongodb';
import { getRiddlesCollection } from '../../db/mongoClient.js'
export async function getAllRiddles() {
  const col = await getRiddlesCollection();
  return col.find({}).toArray();
}


export async function addRiddle({ question, answer, level }) {
  const col = await getRiddlesCollection();
  const result = await col.insertOne({ question, answer, level });
  return result.insertedId;
}


export async function updateRiddle(id, fields) {
  const col = await getRiddlesCollection();
  return await col.updateOne({ _id: new ObjectId(id) }, { $set: fields });
}


export async function deleteRiddle(id) {
  const col = await getRiddlesCollection();
  return await col.deleteOne({ _id: new ObjectId(id) });
}