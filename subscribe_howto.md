# Subscription by ActionCable How TO
add redis gem and run `bundle install`
```rb
gem 'redis', '~> 4.0'
```
require cable in application.js
```js
//= require cable
```
_app/assets/javascripts/application.js_

add redis adapter in cable.yml
```yml
 development:
  adapter: redis
  url: <%= ENV.fetch("REDIS_URL") { "redis://localhost:6379/1" } %>
```
_config/cable.yml_  

mount cable in routes.rb
```rb
  mount ActionCable.server => '/cable'
```
_config/routes.rb_

## Subscription Type
subscription is an entry point in GraphQL

```ruby
 class CashierQlSchema < GraphQL::Schema
  # ...
  subscription Types::SubscriptionType
  use GraphQL::Subscriptions::ActionCableSubscriptions,  redis: Redis.new
 end
```
_app/graphql/cashier_ql_schema.rb_

create a subscription_type file, and made a `update_item` field
```ruby
class Types::SubscriptionType < GraphQL::Schema::Object
  field :update_item, Types::ItemType, null: false, description: 'subscript updated item'
  def update_item;end
end
```
Read more: [Subscription Type](https://graphql-ruby.org/subscriptions/subscript)

## Trigger
add a trigger on some situation that you want to broadcast to client

For example, if item updated by mutation, trigger subscription `updated_item`
so we modify UpdateItem mutaion class
```ruby
module Mutations
  class UpdateItem < BaseMutation
  # ...
    def resolve(id:, name: nil, number: nil)
      item = Item.find_by(id: id)
      params = set_params(name, number)
      errors = []
      if item.update(params)
        CashierQlSchema.subscriptions.trigger('update_item', {}, item)
      else
        errors = item.errors.full_messages
      end
      { item: item, errors: errors }
    end
  end
end
```
_app/graphql/mutations/update_item.rb_

## ActionCable server side 
add channel file
```ruby
class CashierStreamChannel < ApplicationCable::Channel
  def subscribed
    @subscription_ids = []
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
    @subscription_ids.each do |sid|
      CashierQlSchema.subscriptions.delete_subscription(sid)
    end
  end

  def execute(data)
    # process data sent from the page
    query = data['query']
    variables = ensure_hash(data['variables'])
    operation_name = data['operationName']
    context = {
      #  current_user: current_user,

      # you can identify scope here
      # and trigger can boradcase to the scope
      # ex.
      # > group_id: current_group_id
      # and trigger
      # MySchema.subscriptions.trigger(
      #    'someEvent',
      #    {},
      #    self,
      #    scope: group_id
      #  )

      #  Make sure the channel is in the context
      channel: self
    }
    result = CashierQlSchema.execute(
      query: query,
      context: context,
      variables: variables,
      operation_name: operation_name
    )

    payload = {
      result: result.subscription? ? { data: nil } : result.to_h
    }

    # Track the subscription here so we can remove it
    # on unsubscribe.
    if result.context[:subscription_id]
      @subscription_ids << context[:subscription_id]
    end

    transmit(payload)
  end

  private

  def ensure_hash(ambiguous_param)
    case ambiguous_param
    when String
      if ambiguous_param.present?
        ensure_hash(JSON.parse(ambiguous_param))
      else
        {}
      end
    when Hash, ActionController::Parameters
      ambiguous_param
    when nil
      {}
    else
      raise ArgumentError, "Unexpected parameter: #{ambiguous_param}"
    end
  end
end
```
read more on [Action Cable Implementation](https://graphql-ruby.org/subscriptions/action_cable_implementation.html)

Client implement: 

check _app/assets/javascripts/channels/cashier_stream.js_

readmore on: [JavaScript Client](https://graphql-ruby.org/guides#javascript-client-guides)

# Web Socket Solution
Implement by graphql_ruby already
- [Action Cable subscriptions](https://graphql-ruby.org/api-doc/1.9.0/GraphQL/Subscriptions/ActionCableSubscriptions)
- [Pusher](https://graphql-ruby.org/subscriptions/pusher_implementation.html)
- [Ably](https://graphql-ruby.org/subscriptions/ably_implementation.html)

Any Cable

[gem grapql-anycable](https://github.com/Envek/graphql-anycable), it is _not_ production-ready yet

See https://github.com/anycable/anycable-rails/issues/40 for more details and discussion.

# Reference

rails / websocket / grapql
- [GraphQL Subscriptions with a Standalone Rails API and React](https://haughtcodeworks.com/blog/software-development/graphql-rails-react-standalone/)

- [Make web real-time with GraphQL subscriptions](https://medium.com/@hpux/make-web-real-time-with-graphql-subscriptions-5a59ac1b010c) : implement by Pusher

- [GraphQL Subscriptionsをgraphql-rubyとAction Cableで作る](https://blog.kymmt.com/entry/graphql-subscriptions-with-graphql-ruby-and-action-cable)

- [graphql_ruby Action Cable subscriptions lib](https://graphql-ruby.org/api-doc/1.9.0/GraphQL/Subscriptions/ActionCableSubscriptions)
