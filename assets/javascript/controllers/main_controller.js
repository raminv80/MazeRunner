App.controller('mrController', ['$scope', '$timeout', '$http', function($scope, $timeout, $http){
  var block_px=30
  $scope.tickInterval = 300 //ms
  $scope.current_level = 0

  $scope.loading = true
  $scope.seconds = 0

  //=========game events============//
  var onStart = function(){
    $scope.play = false
    $scope.mute = true
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
    level_json = levels[$scope.current_level].json
    $http.get(level_json).success(function(lvlData){
        $scope.seconds=0
        $scope.level = lvlData;
        $scope.setPlayGroundSize()
        $scope.player = {
          type: 'player',
          i: $scope.level.start.i, j: $scope.level.start.j,
          direction: $scope.level.start.direction ? $scope.level.start.direction : 'north'
        }
        $scope.player.script = $scope.level.start.default_script
        $scope.tries = 0
        $scope.play = $scope.level.start.play
        if((navigator.platform.indexOf("iPhone") == -1) && (navigator.platform.indexOf("iPod") == -1))
          $scope.mute = $scope.level.start.mute
        if(!$scope.mute) music.play()
        $scope.loading = false
        $scope.$broadcast ('loaded');
        // Start the timer
        $timeout(onUpdate, $scope.tickInterval);
    }).error(function(){
      console.log('Error loading '+level_json+', falling back to auto seed the level!')
      seed() //temporary auto generate the level
      $scope.player = {type: 'player', i: level_theme.start.i, j: level_theme.start.j, direction: 'north'}
      $scope.player.script = sample_script
      $scope.loading = false
      $scope.play = true
      $scope.mute = false
      $scope.tries = 0
      $scope.seconds = 0
      $scope.$broadcast ('loaded');
    })
  }

  function seed(){
    $scope.level = level_theme
    $scope.level.size.width = 10
    $scope.level.size.height = 10
    for(var j=0;j<10;j++){
      $scope.level.terrain[j] = new Array()
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
      if(!$scope.player.errors || $scope.player.errors.length===0) return 'Running the script...\nTo run a new script you need to Stop and Run it again.';
      else return $scope.player.errors.join('\n')
    }else return 'Press Run to start...'
  }

  $scope.elementClass = function(elm){
    return elm.type
  }

  $scope.setPlayGroundSize = function(){
    if(!$scope.level) return;
    var w=$scope.level.size.width*block_px+$scope.level.size.width+1
    var h=$scope.level.size.height*(block_px-1)+$scope.level.size.height+1
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
      music.pause()
      $scope.$broadcast ('pause');
    }else{
      if(!$scope.mute) music.play()
    }
  }

  $scope.toggleMute = function(){
    $scope.mute=!$scope.mute
    if(!$scope.mute) music.play();
    else music.pause()
  }

  $scope.step = function(){
    $scope.seconds++
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
}])