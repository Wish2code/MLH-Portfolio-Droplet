(function renderMap() {
    "use strict";

    var root = document.getElementById("map-root");
    var payloadNode = document.getElementById("map-payload");
    if (!root || !payloadNode || typeof L === "undefined") {
        return;
    }

    var payload = {};
    try {
        payload = JSON.parse(payloadNode.textContent || "{}");
    } catch (_error) {
        payload = {};
    }

    var mapStyle = isObject(payload.map_style) ? payload.map_style : {};
    var markerColor = asColor(mapStyle.marker_color, "#E10600");

    var map = L.map(root, { worldCopyJump: true, scrollWheelZoom: false }).setView([10, 0], 2);
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    }).addTo(map);

    var locations = normalizeLocations(payload.locations);
    if (!locations.length) {
        return;
    }

    var bounds = [];
    locations.forEach(function (location) {
        var marker = L.circleMarker([location.lat, location.lng], {
            radius: 7,
            color: markerColor,
            fillColor: markerColor,
            fillOpacity: 0.9,
            weight: 2,
        }).addTo(map);

        marker.bindPopup(
            "<strong>" + escapeHtml(location.label || location.name) + "</strong><br>" +
            escapeHtml(location.name) + ", " + escapeHtml(location.country) +
            (location.note ? "<br>" + escapeHtml(location.note) : "")
        );
        bounds.push([location.lat, location.lng]);
    });

    for (var index = 0; index < locations.length - 1; index += 1) {
        L.polyline(
            [
                [locations[index].lat, locations[index].lng],
                [locations[index + 1].lat, locations[index + 1].lng],
            ],
            {
                color: markerColor,
                weight: 1.5,
                opacity: 0.55,
                dashArray: "2 8",
            }
        ).addTo(map);
    }

    map.fitBounds(bounds, { padding: [40, 40] });

    function normalizeLocations(rawLocations) {
        if (!Array.isArray(rawLocations)) {
            return [];
        }
        return rawLocations
            .map(function (entry) {
                if (!isObject(entry)) {
                    return null;
                }
                var id = asText(entry.id);
                var name = asText(entry.name);
                var country = asText(entry.country);
                var lat = asNumber(entry.lat);
                var lng = asNumber(entry.lng);
                if (!id || !name || !country || lat === null || lng === null) {
                    return null;
                }
                return {
                    id: id,
                    name: name,
                    country: country,
                    label: asText(entry.label) || name,
                    note: asText(entry.note),
                    lat: lat,
                    lng: lng,
                };
            })
            .filter(Boolean);
    }

    function asText(value) {
        return typeof value === "string" ? value.trim() : "";
    }

    function asColor(value, fallback) {
        return asText(value) || fallback;
    }

    function asNumber(value) {
        if (typeof value === "number" && Number.isFinite(value)) {
            return value;
        }
        return null;
    }

    function isObject(value) {
        return value !== null && typeof value === "object" && !Array.isArray(value);
    }

    function escapeHtml(text) {
        var div = document.createElement("div");
        div.textContent = text;
        return div.innerHTML;
    }
})();
