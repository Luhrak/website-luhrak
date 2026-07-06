# Website Luhrak
Fully self made website including front and backend with hand written context object, router, middleware and only using Deno. The site works for me as a portfolio for my illustrative work and centralizing my pricing for commissions. 

## Website Link 
https://www.luhrak.com/

## Setup
- I provided variables in the top level .env file 
- To setup the postgres docker ``docker compose up -d``
- To run a local instance ``deno run --env-file -A server.js``

### Local environment variables 
```sh
PGHOST=localhost
PGPORT=5432
PGUSER=luh
PGPASSWORD=sql
```