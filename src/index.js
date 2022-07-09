// import the express dependency
const express = require('express');

// create express app
const app = express();
const cors = require('cors')
app.use(express.json(), cors())
// define a variable for the port
const port = 3000;


// import the mongoDB dependency
const MongoClient = require('mongodb').MongoClient;
// define url to the database
const url = "mongodb://localhost:27017/movies";



app.get('/api/v1/favourites', function (req, res) {
    MongoClient.connect(url, function(err, connection) {
        if (err) throw err;
        let dbo = connection.db("movies");
        dbo.collection("favourites").find({}).toArray(function(err, result) {
            if (err) throw err;
            connection.close();
            res.send(result);
        })
    })
})

app.post('/api/v1/favourites', function (req, res) {
    if(checkPayload(req)) {
    MongoClient.connect(url, function(err, connection) {
        if (err) throw err;
        let dbo = connection.db("movies");
        const newFav = { movie_id: req.body.movie_id.toString(), movie_name: req.body.movie_name };
        dbo.collection("favourites").insertOne(newFav, function(err, res) {
            if (err) throw err;
            connection.close();
        })
    })
    res.send('successful POST request');
    }

    else {
        res.status(400);
        res.send('invalid payload');
    }
})

app.delete('/api/v1/favourite/:id', function (req, res) {


        MongoClient.connect(url, function(err, connection) {
            if (err) throw err;
            let dbo = connection.db("movies");
            const query = { movie_id: req.params.id };
            dbo.collection("favourites").deleteOne(query, function(err, res) {
                if (err) throw err;
                console.log("deleted movie with id: "+req.params.id)
                connection.close();
            })
        });
        res.send('Got a DELETE request at /favourites with id: '+ req.params.id)

})



function checkPayload(req) {
    return req.body.hasOwnProperty('movie_id') && req.body.hasOwnProperty('movie_name');
}




// start server
app.listen(port, () => {
    console.log(`Movie Server listening at http://localhost:${port}`);
});
