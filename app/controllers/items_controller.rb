# frozen_string_literal: true

class ItemsController < ApplicationController
  def index
    @items = Item.all.order(id: :asc)
  end
end
