var express = require('express');
var router = express.Router();

/*
 * GET Cataloglist.
 */
router.get('/cataloglist', function(req, res) {
    var db = req.db;
    db.collection('Cataloglist').find().toArray(function (err, items) {
        res.json(items);
    });
});
/*
 * POST to Add Catalog.
 */
router.post('/addcatalog', function(req, res) {
    var db = req.db;
    db.collection('Cataloglist').insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});


module.exports = router;
