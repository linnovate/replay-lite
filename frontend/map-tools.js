function toggleSearchMode(btn) {
  if(btn.classList.contains('active')) {
    btn.classList.remove('active');
    hidePolygons();
    unsetMapSearchMode();
    map.off('mousemove')
    map.off('mousedown')
    map.off('mouseup')
  } else {
    cleanActiveButtons();
    btn.classList.add('active');
    setMapSearchMode();
    switch (btn.id) {
      case 'rectangle':
        setRectangleSearch();
        break
      case 'circle':
        setCircleSearch();
        break;
      case 'polygon':
        setPolygonSearch();
        break;
    }
  }
}

function setRectangleSearch() {
  map.on('mousedown', function(e) {
    var bounds = [e.latlng, e.latlng]
    rectangle.setBounds(bounds);
    rectangle.setStyle({ opacity: 1 })
    map.on('mousemove', function(e) {
      e.originalEvent.preventDefault()
      if(e.originalEvent.which != 1) {
        return map.off('mousemove')
      }
      bounds[1] = e.latlng;
      rectangle.setBounds(bounds);
      rectangle.setStyle({ fillOpacity: 0.2 })
      rectangle.setStyle({ opacity: 1 })
    })
  })
  map.on('mouseup', function(e) {
    map.off('mousemove')
    search(rectangle.toGeoJSON())
  })
}

function setCircleSearch() {
  map.on('mousedown', function(e) {
    var center = e.latlng;
    map.on('mousemove', function(e) {
      if(e.originalEvent.which != 1) {
        return map.off('mousemove')
      }
      var yAxes = map.distance(center, L.latLng(e.latlng.lat, center.lng));
      var xAxes = map.distance(center, L.latLng(center.lat, e.latlng.lng));
      var lat = center.lat - (center.lat-e.latlng.lat) / 2;
      var lng = center.lng - (center.lng-e.latlng.lng) / 2;

      circle.setRadius([xAxes / 2, yAxes / 2]);
      circle.setLatLng(L.latLng(lat, lng));
    })
  })
  map.on('mouseup', function(e) {
    map.off('mousemove')
  })
}

function setMapSearchMode() {
  map.dragging.disable()
  map._container.classList.add('search');
}

function unsetMapSearchMode() {
  map.dragging.enable()
  map._container.classList.remove('search');
}

function cleanActiveButtons() {
  var activeButtons = document.querySelectorAll('button.active');
  for(var button of activeButtons) {
    button.classList.remove('active');
  }
}

function hidePolygons() {
  circle.setStyle({ opacity: 0 });
  circle.setStyle({ fillOpacity: 0 });
  rectangle.setBounds([[0,0], [0,0]]);
  rectangle.setStyle({ opacity: 0 });
  rectangle.setStyle({ fillOpacity: 0 });
}
