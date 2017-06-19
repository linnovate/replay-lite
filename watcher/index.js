const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
const queue = require('../utils/queue')

const dropfolder = 'content/dropfolder';

const watcher = chokidar.watch(dropfolder, {
  ignoreInitial:true
}).on('add', function (path, stats) {
  checkComplete(path, stats)
})

function checkComplete(path, stats) {
  setTimeout(() => {
    fs.stat(path, (err, s) => {
      // console.log(stats.mtime, s.mtime)
      if(s.mtime.getTime() == stats.mtime.getTime()) {
        console.log('File', path, 'has been added');
        queue('GoProFile', path)
      } else {
        checkComplete(path, s)
      }
    })
  }, 1000)
}
