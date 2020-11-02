# frozen_string_literal: true

module Types
  class ItemType < Types::BaseObject
    description 'Item'
    field :id, ID, null: false
    field :name, String, null: false
    field :number, Int, null: false
  end
end
