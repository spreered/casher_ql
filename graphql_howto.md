# graphql-ruby How TO
setup server
```bash
$ bundle exec rails generate graphql:install
```

create Item model 
```bash
$ rails g model Item name:string number:integer
$ rails db:migrate
```

create a schema file for graphql

```ruby
class CashierQlSchema < GraphQL::Schema
  mutation(Types::MutationType) # remove this line if your have not implement mutation yet
  query(Types::QueryType)
end
```
_app/graphql/cashier_ql_schema.rb_

## Define Type
create a Item type
```ruby
module Types
  class ItemType < Types::BaseObject
    description 'Item'
    field :id, ID, null: false
    field :name, String, null: false
    field :number, Int, null: false
  end
end
```
_app/graphql/types/item_type.rb_


## Add Query 
Define your query entry point

```ruby
 module Types
   class QueryType < Types::BaseObject
    field :all_items, [ItemType], null: false

    field :item, ItemType, null: true do
      description 'Find a item by ID'
      argument :id, ID, required: true
    end

    def all_items
      Item.all
    end

    def item(id:)
      Item.find(id)
    end
   end
 end
```
_app/graphql/types/item_type.rb_

then you can test it on playground `http://localhost:3000/graphiql`
```graphql
{
  allItems {
    id
    name
    number
  }
}
```
## Mutation
mutation is for create/update/delete method

create your mutaion class for update item
```ruby
module Mutations
  class UpdateItem < BaseMutation
    argument :id, ID, required: true
    argument :name, String, required: false
    argument :number, Int, required: false

    field :item, Types::ItemType, null: true
    field :errors, [String], null: false

    def resolve(id:, name: nil, number: nil)
      item = Item.find_by(id: id)
      params = set_params(name, number)
      errors = item.update(params) ? [] : item.errors.full_messages
      { item: item, error: errors }
    end

    def set_params(name, number)
      params = {}
      params[:name] = name if name.present?
      params[:number] = number if number.present?
      params
    end
  end
end

```
_app/graphql/mutations/update_item.rb_

add entry point to mutaion type
```ruby
module Types
  class MutationType < Types::BaseObject
  field :update_item, mutation: Mutations::UpdateItem  
  end
end
```
_app/graphql/types/mutation_type.rb_

test mutation on playground
```graphql
mutation {
  updateItem(id: 3,  
    name: "third"
    number: 12345
  ){
      item {
        id
        name
        number
      }
    	errors 
  } 
}
```


# Reference 
https://www.howtographql.com/graphql-ruby/0-introduction/
