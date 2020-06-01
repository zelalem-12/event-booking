const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');

const graphqlSchema = require('./graphql/schema');
const graphqlResolvers = require('./graphql/resolvers');
const log = console.log;
const PORT = process.env.PORT;
const app = express();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    );
    next();
  });
app.use(bodyParser.json());

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
