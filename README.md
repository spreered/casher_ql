# CashierQL
A simple Rails/GraphQL ruby/ActionCable demo program 
- Rails 5.2.2
- Ruby 2.5.3
- graphql-ruby 1.9
- Redis

# Setup Rails
create db and setup seed file
```bash
$ rails db:create
$ rails db:migrate
```
make sure your redis server is start
```bash
$ redis-cli     
127.0.0.1:6379> PING
PONG
```

# "wss://" url on the production
If we want to use ws url on the production, We need to set the cable URL for our production environment.
```ruby
config.web_socket_server_url = "wss://yourhosturl/cable"  
```
_config/environments/production.rb_

and setup Allow Request Origin
```ruby
config.action_cable.allowed_request_origins = ["https://yourappurl.com/"]
```
_config/environments/production.rb_


# Implement Guide
- [GraphQL Ruby How TO](graphql_howto.md)
- [Subscription by ActionCable How TO](/subscribe_howto.md)

