//sample of level structure date (in this app I have a seed function that over rides this structure for test):
var level_theme = {
  //coordinate {i:0, j:0} is top left
  //coordinate i is column index
  //coordinate j is row index
  enemies: [
    {i: 0, j: 0, angle: 0, script: "", type: 'bug'},
    {i: 1, j: 1, angle: 0, script: "", type: 'bug'},
  ],
  //game board size
  size: {width: 2, height: 2},
  //defines type of each tile in the game
  terrain: [
    [
      {i:0, j:0, type: 'path'},
      {i:1, j:0, type: 'end'}
    ],[
      {i:0, j:1, type: 'mine'},
      {i:1, j:1, type: 'path'}
    ]
  ],
  //where user starts
  start: {i: 0, j: 1, direction: 'north'},
  //where user needs to go to
  end: {i: 1, j: 0},
}

sample_script = "# Program your character to get home!\n# you can use hash sign to add a comment. leave a space after hash!\n# Available command are: forward <number of moves>, turn <left/right>\n# label <name of label>, goto <name of label> and\n# repeat <number of cycles> <name of label>.\n# commands are case insensitive\nlabel L1;\nForward 1;\nturn right;\nforward 1;\nturn left;\ngoto L1;"

var levels = [
  {json: 'assets/levels/t1.json', category: 'tutorial'},
  {json: 'assets/levels/t2.json', category: 'tutorial'},
  {json: 'assets/levels/t3.json', category: 'tutorial'},
  {json: 'assets/levels/t4.json', category: 'tutorial'},
  {json: 'assets/levels/t5.json', category: 'tutorial'},
  {json: 'assets/levels/t6.json', category: 'tutorial'},
  {json: 'assets/levels/t7.json', category: 'tutorial'},
  {json: 'assets/levels/t8.json', category: 'tutorial'},
  {json: 'assets/levels/1.json', category: 'medium'}
]

var number_of_tutorial = 8

var App = angular.module('mazeRunner', ['mrCompiler','ui.ace'])

var music = new Audio('assets/sounds/bgMusic.mp3');
var electrify = new Audio('assets/sounds/ElectricShock.mp3');
var kick = new Audio('assets/sounds/RightHook.mp3')
var fall = new Audio('assets/sounds/GlassBreak.mp3')
var tada = new Audio('assets/sounds/TaDa.mp3')
electrify.volume = 0.3
tada.volume = 0.5
music.volume=0.3
music.loop = true

var txtWin = 'TADA! Congradulations!'
var txtFinish = 'Script is finished. Add more commands or a loop!'