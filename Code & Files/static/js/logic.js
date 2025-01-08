// Define the URL for the earthquake GeoJSON data
const earthquakeUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Create the map
const map = L.map("map").setView([37.7749, -122.4194], 5); // Centered on San Francisco, CA

// Add a tile layer (base map)
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors",
}).addTo(map);

// Function to determine marker size based on magnitude
function markerSize(magnitude) {
  return magnitude * 4; // Adjust size multiplier as needed
}

// Function to determine marker color based on depth
function markerColor(depth) {
  if (depth > 90) return "#FF4500"; // Deep red
  else if (depth > 70) return "#FF6347"; // Lighter red
  else if (depth > 50) return "#FFA500"; // Orange
  else if (depth > 30) return "#FFD700"; // Yellow
  else if (depth > 10) return "#ADFF2F"; // Green-yellow
  else return "#7FFF00"; // Bright green
}

// Fetch the earthquake data
fetch(earthquakeUrl)
  .then((response) => response.json())
  .then((data) => {
    // Loop through each feature in the GeoJSON data
    data.features.forEach((feature) => {
      const [longitude, latitude, depth] = feature.geometry.coordinates;
      const magnitude = feature.properties.mag;
      const place = feature.properties.place;

      // Create a circle marker
      L.circleMarker([latitude, longitude], {
        radius: markerSize(magnitude),
        fillColor: markerColor(depth),
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8,
      })
        .bindPopup(`<h3>${place}</h3><hr><p>Magnitude: ${magnitude}</p><p>Depth: ${depth} km</p>`)
        .addTo(map);
    });

    // Add a legend to the map
    const legend = L.control({ position: "bottomright" });
    legend.onAdd = function () {
      const div = L.DomUtil.create("div", "info legend");
      const depths = [-10, 10, 30, 50, 70, 90];
      const colors = ["#7FFF00", "#ADFF2F", "#FFD700", "#FFA500", "#FF6347", "#FF4500"];

      div.innerHTML += "<h4>Depth (km)</h4>";
      for (let i = 0; i < depths.length; i++) {
        div.innerHTML +=
          `<i style="background:${colors[i]}"></i> ` +
          `${depths[i]}${depths[i + 1] ? "&ndash;" + depths[i + 1] + " km<br>" : "+ km"}`;
      }
      return div;
    };
    legend.addTo(map);
  })
  .catch((error) => console.error("Error fetching earthquake data:", error));
