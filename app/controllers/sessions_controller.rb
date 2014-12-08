class SessionsController < ApplicationController
  def create
    account = Account.from_omniauth(env['omniauth.auth'])
    account.create_user && account.save! if account.user.nil?
    session[:user_id] = account.user.id
    redirect_to root_url, notice: 'Signed in!'
  end

  def destroy
    session[:user_id] = nil
    redirect_to root_url, notice: 'Signed out!'
    end
end
