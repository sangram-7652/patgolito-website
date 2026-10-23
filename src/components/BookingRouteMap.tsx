import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Navigation } from 'lucide-react';
import { LatLng } from '../lib/maps';

interface BookingRouteMapProps {
  pickup: { lat: number | null; lng: number | null; address?: string };
  drop: { lat: number | null; lng: number | null; address?: string };
  stops?: Array<{ lat: number | null; lng: number | null; address?: string }>;
  distanceKm?: number;
  durationMinutes?: number;
}

export const BookingRouteMap: React.FC<BookingRouteMapProps> = ({
  pickup,
  drop,
  stops = [],
  distanceKm,
  durationMinutes,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const routeLayerGroupRef = useRef<L.LayerGroup | null>(null);

  const validPickup =
    pickup.lat !== null && pickup.lng !== null && !isNaN(pickup.lat) && !isNaN(pickup.lng)
      ? { lat: pickup.lat, lng: pickup.lng, address: pickup.address }
      : null;

  const validDrop =
    drop.lat !== null && drop.lng !== null && !isNaN(drop.lat) && !isNaN(drop.lng)
      ? { lat: drop.lat, lng: drop.lng, address: drop.address }
      : null;

  const validStops = stops
    .filter((s) => s.lat !== null && s.lng !== null && !isNaN(s.lat) && !isNaN(s.lng))
    .map((s) => ({ lat: s.lat!, lng: s.lng!, address: s.address }));

  // Initialize Leaflet Map instance once
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [26.85, 80.95],
        zoom: 12,
        zoomControl: true,
        attributionControl: false,
      });

      // Free OpenStreetMap Tile Layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      // Attribution control in bottom-right
      L.control
        .attribution({ position: 'bottomright', prefix: 'OpenStreetMap (Free)' })
        .addTo(map);

      const layerGroup = L.layerGroup().addTo(map);
      routeLayerGroupRef.current = layerGroup;
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Markers, Route Polyline & Bounds whenever locations change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = routeLayerGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    if (!validPickup || !validDrop) return;

    const latLngBounds = L.latLngBounds([]);

    // Custom Emerald Pickup Marker Pin
    const pickupHtml = `
      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        transform: translate(-50%, -100%);
      ">
        <div style="
          background-color: #10B981;
          color: #ffffff;
          padding: 4px 8px;
          border-radius: 9999px;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.05em;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3);
          border: 2px solid #ffffff;
          white-space: nowrap;
          margin-bottom: 2px;
        ">
          PICKUP
        </div>
        <div style="
          width: 14px;
          height: 14px;
          background-color: #10B981;
          border: 3px solid #ffffff;
          border-radius: 50%;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        "></div>
      </div>
    `;

    const pickupIcon = L.divIcon({
      html: pickupHtml,
      className: 'patgolito-pickup-marker',
      iconSize: [0, 0],
    });

    const pickupMarker = L.marker([validPickup.lat, validPickup.lng], { icon: pickupIcon })
      .bindPopup(
        `<div style="font-family: sans-serif; font-size: 12px; font-weight: bold; color: #18181b;">
          <span style="color: #059669;">Pickup:</span> ${validPickup.address || 'Selected Location'}
        </div>`
      );
    layerGroup.addLayer(pickupMarker);
    latLngBounds.extend([validPickup.lat, validPickup.lng]);

    // Intermediate Waypoints Markers
    validStops.forEach((stop, idx) => {
      const stopHtml = `
        <div style="
          display: flex;
          flex-direction: column;
          align-items: center;
          transform: translate(-50%, -100%);
        ">
          <div style="
            background-color: #3f3f46;
            color: #ffffff;
            padding: 2px 6px;
            border-radius: 9999px;
            font-size: 9px;
            font-weight: 800;
            border: 2px solid #ffffff;
            margin-bottom: 2px;
            white-space: nowrap;
          ">
            STOP ${idx + 1}
          </div>
          <div style="
            width: 10px;
            height: 10px;
            background-color: #3f3f46;
            border: 2px solid #ffffff;
            border-radius: 50%;
          "></div>
        </div>
      `;
      const stopIcon = L.divIcon({
        html: stopHtml,
        className: 'patgolito-stop-marker',
        iconSize: [0, 0],
      });
      const stopMarker = L.marker([stop.lat, stop.lng], { icon: stopIcon });
      layerGroup.addLayer(stopMarker);
      latLngBounds.extend([stop.lat, stop.lng]);
    });

    // Custom Black Drop Marker Pin
    const dropHtml = `
      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        transform: translate(-50%, -100%);
      ">
        <div style="
          background-color: #000000;
          color: #ffffff;
          padding: 4px 8px;
          border-radius: 9999px;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.05em;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3);
          border: 2px solid #ffffff;
          white-space: nowrap;
          margin-bottom: 2px;
        ">
          DROP
        </div>
        <div style="
          width: 14px;
          height: 14px;
          background-color: #000000;
          border: 3px solid #ffffff;
          border-radius: 50%;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        "></div>
      </div>
    `;

    const dropIcon = L.divIcon({
      html: dropHtml,
      className: 'patgolito-drop-marker',
      iconSize: [0, 0],
    });

    const dropMarker = L.marker([validDrop.lat, validDrop.lng], { icon: dropIcon })
      .bindPopup(
        `<div style="font-family: sans-serif; font-size: 12px; font-weight: bold; color: #18181b;">
          <span style="color: #000000;">Drop:</span> ${validDrop.address || 'Selected Location'}
        </div>`
      );
    layerGroup.addLayer(dropMarker);
    latLngBounds.extend([validDrop.lat, validDrop.lng]);

    // Draw Route Polyline: Query OSRM free routing service to get actual road coordinates
    let isMounted = true;
    const fetchAndDrawRoute = async () => {
      try {
        let coordsString = `${validPickup.lng},${validPickup.lat}`;
        validStops.forEach((s) => {
          coordsString += `;${s.lng},${s.lat}`;
        });
        coordsString += `;${validDrop.lng},${validDrop.lat}`;

        const res = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${coordsString}?overview=full&geometries=geojson`
        );
        if (res.ok) {
          const data = await res.json();
          const route = data.routes?.[0];
          if (route?.geometry?.coordinates && isMounted) {
            const path: [number, number][] = route.geometry.coordinates.map(
              (pt: [number, number]) => [pt[1], pt[0]]
            );

            // Polyline styling strictly respecting brand: High-contrast black line
            const polyline = L.polyline(path, {
              color: '#000000',
              weight: 4.5,
              opacity: 0.9,
              lineCap: 'round',
              lineJoin: 'round',
            });
            layerGroup.addLayer(polyline);

            path.forEach((pt) => latLngBounds.extend(pt));
            map.fitBounds(latLngBounds, { padding: [35, 35], maxZoom: 15 });
            return;
          }
        }
      } catch (err) {
        console.debug('OSRM route fetch fallback to straight path:', err);
      }

      if (isMounted) {
        // Fallback straight path between coordinates
        const fallbackPath: [number, number][] = [
          [validPickup.lat, validPickup.lng],
          ...validStops.map((s) => [s.lat, s.lng] as [number, number]),
          [validDrop.lat, validDrop.lng],
        ];
        const fallbackPolyline = L.polyline(fallbackPath, {
          color: '#000000',
          weight: 4,
          opacity: 0.8,
          dashArray: '6, 6',
        });
        layerGroup.addLayer(fallbackPolyline);
        map.fitBounds(latLngBounds, { padding: [35, 35], maxZoom: 15 });
      }
    };

    fetchAndDrawRoute();

    // Trigger map invalidation after layout stabilizes
    setTimeout(() => {
      map.invalidateSize();
    }, 150);

    return () => {
      isMounted = false;
    };
  }, [
    validPickup?.lat,
    validPickup?.lng,
    validDrop?.lat,
    validDrop?.lng,
    JSON.stringify(validStops),
  ]);

  if (!validPickup || !validDrop) {
    return (
      <div className="w-full h-36 bg-zinc-50 rounded-2xl border border-zinc-200 flex flex-col items-center justify-center p-4 text-center">
        <Navigation className="w-6 h-6 text-black mb-1.5 animate-pulse" />
        <p className="text-xs font-bold text-zinc-900">Select Pickup & Drop Locations</p>
        <p className="text-[11px] text-zinc-500">
          Interactive route preview will automatically render here
        </p>
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-zinc-200 relative shadow-sm bg-white">
      {/* Route Info Banner */}
      <div className="bg-zinc-50 px-3.5 py-2.5 border-b border-zinc-200 flex items-center justify-between text-xs font-bold">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-zinc-900">Road Route Calculated</span>
          {validStops.length > 0 && (
            <span className="text-[10px] text-zinc-800 bg-zinc-200 px-2 py-0.5 rounded-full border border-zinc-300 font-semibold">
              +{validStops.length} stop{validStops.length > 1 ? 's' : ''}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {distanceKm !== undefined && (
            <span className="text-black font-mono text-sm">{distanceKm} km</span>
          )}
          {durationMinutes !== undefined && (
            <span className="text-zinc-500 font-semibold text-xs">~{durationMinutes} min</span>
          )}
        </div>
      </div>

      {/* Free Interactive Leaflet OpenStreetMap Container */}
      <div className="w-full h-52 relative z-0">
        <div ref={mapContainerRef} className="w-full h-full" />
      </div>
    </div>
  );
};
