# frozen_string_literal: true

class CashierQlSchema < GraphQL::Schema
  mutation Types::MutationType
  query Types::QueryType
  subscription Types::SubscriptionType
  use GraphQL::Subscriptions::ActionCableSubscriptions, redis: Redis.new
end
