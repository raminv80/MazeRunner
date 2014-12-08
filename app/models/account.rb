class Account < ActiveRecord::Base
  belongs_to :user

  def self.from_omniauth(auth)
    where(auth.slice('provider', 'uid')).first || create_from_omniauth(auth)
  end

  def self.create_from_omniauth(auth)
    create! do |account|
      account.provider = auth['provider']
      account.uid = auth['uid']
      account.name = auth['info']['nickname']
    end
  end
end
