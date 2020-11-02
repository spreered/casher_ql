# frozen_string_literal: true

module Mutations
  class CreateItem < BaseMutation
    # arguments passed to the `resolved` method
    argument :name, String, required: true
    argument :number, Int, required: true

    type Types::ItemType

    def resolve(name: nil, number: nil)
      Item.create!(
        name: name,
        number: number
      )
    end
  end
end
