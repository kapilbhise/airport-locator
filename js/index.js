let markers = [];
let luxembourg = [49.8153, 6.1296]
let map;
let markerClusters;

var myIcon = L.icon({
  iconUrl: "assets/airport.png",
  iconSize: [64, 64],
  iconAnchor: [32, 64],
  popupAnchor: [-3, -76],
});

initMap = () => {
  map = L.map('map');
  map.setView(luxembourg, 9);
  markerClusters = L.markerClusterGroup();
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '<a href="https://wikimediafoundation.org/wiki/Maps_Terms_of_Use">Wikimedia</a>',
      maxZoom: 19,
      minZoom: 1
  }).addTo(map);
  searchLocations();
  map.invalidateSize();
}

displayLocations = (locations) => {
  var locationsHTML = "";
  locations.filter( ({type}) => type.includes("Airport")).forEach( location => {
    const {name, city, country, code, woeid} = location;
    locationsHTML += `
    <div class="location">
      <div class="text-info">
        <span class="name">${name}</span>
        <span class="address">${city}, ${country}</span>
      </div>
      <div class="code">${code}</div>
    </div><hr>`
  })
  document.querySelector('.locations').innerHTML = locationsHTML;
}

searchLocations = () => {
  clearMarkers();
  var search = document.getElementById('input').value.toLowerCase();
  let foundLocations;
  if(search) {
    foundLocations = locations.filter(({name, city, state, country, code}) =>        
      ( (name ? name.toLowerCase().includes(search) : false) ||
        (city ? city.toLowerCase().includes(search) : false) ||
        (state ? state.toLowerCase().includes(search) : false) ||
        (country ? country.toLowerCase().includes(search) : false) ||
        (code ? code.toLowerCase().includes(search) : false) )
    );
  } else {
    foundLocations = locations;
  }
  displayLocations(foundLocations);
  createMarkers(foundLocations);
  setOnClickListener();
}

setOnClickListener = () => {
  document.querySelectorAll('.location').forEach((location, index) => {
    location.addEventListener('click', () => {
      let m = markers[index];
      map.setView([m._latlng.lat, m._latlng.lng], 9);
      m.openPopup();
      map.invalidateSize();
    });
  });
}

createMarkers = (locations) => {
  locations.filter( ({type}) => type.includes("Airport")).map((location) => {
    createMarker(location);
  });
  map.addLayer(markerClusters);
}

clearMarkers = () => {
  markerClusters.clearLayers();
  markers = [];
}

createMarker = ({name, code, city, country, lat, lon, woeid}) => {
  var html = `
  <div class="infoBox">
    <span><b>${name + " (" + code + ")" }</b></span>
    <hr>
    <span>
      <i class="fas fa-compass"></i>
      <a href="https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}" target="_blank">${" " + city + ", " + country}</a>
    </span>
    <span class="woeid"><i class="fas fa-hashtag"></i>${" " + woeid}</span>
  </div>`;
  var marker = L.marker([lat, lon], {icon: myIcon});
  marker.bindPopup(html);
  markerClusters.addLayer(marker);
  markers.push(marker);
}
