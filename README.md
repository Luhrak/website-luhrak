# Website Luhrak
Fully self made website including front and backend with hand written context object, router, middleware and only using Deno. The site works for me as a portfolio for my illustrative work and centralizing my pricing for commissions. 

## Website Link 
https://www.luhrak.com/

## Setup
- I provided variables in the top level .env file 
- To setup the postgres docker ``docker compose up -d``
- To run a local instance ``deno run --env-file -A server.js``

### Loading example data into container
In order to populate the database with data we need to use pg tooling to load it from the dump:
```sh
docker ps # find the database container (like website-luhrak-database-1)
docker exec -it <the container name> /bin/bash
PGUSER=luh pg_restore -d "postgres" /dump/site_data.pg.dump
```

### Inital user credentials 
On account table creation a admin user with following credentials is being created: 
> user: **Siteowner** 
> password: **Hausarbeit-1** 
The login / logout can be found on the routes ``/login`` and ``/logout`` or by clicking the waving luhrak in the footer.   
Once logged in the password can be changed under ``/change-password``. 

### Local environment variables 
```sh
PGHOST=localhost
PGPORT=5432
PGUSER=luh
PGPASSWORD=sql
```
