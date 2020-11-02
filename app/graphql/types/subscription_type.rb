# frozen_string_literal: true

class Types::SubscriptionType < GraphQL::Schema::Object
  field :update_item, Types::ItemType, null: false, description: 'subscript updated item'
  def update_item; end
end
