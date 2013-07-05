var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('cigardb', server, {safe: true});

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'cigardb' database");
        db.collection('cigars', {safe:true}, function(err, collection) {
            if (err) {
                console.log("The 'cigars' collection doesn't exist. Creating it with sample data...");
                populateDB();
            }
        });
    }
});

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving cigar: ' + id);
    db.collection('cigars', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};

exports.findAll = function(req, res) {
    db.collection('cigars', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.addCigar = function(req, res) {
    var cigar = req.body;
    console.log('Adding cigar: ' + JSON.stringify(cigar));
    db.collection('cigars', function(err, collection) {
        collection.insert(cigar, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
}

exports.updateCigar = function(req, res) {
    var id = req.params.id;
    var cigar = req.body;
    delete cigar._id;
    console.log('Updating cigar: ' + id);
    console.log(JSON.stringify(cigar));
    db.collection('cigars', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, cigar, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating cigar: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(cigar);
            }
        });
    });
}

exports.deleteCigar = function(req, res) {
    var id = req.params.id;
    console.log('Deleting cigar: ' + id);
    db.collection('cigars', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
}

/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function() {

    var cigars = [
    {
        name: "1876 Reserve Churchill",
  package: "Bundle of 25",
        size: "7.2 x 50",
        strength: "Mild",
	shape: "Churchill",
        country: "Ecuador",
        region: "Southern Rhone",
        description: "1876 Reserve is a sleeper of a premium from Jose Blanco. Offering a smooth Connecticut-seed wrapper grown in the foggy mist of Ecuador, this attractive light-brown wrapper has an oily sheen and flawless, smooth character. The Cuban-seed Dominican and Nicaraguan long-filler combination adds to its luster, yielding an unmistakable, mild and mellow taste with a pleasant aroma.",
        picture: "1876_Reserve_Churchill.jpg"
    },
    {
	name: "1876 Reserve Robusto",
	package: "Bundle of 25",
	size: "5 x 50",
	strength: "Medium",
	shape: "Robusto",
	country: "Ecuador",
	description: "1876 Reserve is a sleeper of a premium from Jose Blanco. Offering a smooth Connecticut-seed wrapper grown in the foggy mist of Ecuador, this attractive light-brown wrapper has an oily sheen and flawless, smooth character. The Cuban-seed Dominican and Nicaraguan long-filler combination adds to its luster, yielding an unmistakable, mild and mellow taste with a pleasant aroma.",
        picture: "1876_Reserve_Robusto.jpg"
    },
    {
        name: "1876 Reserve Toro",
        package: "Bundle of 25",
        size: "6 x 50",
	strength: "Mild",
	shape: "Toro",
        country: "Ecuador",
        description: "1876 Reserve is a sleeper of a premium from Jose Blanco. Offering a smooth Connecticut-seed wrapper grown in the foggy mist of Ecuador, this attractive light-brown wrapper has an oily sheen and flawless, smooth character. The Cuban-seed Dominican and Nicaraguan long-filler combination adds to its luster, yielding an unmistakable, mild and mellow taste with a pleasant aroma.",
        picture: "1876_Reserve_Toro.jpg"
    },
    {
        name: "1876 Reserve Torpedo",
	package: "Bundle of 25",
	size: "6.5 x 52",
	strength: "Mild",
	shape: "Torpedo",
        country: "Ecuador",
        description: "1876 Reserve is a sleeper of a premium from Jose Blanco. Offering a smooth Connecticut-seed wrapper grown in the foggy mist of Ecuador, this attractive light-brown wrapper has an oily sheen and flawless, smooth character. The Cuban-seed Dominican and Nicaraguan long-filler combination adds to its luster, yielding an unmistakable, mild and mellow taste with a pleasant aroma.",
        picture: "1876_Reserve_Torpedo.jpg"
    }];

    db.collection('cigars', function(err, collection) {
        collection.insert(cigars, {safe:true}, function(err, result) {});
    });

};
