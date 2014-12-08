class User < ActiveRecord::Base
  has_many :accounts

  def name
    (accounts.first || OpenStruct.new({name: "Guest"})).name
  end
end
