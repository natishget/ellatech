#### step by step guide to start application

pnpm install                    # first time user 
docker-compose up -d --build    # for v1 older version of docker compose (Recommended)
docker compose up -d            # for v2 latest version of docker compose



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


### to check docker container status 
docker-compose ps


### URL (API endpoints)
## Users related

Methods             URL                                             BODY                                  
POST                http://localhost:3000/users                     {
	                                                                    "name": "tamen",
                                                                        "username": "tamen",
                                                                        "password": "123456"
                                                                    }

GET                 https://localhost:3000/users

## Products Related 

POST                http://localhost:3000/products                  {
                                                                        "userId": 1,
                                                                        "name": "car",
                                                                        "description": "the fast and the furious",
                                                                        "price": 1234,
                                                                        "stockQuantity": 3,
                                                                        "sku": "CA-BMW-BLK"
                                                                    }

POST                http://localhost:3000/products/adjust/1         {
                                                                        "userId": 1,
                                                                        "name": "car",
                                                                        "description": "the fast and the furious",
                                                                        "price": 1234,
                                                                        "stockQuantity": 3,
                                                                        "sku": "CA-BMW-BLK"
                                                                    }

GET                 http://localhost:3000/products/status/1

GET                 http://localhost:3000/products

## Transaction Related

GET                 http://localhost:3000/transactions


