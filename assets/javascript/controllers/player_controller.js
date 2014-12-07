App.controller('playerController', ['$scope', 'scriptCompiler', function($scope, scriptCompiler){

  $scope.init_player = function (){
    if(!$scope.player.direction) $scope.player.direction = 'north'
    if(!$scope.player.origin) $scope.player.origin = {i: $scope.player.i, j: $scope.player.j, direction: $scope.player.direction}
    resetPlayer()
  }

  $scope.spriteClass = function(player){
    var classes = [player.direction]
    player = $scope.player
    if(player.compiled_script && player.script_pointer>=0 && player.compiled_script[player.script_pointer]){
      if(player.compiled_script[player.script_pointer].command=='forward')
        classes.push('walk')
      if(['east','west'].indexOf(player.direction)>-1)
        classes.push('horizontal');
      else classes.push('vertical')
    }
    return classes.join(' ')
  }

  function updatePlayer(){
    var dh=0;
    var dv=0;
    player = $scope.player
    updatePlayerState()
    if(player.script_pointer<player.compiled_script.length){
      if(player.script_pointer<0){
        player.script_pointer++
        return
      }
      step = player.compiled_script[player.script_pointer]
      switch(step.command){
        case 'repeat':
          if(step.current < step.desired){
            player.script_pointer = step.index
            step.current++
          } else {
            player.script_pointer++
            step.current=0
          }
        break;
        case 'forward':
          if(step.current < step.desired){
            switch(player.direction){
              case 'north':
                dh=0; dv=-1;
              break;
              case 'west':
                dh=-1; dv=0;
              break;
              case 'south':
                dh=0; dv=1;
              break;
              case 'east':
                dh=1; dv=0;
              break;
            }
            player.i += dh
            player.j += dv
            step.current++
          } else {
            player.script_pointer++
            step.current=0
          }
        break;
        case 'turn':
          if(step.direction=='left'){
            //turn left
            switch(player.direction){
              case 'north': player.direction='west'
              break;
              case 'west': player.direction='south'
              break;
              case 'south': player.direction='east'
              break;
              case 'east': player.direction='north'
              break;
            }
          }
          if(step.direction=='right'){
            //turn right
            switch(player.direction){
              case 'north': player.direction='east'
              break;
              case 'east': player.direction='south'
              break;
              case 'south': player.direction='west'
              break;
              case 'west': player.direction='north'
              break;
            }
          }
          player.script_pointer++
        break;
        case 'goto': player.script_pointer = step.index
        break;
        case 'wait':
          if(step.current < step.desired){
            step.current++
          }else{
            step.current=0
            player.script_pointer++
          }
        break;
      }
    }else{
      s= 'Script is finished. Add more moves or a loop!'
      if($scope.player.errors.indexOf(s)==-1)
        $scope.player.errors.push(s)
    }

  }

  function updatePlayerState(){
    player = $scope.player
    if(player.i==$scope.level.end.i && player.j==$scope.level.end.j){
      player.win=true
      if($scope.enableCelebration){
        celebrate()
        $scope.enableCelebration = false
      }
    }
    player.dead = deadlyCollision()
    if(player.dead){
      resetPlayer()
      player.script_pointer = -1
    }
  }

  function celebrate(){
    if(!$scope.mute) tada.play()
  }

  function deadlyCollision(){
    var dead=false
    //ran out of screen?
    if($scope.player.i<0 || $scope.player.j<0 || $scope.player.i>$scope.level.size.width || $scope.player.j>$scope.level.size.height){
      dead = true
      if(!$scope.mute) fall.play()
    }
    //ran into spikes?
    if(!dead && ['mine','spike'].indexOf($scope.level.terrain[$scope.player.j][$scope.player.i].type) > -1){
      dead=true
      if(!$scope.mute) electrify.play()
    }
    //how about enemies?
    if(!dead)
      for(i=0;i<$scope.level.enemies.length;i++)
        if($scope.player.i==$scope.level.enemies[i].i && $scope.player.j==$scope.level.enemies[i].j){
          if(!$scope.mute) kick.play()
          dead = true
        }
    return dead
  }

  function resetPlayer(){
    if($scope.player.origin){
      $scope.player.i = $scope.player.origin.i
      $scope.player.j = $scope.player.origin.j
      $scope.player.direction = $scope.player.origin.direction
      $scope.player.script_pointer = 0
    }
    $scope.player.dead = false
    $scope.enableCelebration = true
    $scope.tries++
    compileUserScript()
  }

  function compileUserScript(){
    var compile = scriptCompiler($scope.player.script)
    console.log(compile.result)
    $scope.player.compiled_script = compile.result
    $scope.player.errors = compile.errors
  }

  $scope.$on('update', function() {
    updatePlayer()
  })

  $scope.$on('pause', function() {
    resetPlayer()
  })
}])