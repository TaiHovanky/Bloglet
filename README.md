# Bloglet
Bloglet used for me to improve my skills with Node, GraphQL, TypeORM, GraphQL, Postgres, Apollo and React. Its functionality is fairly simple so far. A user can register themselves, create posts and comments, search for other users, follow them, and like/comment on their posts.

To run it, clone the repo, and then open two separate terminal tabs. In one, cd into ./web and in the other, cd into ./server. Run 'npm install' in each folder. Then use the "npm run start" command in both. Go to http://localhost:3000 to view the page.

A Postgres database was set up using Aiven. Select the Free tier and create an instance. Copy/paste the credentials into a .env file in the server/ folder.

For the Redis cache that handles the sessions, I set up a free account on Redis Cloud and added the credentials to .env.