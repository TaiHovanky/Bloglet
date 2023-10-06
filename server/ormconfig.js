export default {
   "type": "postgres",
   "host": process.env.DB_HOST,
   "port": process.env.DB_PORT,
   "username": process.env.DB_USER,
   "password": process.env.DB_PW,
   "database": process.env.DB_NAME,
   "synchronize": true,
   "logging": false,
   "entities": ["src/entity/**/*"],
   "migrations": ["src/migration/**/*"],
   "subscribers": ["src/subscriber/**/*"],
   "cli": {
      "entitiesDir": "src/entity",
      "migrationsDir": "src/migration",
      "subscribersDir": "src/subscriber"
   },
   "ssl": true,
  "extra": {
      "ssl": {
         "rejectUnauthorized": false
      }
   }
}