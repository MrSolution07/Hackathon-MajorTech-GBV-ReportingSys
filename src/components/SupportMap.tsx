import { createElement, useMemo } from "react";
import { Platform, View } from "react-native";
import { WebView } from "react-native-webview";
import type { Place } from "@/src/data/helplines";

function mapHtml(pins: Place[]) {
  const data = JSON.stringify(
    pins.map((pin) => ({
      name: pin.name,
      detail: pin.detail,
      lat: pin.lat,
      lon: pin.lon,
    })),
  );
  return `<!DOCTYPE html>
<html><head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<style>
  html, body, #map { height: 100%; margin: 0; background: #D5E4DC; }
  .leaflet-popup-content { font-family: Georgia, serif; margin: 10px 12px; }
  .leaflet-popup-content strong { display: block; margin-bottom: 4px; }
</style>
</head><body>
<div id="map"></div>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script>
  const pins = ${data};
  const map = L.map("map", { zoomControl: true, attributionControl: true });
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: "&copy; OpenStreetMap"
  }).addTo(map);
  if (!pins.length) {
    map.setView([-28.6, 24.7], 5);
  } else {
    const bounds = [];
    pins.forEach((pin) => {
      const marker = L.circleMarker([pin.lat, pin.lon], {
        radius: 9, color: "#1F6F62", weight: 2, fillColor: "#F6E7B8", fillOpacity: 1
      }).addTo(map);
      const esc = (value) => String(value).replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
      marker.bindPopup("<strong>" + esc(pin.name) + "</strong>" + esc(pin.detail));
      bounds.push([pin.lat, pin.lon]);
    });
    map.fitBounds(bounds, { padding: [28, 28], maxZoom: 12 });
  }
</script>
</body></html>`;
}

export function SupportMap({ pins, height }: { pins: Place[]; height: number }) {
  const html = useMemo(() => mapHtml(pins), [pins]);
  if (Platform.OS === "web") {
    return createElement("iframe", {
      title: "Support services map",
      srcDoc: html,
      style: {
        width: "100%",
        height,
        border: 0,
        borderRadius: 22,
        backgroundColor: "#D5E4DC",
      },
    });
  }
  return (
    <View style={{ height, borderRadius: 22, overflow: "hidden" }}>
      <WebView originWhitelist={["*"]} source={{ html }} style={{ flex: 1, backgroundColor: "#D5E4DC" }} />
    </View>
  );
}
