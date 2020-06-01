const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');

const graphqlSchema = require('./graphql/schema');
const graphqlResolvers = require('./graphql/resolvers');
const isAuth = require('./middleware/is-auth');
const log = console.log;
const PORT = process.env.PORT;

const app = express();

app.use(bodyParser.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    console.log(req.body)
    next();
  });
app.use(isAuth);

app.use('/api',graphqlHttp({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
    graphiql: true
}))


mongoose.connect(
    `mongodb://${process.env.MONGO_CLOUD_USER}:${process.env.MONGO_CLOUD_PASSWORD}@cluster0-shard-00-00-00gch.mongodb.net:27017,cluster0-shard-00-01-00gch.mongodb.net:27017,cluster0-shard-00-02-00gch.mongodb.net:27017/${process.env.MONGO_CLOUD_DATABASE}?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority`, {
     useNewUrlParser: true,
     useUnifiedTopology: true
    }).then(() => {
        app.listen(PORT, () => log(`Server started at http://localhost:${PORT}`))
    })
	.catch(err => log(err))
