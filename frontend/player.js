function play(id) {
  var url = new URL(location);
  url.pathname = '/vod/mp4:' + id + '.mp4/manifest.mpd';
  console.log(url)

  dashPlayer.attachSource(url.href);

  initTrack(location.origin + '/api/vtt?id=' + id);
  showPlayer();
}

function stop(id) {
  dashPlayer.attachSource('');
  // dashPlayer.reset()
  hidePlayer();
  resetTrack();
  hidePolyline();
}

function initTrack(src) {
  resetTrack();
  var track = document.createElement('TRACK');
  track.oncuechange = onCueChange;
  track.onload = onVttLoad;
  track.setAttribute('default', true);
  track.setAttribute('kind', 'subtitle');
  track.setAttribute('src', src);
  window.player.appendChild(track);
}

function resetTrack() {
  var track = window.player.querySelector('track');
  if(track) {
    window.player.removeChild(track);
  }
}

function showPlayer() {
  window.player.classList.remove('inactive');
}

function hidePlayer() {
  window.player.classList.add('inactive');
}

function onCueChange() {
  var latLng;
  if(this.track.activeCues.length) {
    latLng = this.track.activeCues[0].text.split(',').reverse()
    window.marker.setLatLng(latLng)
    window.marker.setOpacity(1)
  } else {
    window.marker.setOpacity(0)
  }
}

function onVttLoad() {
  var route = [];
  for(var n of this.track.cues) {
    route.push(n.text.split(',').reverse())
  }
  window.polyline.setLatLngs(route);
  window.polyline.setStyle({ opacity: 1 })
}

function hidePolyline() {
  window.polyline.setLatLngs([[0, 0], [0, 0]]);
  window.polyline.setStyle({ opacity: 0 })
}
