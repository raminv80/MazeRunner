App.controller('mrController', ['$scope', '$timeout', function($scope, $timeout){
  var block_px=30
  $scope.tickInterval = 300 //ms

  $scope.loading = true

  //=========game events============//
  var onStart = function(){
    $scope.play = true
    $scope.mute = false
    $scope.loadLevel()
  }

  var onUpdate = function(step) {
      if ($scope.play) {
        $scope.$broadcast ('update');
        updateGameState()
      }
      $timeout(onUpdate, $scope.tickInterval);
  }

  var updateGameState = function(){
    if($scope.player.dead) $scope.$broadcast ('onLoose');
    if($scope.player.win) $scope.$broadcast ('onWin');
  }

  //===============================//
  $scope.loadLevel = function(){
    seed() //temporary auto generate the level

    $scope.player = {type: 'player', i: level.start.i, j: level.start.j}
    $scope.player.script = sample_script
    $scope.loading = false
    $scope.tries = 0
  }

  function seed(){
    $scope.level = level
    $scope.level.size.width = 10
    $scope.level.size.height = 10
    for(var j=0;j<10;j++){
      $scope.level.terrain[j] = new Array
      for(var i=0; i<10; i++)$scope.level.terrain[j][i]={i: i, j:j, type: 'path'}
    }
    $scope.level.terrain[4][4].type='mine'
    $scope.level.terrain[4][5].type='mine'
    $scope.level.terrain[5][5].type='mine'
    $scope.level.terrain[6][5].type='mine'
    $scope.level.enemies = [
      {i:1, j:1, type: 'bug', script: "label l1; turn right; forward 4; turn right; turn right; forward 4; wait 1; forward 1; wait 2; turn right; turn right; forward 1; turn left; goto l1;"},
      {i:8, j:8, type: 'bug', script: "label l1;turn left; forward 3; turn right; turn right; forward 3; turn left; goto l1"},
      {i:8, j:1, type: 'bug', script: "label l1; wait 1; goto l1;", direction: "south"},
      {i:3, j:7, type: 'bug', script: "label l1; forward 3; turn right; forward 4; turn right; forward 9; turn right; forward 4; turn right; forward 6; goto l1;", direction: "west"},
    ]
    $scope.level.start = {i: 0, j:9}
    $scope.level.end = {i:9, j: 0}
    $scope.level.terrain[0][9].type='end'
  }

  $scope.console = function(){
    if($scope.play){
      if(!$scope.player.errors || $scope.player.errors.length==0) return 'Running the script...\nTo run a new script you need to Stop and Run it again.';
      else return $scope.player.errors.join('\n')
    }else return 'Press Run to start...'
  }

  $scope.elementClass = function(elm){
    return elm.type
  }

  $scope.setPlayGroundSize = function(){
    var w=level.size.width*block_px+level.size.width+1
    var h=level.size.height*(block_px-1)+level.size.height+1
    var sw=window.innerWidth;
    var sh=window.innerHeight;
    var ho = $scope.hideToolbar ? 0 : 450
    return {
      'width' : w+'px',
      'height' : h+'px',
      'left': Math.round((sw-ho-w)/2)+ho+'px',
      'top':  Math.round((sh-h)/2)+'px',
    }
  }

  $scope.setPos = function(obj){
    if(obj) return {'left' : obj.i*block_px+obj.i+1+'px', 'top' : obj.j*(block_px-1)+obj.j+1+'px'}
  }

  $scope.playPause = function(){
    $scope.tries = 0
    $scope.play = !$scope.play
    if(!$scope.play){
      console.log('pause')
      music.pause()
      $scope.$broadcast ('pause');
    }else{
      console.log('play', $scope.mute)
      if(!$scope.mute) music.play()
    }
  }

  $scope.toggleMute = function(){
    $scope.mute=!$scope.mute
    if(!$scope.mute) music.play();
    else music.pause()
  }

  $scope.step = function(){
    $scope.$broadcast ('update');
    updateGameState()
  }

  $scope.reset = function(){
    $scope.$broadcast ('pause');
  }

  $scope.toolBarState = function(){
    return $scope.hideToolbar ? 'hide' : 'show'
  }

  $scope.toggleToolbar = function(){
    $scope.hideToolbar=!$scope.hideToolbar
    $scope.setPlayGroundSize()
  }

  $scope.init = onStart
  // Start the timer
  $timeout(onUpdate, $scope.tickInterval);
}])