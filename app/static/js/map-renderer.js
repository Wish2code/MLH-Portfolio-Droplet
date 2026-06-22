(function renderRealMap() {
    const root = document.getElementById("map-root");
    const payloadNode = document.getElementById("map-payload");
    if (!root || !payloadNode || typeof L === "undefined") {
        return;
    }

    let payload = {};
    try {
        payload = JSON.parse(payloadNode.textContent || "{}");
    } catch (_error) {
        payload = {};
    }

    const mapStyle = isObject(payload.map_style) ? payload.map_style : {};
    const markerColor = asColor(mapStyle.marker_color, "#E02424");
    const lineColor = "#000000";

    const map = L.map(root, { worldCopyJump: true }).setView([20, 0], 2);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    const locations = normalizeLocations(payload.locations);
    if (locations.length) {
        renderLocations(locations);
    } else {
        renderOpenApiFallbackPlaces();
    }

    function renderLocations(locations) {
        const bounds = [];

        locations.forEach((location) => {
            const marker = L.circleMarker([location.lat, location.lng], {
                radius: 7,
                color: markerColor,
                fillColor: markerColor,
                fillOpacity: 0.9,
                weight: 2,
            }).addTo(map);

            marker.bindPopup(
                `<strong>${escapeHtml(location.label || location.name)}</strong><br>` +
                `${escapeHtml(location.name)}, ${escapeHtml(location.country)}` +
                (location.note ? `<br>${escapeHtml(location.note)}` : "")
            );
            bounds.push([location.lat, location.lng]);
        });

        for (let index = 0; index < locations.length - 1; index += 1) {
            const from = locations[index];
            const to = locations[index + 1];
            L.polyline(
                [
                    [from.lat, from.lng],
                    [to.lat, to.lng],
                ],
                {
                    color: lineColor,
                    weight: 1,
                    opacity: 0.9,
                    dashArray: "2 6",
                }
            ).addTo(map);
        }

        if (bounds.length) {
            map.fitBounds(bounds, { padding: [30, 30] });
        }
    }

    async function renderOpenApiFallbackPlaces() {
        const fallbackQueries = ["Accra", "London", "New York", "Tokyo", "Cape Town"];
        const fetched = [];

        for (const query of fallbackQueries) {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(query)}`
            );
            if (!response.ok) {
                continue;
            }
            const results = await response.json();
            if (!Array.isArray(results) || !results.length) {
                continue;
            }
            const row = results[0];
            const lat = Number(row.lat);
            const lng = Number(row.lon);
            if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
                continue;
            }
            fetched.push({
                id: query.toLowerCase().replace(/\s+/g, "-"),
                name: query,
                country: row.display_name || query,
                label: query,
                note: "OpenStreetMap API preview place",
                lat,
                lng,
            });
        }

        if (!fetched.length) {
            return;
        }
        renderLocations(fetched);
    }

    function normalizeLocations(rawLocations) {
        if (!Array.isArray(rawLocations)) {
            return [];
        }
        return rawLocations
            .map((entry) => {
                if (!isObject(entry)) {
                    return null;
                }
                const id = asText(entry.id);
                const name = asText(entry.name);
                const country = asText(entry.country);
                const lat = asNumber(entry.lat);
                const lng = asNumber(entry.lng);
                if (!id || !name || !country || lat === null || lng === null) {
                    return null;
                }
                return {
                    id,
                    name,
                    country,
                    label: asText(entry.label) || name,
                    note: asText(entry.note),
                    lat,
                    lng,
                };
            })
            .filter(Boolean);
    }

    function asText(value) {
        return typeof value === "string" ? value.trim() : "";
    }

    function asColor(value, fallback) {
        const color = asText(value);
        return color || fallback;
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
        const div = document.createElement("div");
        div.textContent = text;
        return div.innerHTML;
    }
})();
