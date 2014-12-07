angular.module('mrCompiler', []).
factory('scriptCompiler', function(){
  return function(script){
    var res = new Array
    var errors = new Array
    var labels = new Array

    if(script && script.trim()>''){
      var lines = script.split(/\n|;/)

      for(i=0;i<lines.length;i++){
        segments = lines[i].toLowerCase().trim().split(' ')
        command = segments[0]
        arg = segments[1]
        switch(command){
          case '#': break;
          case 'turn':
            if(arg=='left') res.push({command: 'turn', direction: 'left'});
            else if(arg=='right') res.push({command: 'turn', direction: 'right'});
            else errors.push("Argument is invalid. The argument for 'Turn' command should be either 'right' or 'left'")
          break;
          case 'forward':
            arg = parseInt(arg)
            if(arg>0) res.push({command: 'forward', desired: arg, current: 0});
            else errors.push("Argument is invalid. Argument for command 'forward' should be a positive intege number")
          break;
          case 'label':
            if(arg>''){
              labels.push({name: arg.toLowerCase(), index: res.length})
            }else errors.push("Argument is invalid. Please define a string as name of Label")
          break;
          case 'goto':
            if(arg>''){
              found=false
              for(j=0;j<labels.length;j++) if(labels[j].name==arg.toLowerCase()){
                res.push({command: 'goto', index: labels[j].index})
                found = true
              }
              if(!found) errors.push("Label '"+arg+"' is not defined!")
            }else errors.push("Argument is invalid. Please define a label for goto")
          break;
          case 'wait':
            arg = parseInt(arg)
            if(arg>0) res.push({command: 'wait', desired: arg, current: 0});
            else errors.push("Argument is invalid. Argument for command 'wait' should be a positive intege number")
          break;
          case '':
          break;
          default:
            errors.push("Syntax error! undefined command. command="+command+" , arg="+arg)
        }
      }
    }
    return {result: res, errors: errors}
  }
})