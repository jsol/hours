# Hours

An app for registering times. It connects these times to a sha256 hash of the user email
and keeps track of these using JWT tokens. This token must be sent through emails, so you
need an email server to send messages through.

The main goal is that it must be extremely quick and easy to add times, with no logins or
extra steps. Then every now and then the user can correct faulty entries through a more
complete GUI.

## Todo

- Add tests
- In genereral improve code quality
- Take half days in consideration when calculating flex.
- Sum flex to give a number on the current state
- There might be some timezone issues when times are added
close to midnight. This might be worse in time zones far from GMT.

## Configuration

Check the config\_schema.js file for configuration options.

The email.from and email.subject params must be set. The jwtsecret option should REALLY be set for a production system,
but for development the default is fine.

## Mysql

For developing purposes the MySQL docker works just fine, I use

````
docker run -p3306:3306 -E MYSQL_ROOT_PASSWORD=p mysql
````

The mysql arguments are omitted below, you might need the standard auth arguments, and if you
use the mysql docker you have to add --protocol=tcp.

Create the tables needed by the service:

````
cat mysql/mysql-1.0.0.sql | mysql
````

Add a user that can interact with the table:

````
export MYSQL_DATABASE=hours
export MYSQL_HOST=localhost
export MYSQL_USER=hours
export MYSQL_PASSWORD=pass

cat mysql/GRANT.sql | sed -e "s/#DB/$MYSQL_DATABASE/g" -e "s/#USER/$MYSQL_USER/g" -e "s/#HOST/$MYSL_HOST/g" -e "s/#PASS/$MYSL_PASSWORD/g" | mysql
````

The exported env above are the same that are used in the config schema, so if you keep them there is no need to add them
to the config file.

Note that the user created can not be used for administrative tasks (such as creating the table or truncating data etc).

