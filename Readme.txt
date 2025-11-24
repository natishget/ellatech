#### step by step guide to start application

pnpm install                  # first time user 
docker-compose up -d --build    # for v1 older version of docker compose (Recommended)
docker compose up -d          # for v2 latest version of docker compose



#### if any error related to permission occures please the folling command 

sudo usermod -aG docker $USER
newgrp docker



#### then run docker compose 

### then run this command on the terminal
docker-compose exec api pnpm run migration:generate    # this migrates the DB
docker-compose exec api pnpm run migration:run         # to create the tables and their attributes

### to check docker console
docker-compose logs -f api



### to stop docker container 
docker-compose down


