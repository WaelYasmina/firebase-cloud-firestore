const express = require('express');
const app = express();
const port = 3000;
const admin = require('firebase-admin');


//var serviceAccount = require("the .json file path");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "your database url"
// });

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: "your database url"
  });


const database = admin.firestore();
const usersCollection = database.collection('users');

app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send('index');
});

app.post('/add', (req, res) => {
    const user = usersCollection.doc();
    user.set({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        age: req.body.age
    }, {merge: true})
    .then(() => {
        console.log('User has been added successfully !');
    })
    .catch(error => {
        console.error(error);
    })
});

app.put('/update', (req, res) => {
    usersCollection.doc(req.body.user_id).update({
        favorite_languages: admin.firestore.FieldValue.arrayRemove('Delphi')
    });
});

app.delete('/remove', (req, res) => {
    usersCollection.doc(req.body.user_id).delete();
});

app.post('/data', (req, res) => {
    const query1 = usersCollection.where('first_name', '==', 'Michael');
    const query2 = usersCollection.where('age', '>=', 20).where('age', '<', 40);
    const query3 = usersCollection.where('favorite_languages', 'array-contains', 'Delphi');
    const pLanguages = ['C#', 'Ruby', 'C++', 'Javascript'];
    const query4 = usersCollection.where('favorite_languages', 'array-contains-any', pLanguages);
    const query5 = database.collectionGroup('landmarks').where('type', '==', 'museum');
    query5.get()
    .then(snapshot => {
        snapshot.forEach(user => {
            console.log(user.id + ' => ', user.data());
        });
    })
    .catch(error => {
        console.error(error);
    })
});

// usersCollection.doc('B0E07tJXTmaXiM8rWjZo').onSnapshot(snapshot => {
//     console.log('Current data: ', snapshot.data());
// }, error => {
//     console.log('Error !');
// });

usersCollection.where('age', '==', 44).onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
        if(change.type === 'added')
            console.log('Add operation has been done !');
        if(change.type === 'changed')
            console.log('change operation has been done !');
        if(change.type === 'removed')
            console.log('Delete operation has been done !');
    }, error => {
        console.log(error);
    });
})

app.listen(port, () => {
    //console.log(`App is listening to port ${port}`);
});