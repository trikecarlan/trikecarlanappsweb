import * as admin from 'firebase-admin';

const serviceAccount = require('../../trikecarlanapps-firebase-adminsdk-e4s0m-62e02c1d37.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://trikecarlanapps-default-rtdb.asia-southeast1.firebasedatabase.app"
});

export const db = admin.database();
