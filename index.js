// solutions here
var events = require('events');
var lib = require('./lib/lib');

//Will contain the tasks to run in parallel to each other
const parallelTasks = [];

async function doAsync(array, parallel, callback) {
  for (let index = 0; index < array.length; index++) {
    let item = array[index];

    if(!Array.isArray(item)) {
      //If the item is not an array and parallel is false, run directly the asyncOp
      if (!parallel) {
        await lib.asyncOp(item);
      } else {
        //Else, add the lib.asyncOp to the list of parallel tasks
        parallelTasks.push(lib.asyncOp(item));
      }

    } else {
  		//Collect all tasks
  		await doAsync(item, true);
  		//Run tasks together
  		await Promise.all(parallelTasks);
    }
  }
}


class RandStringSource extends events.EventEmitter {
  constructor(x) {
    super();
    var me = this;
    var floatingPayload = "";

      x.on('data', function(chunk) {
        let lastIndex = chunk.lastIndexOf(".");
        let possiblePayload = chunk;

        if(lastIndex >= 0 && lastIndex < chunk.length) {
          //Remove substring that is not enclosed by dots
          possiblePayload = chunk.slice(0, lastIndex);

          let splitPayload = possiblePayload.split(".");
          splitPayload.forEach(function(element){
            me.emit('data', floatingPayload + element);
            floatingPayload = "";
          });
        }

        floatingPayload += chunk.substring(lastIndex+1);
    });
  }
}



module.exports = {
  doAsync,
  RandStringSource
};
