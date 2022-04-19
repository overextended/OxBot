OxBot

Both Development and Production require use of [Docker](https://www.docker.com/get-started/)

### Developmment

## Setting up

Create a .env file with the following structure:
```
TOKEN=
GUILD_ID=
CLIENT_ID=
```
Fill in the variables depending on your application.

## Starting the Application

In the root directory run:
`docker compose up`

Nodemon will watch for changes you make in the `src` directory.

### Production

Set up an .env file like in the development process.

To run the Application in production mode run:
`docker compose -f docker-compose.production.yaml up`