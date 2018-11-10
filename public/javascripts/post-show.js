mapboxgl.accessToken = 'pk.eyJ1IjoiZHBhd3NvbjkwNSIsImEiOiJjam1ucXMzdnYwZmFkM3BsdWh3cTducmFnIn0.EOJQd5gfP0xCZOaAD41big';

var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v9',
  center: post.coordinates,
  zoom: 14
});

// create a HTML element for the post location marker
var el = document.createElement('div');
el.className = 'marker';

// make a marker for the location and add to the map
new mapboxgl.Marker(el)
  .setLngLat(post.coordinates)
  .setPopup(new mapboxgl.Popup({
      offset: 25
    }) // add popups
    .setHTML('<h3>' + post.title + '</h3><p>' + post.location + '</p>'))
  .addTo(map);

// Toggle edit review form
$('.toggle-edit-form').on('click', function () {
  // toggle the edit button text on click
  $(this).text() === 'Edit' ? $(this).text('Cancel') : $(this).text('Edit');
  // toggle visibility of the edit review form
  $(this).siblings('.edit-review-form').toggle();
});