const express = require('express');

module.exports = function(app, Contact, Photo)
{
    /*
    Contact {
        (_id: String,)
        fb_id: String,
        contacts: [{
            name: String,
            phone: String
        }]
    }
    */

    // GET ALL CONTACTS
    app.get('/api/contacts/:fb_id', function(req,res){
        Contact.find({ fb_id : req.params.fb_id }, { _id: 0, contacts: 1}, function(err, result){
            if(err) return res.status(500).send({ error: 'database failure' });
            res.json(result[0]);
        });
    });

    // GET CONTACT BY NAME
    app.get('/api/contacts/:fb_id/:name', function(req, res){
        Contact.findOne({ fb_id: req.params.fb_id, contacts: { name: req.params.name }}, { _id: 0, contacts: 1}, function(err, contact){
            if(err) return res.status(500).json({error: err});
            if(!contacts) return res.status(404).json({error: 'contact not found'});
            res.json(contact[0]);
        })
    });

    // GET CONTACT BY PHONE
    app.get('/api/contacts/:fb_id/:phone', function(req, res){
        Contact.findOne({ fb_id: req.params.fb_id, contacts: { phone: req.params.phone }}, { _id:0, contacts: 1}, function(err, contact){
            if(err) return res.status(500).json({error: err});
            if(!contacts) return res.status(404).json({error: 'contact not found'});
            res.json(contact[0]);
        })
    });

    // NEW FACEBOOK LOGIN
    app.post('/api/contacts/:fb_id', function(req, res){
        Contact.findOne({ fb_id: req.params.fb_id }, function(err, contact){
            if(err) return res.status(500).json({error: err});
            if(contact) return res.status(404).json();
            else{
                var contact = new Contact();
                contact.fb_id = req.params.fb_id;
                contact.contacts = [];
                
                contact.save(function(err){
                    if(err){
                        console.error(err);
                        res.json({result: 0});
                        return;
                    }
                    res.json({result: 1});
            
                });
            }
        })
    });

    // CREATE CONTACT IF ID EXIST, OR UPDATE CONTACT
    app.put('/api/contacts/:fb_id', function(req, res){
        Contact.findOne({ fb_id: req.params.fb_id, contacts: {$elemMatch: { name: req.body.name } } }, function(err, contact){
            if(err) return res.status(500).json({error: err});

            console.log(" <- PUT");
            // CREATE NEW CONTACT
            if(!contact){
                console.log("Create New One");
                Contact.update({ fb_id: req.params.fb_id }, { $push: { contacts: { name: req.body.name, phone: req.body.phone }}}, function(err, result){
                    if(err) return res.status(500).json({error: err});
                    res.json(result);
                });
            } 
            // UPDATE CONTACT
            else{
                console.log("Update");
                console.log("" + contact);
                Contact.update({ fb_id: req.params.fb_id, 'contacts.name': req.body.name },
                        { $set: { 'contacts.$.phone': req.body.phone }}, function(err, result){
                    if(err) return res.status(500).json({error: err});
                    res.json(result);
                });
            }
        })
    });

    // DELETE CONTACT BY NAME
    app.delete('/api/contacts/:fb_id/:name', function(req, res){
        Contact.update({ fb_id: req.params.fb_id }, { $pull: { contacts: { name: req.params.name }}}, function(err, output){
            if(err) res.status(500).json({ error: 'database failure' });
            if(!output) return res.status(404).json({ error: 'contact not found' });
            res.status(204).end();
        })
    });

    // NEW PHOTO UPLOAD
    app.post('/api/photo/:fb_id', function(req, res){
        var photo = new Photo();
        photo.fb_id = req.params.fb_id;
        photo.lat = req.body.lat;
        photo.lng = req.body.lng;

        console.log("<- POST")

        photo.save(function(err, result){
            if(err){
                console.error(err);
                res.json({result: 0});
                return;
            }
            res.json(result);
            var fs = require('fs');
            var bitmap = Buffer.from(req.body.encoded, 'base64');
            fs.writeFile('public/'+result._id+'.jpg', bitmap, 'binary', function(err){
                if(err) res.status(500).json({ error: 'saving failure' });
            })
        });       
        
    });

    app.use('/static', express.static('public'));

    // PHOTO DOWNLOAD
    //app.get();

    // PHOTO DELETE BY FACEBOOK ID

    // ADD SCHEMA: NAME, LIKE, DISLIKE

}
