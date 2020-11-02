# frozen_string_literal: true

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
