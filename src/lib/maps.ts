// Free & Open-Source Map & Geocoding Utilities for PATGOLITO
// Powered by OpenStreetMap (OSM), Nominatim Geocoding, and OSRM Free Routing (No API Key Required)

export interface LatLng {
  lat: number;
  lng: number;
}

export interface PlacePrediction {
  description: string;
  mainText: string;
  secondaryText?: string;
  placeId: string;
  lat?: number;
  lng?: number;
  rawSuggestion?: any;
}

export interface PlaceDetails {
  address: string;
  lat: number;
  lng: number;
  placeId: string;
}

export interface RouteInfo {
  distanceMeters: number;
  distanceKm: number;
  durationSeconds: number;
  durationMinutes: number;
  polylinePath?: LatLng[];
}

// Curated instant-search directory of prominent Lucknow & Barabanki logistics hubs, mandis, residential & commercial sectors
export const POPULAR_LUCKNOW_PLACES: Array<{ name: string; area: string; lat: number; lng: number }> = [
  { name: 'Transport Nagar (TP Nagar)', area: 'Kanpur Road, Lucknow', lat: 26.7725, lng: 80.8872 },
  { name: 'Hazratganj', area: 'Central Lucknow, Uttar Pradesh', lat: 26.8467, lng: 80.9462 },
  { name: 'Gomti Nagar', area: 'Vibhav Khand / Patrakarpuram, Lucknow', lat: 26.8532, lng: 80.9995 },
  { name: 'Gomti Nagar Extension', area: 'Shaheed Path, Lucknow', lat: 26.8189, lng: 81.0185 },
  { name: 'Charbagh Railway Station', area: 'Station Road, Lucknow', lat: 26.8315, lng: 80.9238 },
  { name: 'Alambagh Bus Terminal', area: 'Alambagh, Lucknow', lat: 26.8118, lng: 80.9031 },
  { name: 'Indira Nagar', area: 'Faizabad Road, Lucknow', lat: 26.8858, lng: 80.9859 },
  { name: 'Nishatganj', area: 'University Road, Lucknow', lat: 26.8677, lng: 80.9582 },
  { name: 'Aminabad Market', area: 'Old Lucknow, Uttar Pradesh', lat: 26.8436, lng: 80.9272 },
  { name: 'Chowk', area: 'Heritage Zone, Old Lucknow', lat: 26.8682, lng: 80.9077 },
  { name: 'Dubagga Vegetable Mandi', area: 'Hardoi Road, Lucknow', lat: 26.8685, lng: 80.8524 },
  { name: 'Chinhat Industrial Area', area: 'Ayodhya Highway, Lucknow', lat: 26.8974, lng: 81.0372 },
  { name: 'Amausi Airport (CCS International)', area: 'Kanpur Road, Lucknow', lat: 26.7606, lng: 80.8893 },
  { name: 'Ashiyana', area: 'LDA Colony, Lucknow', lat: 26.7908, lng: 80.9103 },
  { name: 'Rajajipuram', area: 'Talkatora Road, Lucknow', lat: 26.8407, lng: 80.8821 },
  { name: 'Talkatora Industrial Estate', area: 'Rajajipuram, Lucknow', lat: 26.8286, lng: 80.8897 },
  { name: 'Mahanagar', area: 'Mandir Marg, Lucknow', lat: 26.8791, lng: 80.9512 },
  { name: 'Aliganj', area: 'Kapoorthala, Lucknow', lat: 26.8906, lng: 80.9416 },
  { name: 'Vikas Nagar', area: 'Ring Road, Lucknow', lat: 26.8976, lng: 80.9621 },
  { name: 'Janki Puram', area: 'Sitapur Road, Lucknow', lat: 26.9242, lng: 80.9472 },
  { name: 'Bakshi Ka Talab (BKT)', area: 'Sitapur Highway, Lucknow', lat: 27.0016, lng: 80.9231 },
  { name: 'Sarojini Nagar', area: 'Kanpur Road Industrial Belt, Lucknow', lat: 26.7456, lng: 80.8654 },
  { name: 'Shaheed Path - Lulu Mall Junction', area: 'Golf City, Lucknow', lat: 26.7865, lng: 81.0028 },
  { name: 'Ekana Stadium / Plassio Mall', area: 'Gomti Nagar Extension, Lucknow', lat: 26.8092, lng: 81.0152 },
  { name: 'Aishbagh Goods Shed', area: 'Industrial Area, Lucknow', lat: 26.8378, lng: 80.9082 },
  { name: 'Kursi Road Industrial Corridor', area: 'Lucknow-Barabanki Border', lat: 26.9754, lng: 80.9856 },
  { name: 'Barabanki City Centre', area: 'Nawabganj, Barabanki', lat: 26.9268, lng: 81.1834 },
  { name: 'Barabanki Bus Station', area: 'Railway Station Road, Barabanki', lat: 26.9312, lng: 81.1889 },
  { name: 'Mati Industrial Area', area: 'Deva Road, Barabanki', lat: 26.9452, lng: 81.1412 },
  { name: 'Deva Sharif', area: 'Barabanki, Uttar Pradesh', lat: 27.0289, lng: 81.1738 },
];

// Calculate Haversine straight-line distance in km with real-world road multiplier
export function calculateHaversineKm(p1: LatLng, p2: LatLng): number {
  const R = 6371; // Earth radius in km
  const dLat = ((p2.lat - p1.lat) * Math.PI) / 180;
  const dLng = ((p2.lng - p1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((p1.lat * Math.PI) / 180) *
      Math.cos((p2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const straightKm = R * c;
  // 1.28 represents standard road curvature & traffic routing overhead
  return Math.round(straightKm * 1.28 * 10) / 10;
}

// Free Place Autocomplete & Search using instant local index + OpenStreetMap Nominatim API
export async function getPlacePredictions(input: string): Promise<PlacePrediction[]> {
  if (!input || input.trim().length < 2) return [];

  const cleanQuery = input.trim().toLowerCase();
  const predictions: PlacePrediction[] = [];

  // 1. Instant match from comprehensive Lucknow/Barabanki logistics directory
  const localMatches = POPULAR_LUCKNOW_PLACES.filter((p) => {
    return (
      p.name.toLowerCase().includes(cleanQuery) ||
      p.area.toLowerCase().includes(cleanQuery)
    );
  });

  localMatches.slice(0, 5).forEach((p) => {
    predictions.push({
      description: `${p.name}, ${p.area}`,
      mainText: p.name,
      secondaryText: p.area,
      placeId: `osm_local_${p.name.replace(/\s+/g, '_').toLowerCase()}`,
      lat: p.lat,
      lng: p.lng,
    });
  });

  // 2. Query free OpenStreetMap Nominatim search for global & precise street level addresses
  try {
    const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      input.trim()
    )}&countrycodes=in&viewbox=80.6,27.2,81.4,26.6&bounded=0&limit=6&addressdetails=1`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(nominatimUrl, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
      },
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        data.forEach((item: any) => {
          const lat = parseFloat(item.lat);
          const lng = parseFloat(item.lon);
          const fullAddress = item.display_name || item.name;

          // Avoid duplicate entries
          const isDuplicate = predictions.some(
            (p) => Math.abs((p.lat || 0) - lat) < 0.001 && Math.abs((p.lng || 0) - lng) < 0.001
          );

          if (!isDuplicate && !isNaN(lat) && !isNaN(lng)) {
            const parts = fullAddress.split(',');
            const mainText = parts[0] ? parts[0].trim() : item.name;
            const secondaryText = parts.slice(1, 4).join(',').trim() || 'Uttar Pradesh, India';

            predictions.push({
              description: fullAddress,
              mainText,
              secondaryText,
              placeId: `osm_${item.osm_type || 'node'}_${item.osm_id || Math.random()}`,
              lat,
              lng,
              rawSuggestion: item,
            });
          }
        });
      }
    }
  } catch (err) {
    // If external OSM search is throttled or offline, local directory guarantees smooth operation
    console.debug('OSM Nominatim fetch skipped/timed out, using local directory:', err);
  }

  // 3. If no match at all, generate a graceful custom place prediction centered in Lucknow
  if (predictions.length === 0) {
    predictions.push({
      description: `${input.trim()}, Lucknow, Uttar Pradesh`,
      mainText: input.trim(),
      secondaryText: 'Lucknow, Uttar Pradesh',
      placeId: `custom_${Date.now()}`,
      lat: 26.8467,
      lng: 80.9462,
    });
  }

  return predictions;
}

// Get Place Details with exact coordinates
export async function getPlaceDetails(
  placeId: string,
  fallbackAddress?: string,
  rawSuggestion?: any
): Promise<PlaceDetails> {
  // If raw coordinates exist in suggestion
  if (rawSuggestion?.lat && (rawSuggestion?.lon || rawSuggestion?.lng)) {
    const lat = parseFloat(rawSuggestion.lat);
    const lng = parseFloat(rawSuggestion.lon || rawSuggestion.lng);
    if (!isNaN(lat) && !isNaN(lng)) {
      return {
        address: fallbackAddress || rawSuggestion.display_name || 'Lucknow Location',
        lat,
        lng,
        placeId,
      };
    }
  }

  // Check local curated directory
  const localMatch = POPULAR_LUCKNOW_PLACES.find((p) =>
    placeId.includes(p.name.replace(/\s+/g, '_').toLowerCase())
  );
  if (localMatch) {
    return {
      address: `${localMatch.name}, ${localMatch.area}`,
      lat: localMatch.lat,
      lng: localMatch.lng,
      placeId,
    };
  }

  // Default to Lucknow City Center if coordinates cannot be resolved
  return {
    address: fallbackAddress || 'Lucknow, Uttar Pradesh, India',
    lat: 26.8467,
    lng: 80.9462,
    placeId,
  };
}

// Free Reverse Geocoding using OpenStreetMap Nominatim
export async function reverseGeocode(lat: number, lng: number): Promise<PlaceDetails> {
  try {
    const reverseUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(reverseUrl, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
      },
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.display_name) {
        return {
          address: data.display_name,
          lat,
          lng,
          placeId: `osm_rev_${data.osm_id || Date.now()}`,
        };
      }
    }
  } catch (err) {
    console.debug('Reverse geocode fallback to GPS coordinates:', err);
  }

  return {
    address: `Location (${lat.toFixed(4)}, ${lng.toFixed(4)}), Lucknow, UP`,
    lat,
    lng,
    placeId: `gps_${Date.now()}`,
  };
}

// Free Road Distance & Routing using Open Source Routing Machine (OSRM) + Server Proxy + Geometric Fallback
export async function calculateRouteDistance(
  origin: LatLng,
  destination: LatLng,
  waypoints?: LatLng[]
): Promise<RouteInfo> {
  // 1. Try local server-side endpoint first (/api/maps/route)
  try {
    const res = await fetch('/api/maps/route', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ origin, destination, waypoints }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.distanceKm !== undefined && data.distanceMeters !== undefined) {
        return {
          distanceMeters: data.distanceMeters,
          distanceKm: data.distanceKm,
          durationSeconds: data.durationSeconds || Math.round(data.distanceKm * 180),
          durationMinutes: data.durationMinutes || Math.max(5, Math.round(data.distanceKm * 3)),
          polylinePath: data.polylinePath,
        };
      }
    }
  } catch (err) {
    console.debug('Backend route endpoint not reachable, trying direct OSRM:', err);
  }

  // 2. Direct OSRM (Open Source Routing Machine) Free Public Driving API
  try {
    const validWaypoints = (waypoints || []).filter(
      (w) => w.lat !== null && w.lng !== null && !isNaN(w.lat) && !isNaN(w.lng)
    );

    let coordsString = `${origin.lng},${origin.lat}`;
    validWaypoints.forEach((wp) => {
      coordsString += `;${wp.lng},${wp.lat}`;
    });
    coordsString += `;${destination.lng},${destination.lat}`;

    const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${coordsString}?overview=full&geometries=geojson`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const osrmRes = await fetch(osrmUrl, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (osrmRes.ok) {
      const osrmData = await osrmRes.json();
      const route = osrmData.routes?.[0];

      if (route && route.distance !== undefined) {
        const meters = Math.round(route.distance);
        const km = Math.max(1.0, Math.round((meters / 1000) * 10) / 10);
        const durationSecs = Math.round(route.duration || (meters / 1000) * 180);
        const durationMins = Math.max(5, Math.round(durationSecs / 60));

        const polyline: LatLng[] = [];
        if (route.geometry?.coordinates && Array.isArray(route.geometry.coordinates)) {
          route.geometry.coordinates.forEach((coord: [number, number]) => {
            polyline.push({ lat: coord[1], lng: coord[0] });
          });
        }

        return {
          distanceMeters: meters,
          distanceKm: km,
          durationSeconds: durationSecs,
          durationMinutes: durationMins,
          polylinePath: polyline.length > 0 ? polyline : undefined,
        };
      }
    }
  } catch (err) {
    console.debug('OSRM direct routing skipped, using geometric calculation:', err);
  }

  // 3. Reliable Geometric Fallback: Haversine with real road topology factor
  const distKm = calculateHaversineKm(origin, destination);
  return {
    distanceMeters: Math.round(distKm * 1000),
    distanceKm: Math.max(1.0, distKm),
    durationSeconds: Math.round(distKm * 180),
    durationMinutes: Math.max(5, Math.round((distKm * 180) / 60)),
  };
}
