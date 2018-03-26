/*function search() {
  var activeButton = document.querySelector('.active')
  if(activeButton) activeButton.classList.remove('active');
  map.dragging.enable();
  map._container.classList.remove('search');
  map.off('mousemove')
  map.off('mousedown')
  map.off('mouseup')

  var geoJSON = JSON.stringify(rectangle.toGeoJSON(),null,2);

  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/api/search', true)
  xhr.setRequestHeader('Content-Type', 'application/json')
  xhr.onload = function() {
    if(xhr.status != 200) {
      return console.log(xhr.status, xhr.response);
    }

    var response = JSON.parse(xhr.response);

    if(!(response instanceof Array)) {
      return console.error('not an array')
    }

    var results = document.querySelector('#results');
    results.innerHTML = '';

    response.forEach(function(ele) {
      ele.start = new Date(ele.time[0])
      ele.end = new Date(ele.time[1])
      ele.duration = ele.end - ele.start;
      var div = document.createElement('DIV');
      div.class = 'record';
      div.setAttribute('video-id', ele._id);
      div.innerHTML = '<span>' + formatTime(ele.duration) + '</span>';
      div.innerHTML += '<button onclick="play(this.parentElement)">Play</button>'
      results.appendChild(div);
    })
  }
  xhr.send(geoJSON)
}*/

function formatTime(time) {
  var h = Math.floor(time / 3600000)
  if(h) {
    h += ':';
    if(h < 10) {
      h = '0' + h;
    }
  } else {
    h = '';
  }
  var ms = new Date(time).toISOString().slice(14,-5)
  return `${h}${ms}`;
}

function search(geo) {
  var geo = JSON.stringify(geo);
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/api/search', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onload = function() {
    if(xhr.status != 200) {
      return console.log(xhr.status, xhr.response);
    }

    var response = JSON.parse(xhr.response);

    if(!(response instanceof Array)) {
      return console.error('not an array')
    }

    window.list.innerHTML = '';
    if(response.length) {
      appendHeaders();
      response.forEach(appendToList)
    }

  }
  xhr.send(geo)
}

function appendHeaders() {
  var li = document.createElement('LI');
  li.classList.add('headers');
  li.innerHTML = ''
    + '<div>Date</div>'
    + '<div>Duration</div>'
    // + '<div>Source</div>'
    // + '<div>Source ID</div>'
    // + '<div>Views</div>'
    + '<div style="width: 20px;"></div>';
  window.list.appendChild(li);
}

function appendToList(ele) {

  var start = new Date(ele.time[0]);
  var end = new Date(ele.time[1]);
  var duration = end - start;
  var li = document.createElement('LI');
  li.setAttribute('video-id', ele._id);

  var html = '';

  // date
  html += '<div class="item-date">';
  html += '<span>' + start.toLocaleDateString('en-GB') + '</span>';
  html += '<span>' + start.toLocaleTimeString('en-GB') + '</span></div>';

  // duration
  html += '<div class="item-duration"><span>' + formatTime(duration) + '</span></div>';

  // // source
  // html += '<div class="item-source"><span>not known...</span></div>';

  // // camera ID
  // html += '<div class="item-source-id"><span>not known...</span></div>';

  // // views
  // html += '<div class="item-views"><span>N/A</span></div>';

  // controls
  html += '<div class="item-controls">';
  html += '<button onclick="play(\'' + ele._id + '\')">&#10148;</button>';
  html += '<button>&#9733;</button>'
  // html += '<button>&#10133;</button></div>';
  html += '<button onclick="stop(\'' + ele._id + '\')">&#10060;</button></div>';

  li.innerHTML = html;
  window.list.appendChild(li);
}
