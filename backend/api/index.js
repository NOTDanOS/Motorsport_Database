// this guy is the middle connection. you go here AFTER you set up the connection for individual action first
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const initiateTeamTablesRoute = require('./teams/initiate');
const insertTeamRoute = require('./teams/insert');

const initiateSponsorTablesRoute = require('./sponsors/initiate');
const insertSponsorRoute = require('./sponsors/insert');
const insertSponsorTierRoute = require('./sponsors/insert-tier');


// just helps in parsing JSON request
app.use(bodyParser.json());

// Routes go HERE! Separate based on entity to make life EASY ZZZZZ
app.use('/api/teams/initiate', initiateTeamTablesRoute);
app.use('/api/teams/insert', insertTeamRoute);

app.use('/api/sponsors/initiate', initiateSponsorTablesRoute);
app.use('/api/sponsors/insert', insertSponsorRoute);
app.use('/api/sponsors/insert-tier', insertSponsorTierRoute);

// Don't touch this. Like, don't.
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
