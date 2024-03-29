module.exports = {
   "type": "postgres",
   "host": process.env.DB_HOST,
   "port": process.env.DB_PORT,
   "username": process.env.DB_USER,
   "password": process.env.DB_PW,
   "database": process.env.DB_NAME,
   "synchronize": true,
   "logging": false,
   "entities": ["src/entity/**/*"],
   "cli": {
      "entitiesDir": "src/entity",
   },
   "ssl": true,
  "extra": {
      "ssl": {
         "rejectUnauthorized": false
      }
   }
}