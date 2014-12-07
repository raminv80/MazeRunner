App.controller('enemiesController', ['$scope', 'scriptCompiler', function($scope, scriptCompiler){

  $scope.spriteClass = function(enemy){
    var classes = [enemy.type, enemy.direction]
    if(enemy.compiled_script && enemy.script_pointer>=0 && enemy.compiled_script[enemy.script_pointer]){
      if(enemy.compiled_script[enemy.script_pointer].command=='forward')
        classes.push('walk')
      if(['east','west'].indexOf(enemy.direction)>-1)
        classes.push('horizontal');
      else classes.push('vertical')
    }
    return classes.join(' ')
  }

  function updateEnemies(){
    var dh=0;
    var dv=0;
    enemy= $scope.enemy
    if(!enemy.direction) enemy.direction = 'north'
    if(!enemy.origin) enemy.origin = {i: enemy.i, j: enemy.j, direction: enemy.direction}
    if(!enemy.compiled_script) enemy.compiled_script = scriptCompiler(enemy.script).result
    if(!enemy.script_pointer) enemy.script_pointer = 0

    if(enemy.script_pointer<enemy.compiled_script.length){
      step = enemy.compiled_script[enemy.script_pointer]
      switch(step.command){
        case 'repeat':
          if(step.current < step.desired){
            enemy.script_pointer = step.index
            step.current++
          } else {
            enemy.script_pointer++
            step.current=0
          }
        break;
        case 'forward':
          if(step.current < step.desired){
            switch(enemy.direction){
              case 'north':
                if(enemy.j==0){
                  enemy.direction='west'; dh=0; dv=0;
                }else{
                  dh=0; dv=-1;
                }
              break;
              case 'west':
                if(enemy.i==0){
                  enemy.direction='south'; dh=0; dv=0;
                }else{
                  dh=-1; dv=0;
                }
              break;
              case 'south':
                if(enemy.j==$scope.level.size.height){
                  enemy.direction='east'; dh=0; dv=0;
                }else{
                  dh=0; dv=1;
                }
              break;
              case 'east':
                if(enemy.i==$scope.level.size.width){
                  enemy.direction='north'; dh=0; dv=0;
                }else{
                  dh=1; dv=0;
                }
              break;
            }
            enemy.i += dh
            enemy.j += dv
            step.current++
          } else {
            enemy.script_pointer++
            step.current=0
          }
        break;
        case 'turn':
          if(step.direction=='left'){
            //turn left
            switch(enemy.direction){
              case 'north': enemy.direction='west'
              break;
              case 'west': enemy.direction='south'
              break;
              case 'south': enemy.direction='east'
              break;
              case 'east': enemy.direction='north'
              break;
            }
          }
          if(step.direction=='right'){
            //turn right
            switch(enemy.direction){
              case 'north': enemy.direction='east'
              break;
              case 'east': enemy.direction='south'
              break;
              case 'south': enemy.direction='west'
              break;
              case 'west': enemy.direction='north'
              break;
            }
          }
          enemy.script_pointer++
        break;
        case 'goto': enemy.script_pointer = step.index
        break;
        case 'wait':
          if(step.current < step.desired){
            step.current++
          }else{
            step.current=0
            enemy.script_pointer++
          }
        break;
      }
    }
  }

  function resetEnemies(){
    for(i=0;i<$scope.level.enemies.length;i++){
      enemy = $scope.level.enemies[i]
      if(enemy.origin){
        enemy.i = enemy.origin.i
        enemy.j = enemy.origin.j
        enemy.direction = enemy.origin.direction
        enemy.script_pointer = 0
        for(j=0; j<enemy.compiled_script.length;j++)
          if(enemy.compiled_script[j].current)
            enemy.compiled_script[j].current=0;
      }
    }
  }

  $scope.$on('update', function() {
    updateEnemies()
  })

  $scope.$on('pause', function() {
    resetEnemies()
  })
}])