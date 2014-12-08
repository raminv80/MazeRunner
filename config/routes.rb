Rails.application.routes.draw do
  get 'auth/:provider/callback' => 'sessions#create'
  get 'auth/failure' => redirect('/')
  delete 'signout' => 'sessions#destroy', as: 'signout'

  get 'game' => 'game#index'

  root to: 'game#index'
end
