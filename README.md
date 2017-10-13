# hours
## Mysql

The mysql arguments are omitted below, you might need the standard auth arguments.

Create the tables needed by the service:

```` cat mysql/mysql-1.0.0.sql | mysql ````

Add a user that can interact with the table:

````
export DB_NAME=hours
export DB_USER=hours
export DB_HOST=localhost
export DB_PASS=p

````cat mysql/GRANT.sql | sed -e "s/#DB/$DB_NAME/g" -e "s/#USER/$DB_USER/g" -e "s/#HOST/$DB_HOST/g" -e "s/#PASS/$DB_PASS/g" | mysql ````

Note that the user created can not be used for administrative tasks (such as creating the table or truncating data etc).

# Run tests

Make sure that the database is installed and configured.

Either update the config file or run the tests with the environment variables above
