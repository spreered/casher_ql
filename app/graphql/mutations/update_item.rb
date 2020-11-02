# frozen_string_literal: true

module Mutations
  class UpdateItem < BaseMutation
    argument :id, ID, required: true
    argument :name, String, required: false
    argument :number, Int, required: false

    field :item, Types::ItemType, null: false
    field :errors, [String], null: false

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

    def set_params(name, number)
      params = {}
      params[:name] = name if name.present?
      params[:number] = number if number.present?
      params
    end
  end
end
