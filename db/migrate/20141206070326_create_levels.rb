class CreateLevels < ActiveRecord::Migration
  def change
    create_table :levels do |t|
      t.string :name
      t.text :description
      t.string :hint
      t.integer :width
      t.integer :height
      t.integer :start_x
      t.integer :start_y
      t.integer :end_x
      t.integer :end_y
      t.integer :initial_angle
      t.text :terrain

      t.timestamps
    end
  end
end
