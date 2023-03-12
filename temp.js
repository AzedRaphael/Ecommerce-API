import { MongoClient } from 'mongodb';
import {ObjectId} from 'mongodb';

/*
 * Requires the MongoDB Node.js Driver
 * https://mongodb.github.io/node-mongodb-native
 */

const agg = [
  {
    '$match': {
      'productId': new ObjectId('640ba2c8854cb4996959d199')
    }
  }, {
    '$group': {
      '_id': null, 
      'averageRating': {
        '$avg': '$rating'
      }, 
      'numberOfReviews': {
        '$sum': 1
      }
    }
  }, {}
];

const client = await MongoClient.connect(
  '',
  { useNewUrlParser: true, useUnifiedTopology: true }
);
const coll = client.db('Products').collection('reviews');
const cursor = coll.aggregate(agg);
const result = await cursor.toArray();
await client.close();