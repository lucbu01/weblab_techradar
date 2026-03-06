#!/bin/bash
mongoimport --db techradar --collection technologies --username "$MONGO_INITDB_ROOT_USERNAME" --password "$MONGO_INITDB_ROOT_PASSWORD" --authenticationDatabase admin --file /docker-entrypoint-initdb.d/technologies_seed.json --jsonArray
