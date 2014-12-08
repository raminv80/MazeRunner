class Level < ActiveRecord::Base
  serialize :terrain, Array
end
