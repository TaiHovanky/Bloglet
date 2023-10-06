# Bloglet
Bloglet used for me to improve my skills with Node, GraphQL, TypeORM, GraphQL, Postgres, Apollo and React. Its functionality is fairly simple so far. A user can register themselves,
log in, create posts, and view the posts of another user. As of 7/12, I'm working on adding functionality for a Like/Favorite button.

To run it, clone the repo, and then open two separate terminal tabs. In one, cd into ./web and in the other, cd into ./server. Run 'npm install' in each folder. Then use the "npm run start" command in both. Go to http://localhost:3000 to view the page.

A Postgres database was set up using Aiven. Select the Free tier and create an instance. Copy/paste the credentials into a .env file in the server/ folder.
