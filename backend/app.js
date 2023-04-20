//Utiliser express
const express = require('express'); 
const app = express(); 

//Utiliser mongoDB
const mongoose = require("mongoose");
mongoose.connect('',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie'))
  .catch(() => console.log('Connexion à MongoDB échouée'));

//Importer notre modèle de données
const exemple = require('./models/exemple');

  app.use(express.json()); //Middleware interceptant toutes les requêtes JSON (nécessaire pour le post)

app.use((req, res, next) => { //Middleware pour débloquer le CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

//Requête post
app.post('/URL' , (req , res , next) => {
    const Exemple = new exemple({ 
        ...req.body //L'opérateur spread ... permet de copier tous les éléments du body
    });
    Exemple.save() //Méthode save pour enregistrer l'objet de la requête sur la bdd
    .then(() => res.status(201).json({message : 'objet enregistré'}))
    .catch(() => res.status(400).json({ error }));
});

//Requête put pour modifier un objet
app.put('/URL/:id', (req, res, next) => {
    exemple.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Objet modifié !'}))
      .catch(error => res.status(400).json({ error }));
  });

//Requête delete pour supprimer un objet
app.delete('/URL/:id', (req, res, next) => {
exemple.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
    .catch(error => res.status(400).json({ error }));
});

//Requête get sur un seul objet
app.get('/URL/:id:id' , (req, res, next) => {
    exemple.findOne({_id: req.params.id})
    .then(thing => res.status(200).json(thing))
    .catch(error => res.status(404).json({ error }));
} );

//Requête get sur tous les objets
app.get('/URL' , (req, res, next) => { //Le premier argument est la route (le end-point)
    exemple.find() //Méthode find pour récupérer tous les objets de la base et les afficher
    .then(things => res.status(200).json(things))
    .catch(error => res.status(400).json({ error }));
});

module.exports = app;