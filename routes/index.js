module.exports = function(app, Contact)
{
    // GET ALL CONTACTS
    app.get('/api/contacts', function(req,res){
        Contact.find(function(err, contacts){
            if(err) return res.status(500).send({error: 'database failure'});
            res.json(contacts);
        })
    });

    // GET CONTACT BY NAME
    app.get('/api/contacts/:name', function(req, res){
        Contact.findOne({name: req.params.name}, function(err, contact){
            if(err) return res.status(500).json({error: err});
            if(!contact) return res.status(404).json({error: 'contact not found'});
            res.json(contact);
        })
    });

    // GET CONTACT BY PHONE
    app.get('/api/contacts/:phone', function(req, res){
        Contact.findOne({phone: req.params.phone}, function(err, contact){
            if(err) return res.status(500).json({error: err});
            if(!contact) return res.status(404).json({error: 'contact not found'});
            res.json(contact);
        })
    });

    // CREATE CONTACT
    app.post('/api/contacts', function(req, res){
        var contact = new Contact();
        contact.name = req.body.name;
        contact.phone = req.body.phone;

        contact.save(function(err){
            if(err){ //saving fail
                console.error(err);
                res.json({result: 0});
                return;
            }

            //saving success
            res.json({result: 1});
        })
    });

    // UPDATE CONTACT BY ID
    app.put('/api/contacts/:_id', function(req, res){
        Contact.findById(req.params._id, function(err, contact){
            if(err) return res.status(500).json({ error: 'database failure' });
            if(!contact) return res.status(404).json({ error: 'contact not found' });
    
            if(req.body.name) contact.name = req.body.name;
            if(req.body.phone) contact.phone = req.body.phone;
    
            contact.save(function(err){
                if(err) res.status(500).json({error: 'failed to update'});
                res.json({message: 'contact updated'});
            });
    
        });
    });

    // DELETE CONTACT BY ID
    app.delete('/api/contacts/:_id', function(req, res){
        Contact.remove({ _id: req.params._id }, function(err, output){
            if(err) res.status(500).json({ error: 'database failure' });
            if(!output.n) return res.status(404).json({ error: 'contact not found' });
            res.status(204).end();
        })
    });

}
