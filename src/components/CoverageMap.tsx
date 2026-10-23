import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MapPin, Navigation, ArrowRight, Clock, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { VehicleType } from '../types';

interface CoverageMapProps {
  onOpenBooking: (vehicleType?: VehicleType, needsHelper?: boolean) => void;
}

export const CoverageMap: React.FC<CoverageMapProps> = ({ onOpenBooking }) => {
  const [selectedHub, setSelectedHub] = useState<'lucknow' | 'barabanki'>('lucknow');
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [26.885, 81.04],
        zoom: 11,
        zoomControl: true,
        attributionControl: false,
      });

      // Free OpenStreetMap Tile Layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      // Attribution control in bottom-right
      L.control
        .attribution({ position: 'bottomright', prefix: 'OpenStreetMap (Free)' })
        .addTo(map);

      // 1. Entire Lucknow Coverage Boundary Circle (~17.5 km radius)
      L.circle([26.85, 80.95], {
        radius: 17500,
        color: '#059669', // Emerald-600
        fillColor: '#10B981', // Emerald-500
        fillOpacity: 0.14,
        weight: 2,
      }).addTo(map);

      // 2. Barabanki Expansion Area Circle (~9 km radius)
      L.circle([26.9268, 81.1834], {
        radius: 9000,
        color: '#D97706', // Amber-600
        fillColor: '#F59E0B', // Amber-500
        fillOpacity: 0.16,
        weight: 2,
        dashArray: '6, 6',
      }).addTo(map);

      // 3. Custom HTML Marker for Lucknow Active Zone
      const lucknowMarkerHtml = `
        <div style="
          background-color: #000000;
          color: #ffffff;
          border: 2px solid #10B981;
          padding: 6px 12px;
          border-radius: 12px;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.4);
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transform: translate(-50%, -50%);
          white-space: nowrap;
        ">
          <span style="
            width: 8px;
            height: 8px;
            background-color: #34D399;
            border-radius: 50%;
            display: inline-block;
          "></span>
          <div style="text-align: left;">
            <p style="font-size: 11px; font-weight: 900; margin: 0; line-height: 1.1;">LUCKNOW (ALL AREAS)</p>
            <p style="font-size: 9px; font-weight: 700; color: #34D399; margin: 0; line-height: 1.1;">Active Citywide Dispatch</p>
          </div>
        </div>
      `;

      const lucknowIcon = L.divIcon({
        html: lucknowMarkerHtml,
        className: 'patgolito-lucknow-marker',
        iconSize: [0, 0],
      });

      const lucknowMarker = L.marker([26.8467, 80.9462], { icon: lucknowIcon }).addTo(map);
      lucknowMarker.on('click', () => {
        setSelectedHub('lucknow');
        map.flyTo([26.8467, 80.9462], 12, { duration: 1 });
      });

      // 4. Custom HTML Marker for Barabanki Launching Zone
      const barabankiMarkerHtml = `
        <div style="
          background-color: #000000;
          color: #ffffff;
          border: 2px solid #F59E0B;
          padding: 6px 12px;
          border-radius: 12px;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.4);
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transform: translate(-50%, -50%);
          white-space: nowrap;
        ">
          <span style="
            width: 8px;
            height: 8px;
            background-color: #FBBF24;
            border-radius: 50%;
            display: inline-block;
          "></span>
          <div style="text-align: left;">
            <p style="font-size: 11px; font-weight: 900; margin: 0; line-height: 1.1;">BARABANKI</p>
            <p style="font-size: 9px; font-weight: 700; color: #FBBF24; margin: 0; line-height: 1.1;">Launching Soon</p>
          </div>
        </div>
      `;

      const barabankiIcon = L.divIcon({
        html: barabankiMarkerHtml,
        className: 'patgolito-barabanki-marker',
        iconSize: [0, 0],
      });

      const barabankiMarker = L.marker([26.9268, 81.1834], { icon: barabankiIcon }).addTo(map);
      barabankiMarker.on('click', () => {
        setSelectedHub('barabanki');
        map.flyTo([26.9268, 81.1834], 12, { duration: 1 });
      });

      mapInstanceRef.current = map;

      setTimeout(() => {
        map.invalidateSize();
      }, 200);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Pan map when selectedHub changes
  const handleSelectHub = (hub: 'lucknow' | 'barabanki') => {
    setSelectedHub(hub);
    if (!mapInstanceRef.current) return;

    if (hub === 'lucknow') {
      mapInstanceRef.current.flyTo([26.8467, 80.9462], 12, { duration: 1.2 });
    } else {
      mapInstanceRef.current.flyTo([26.9268, 81.1834], 12, { duration: 1.2 });
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Coverage Status Indicator */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Lucknow Active Card */}
        <motion.div
          whileHover={{ y: -2 }}
          onClick={() => handleSelectHub('lucknow')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            selectedHub === 'lucknow'
              ? 'bg-zinc-950 text-white border-zinc-800 shadow-lg'
              : 'bg-zinc-50 text-zinc-900 border-zinc-200 hover:bg-zinc-100'
          }`}
        >
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
              </span>
              <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                Citywide Active Fleet
              </span>
            </div>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              All 110+ Wards
            </span>
          </div>

          <h3 className="text-lg font-black tracking-tight">Every Corner of Lucknow</h3>
          <p
            className={`text-xs mt-1 leading-relaxed ${
              selectedHub === 'lucknow' ? 'text-zinc-300' : 'text-zinc-600'
            }`}
          >
            We don’t restrict our services to select pockets. From old city alleys to new expressways,
            residential apartments to Transport Nagar freight hubs, our fleet covers the entire city.
          </p>

          <div className="mt-4 pt-3 border-t border-zinc-800/40 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 font-bold">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Prompt Local Dispatch</span>
            </div>
            <span className="font-semibold text-emerald-400">Doorstep Helper Support</span>
          </div>
        </motion.div>

        {/* Barabanki Launching Soon Card */}
        <motion.div
          whileHover={{ y: -2 }}
          onClick={() => handleSelectHub('barabanki')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            selectedHub === 'barabanki'
              ? 'bg-zinc-950 text-white border-zinc-800 shadow-lg'
              : 'bg-zinc-50 text-zinc-900 border-zinc-200 hover:bg-zinc-100'
          }`}
        >
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-400" />
              </span>
              <span className="text-xs font-black uppercase tracking-wider text-amber-400">
                Launching Soon
              </span>
            </div>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Phase 2 Expansion
            </span>
          </div>

          <h3 className="text-lg font-black tracking-tight">Barabanki & Expressway Corridor</h3>
          <p
            className={`text-xs mt-1 leading-relaxed ${
              selectedHub === 'barabanki' ? 'text-zinc-300' : 'text-zinc-600'
            }`}
          >
            Extending our seamless vehicle + helper delivery network to Barabanki district, connecting
            Lucknow-Ayodhya highway distribution and industrial belts with zero-bargaining transport.
          </p>

          <div className="mt-4 pt-3 border-t border-zinc-800/40 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 font-bold text-amber-400">
              <Zap className="w-3.5 h-3.5" />
              <span>Direct Inter-District Routes</span>
            </div>
            <span className="font-semibold text-zinc-400">Opening Soon</span>
          </div>
        </motion.div>
      </div>

      {/* Map Container */}
      <div className="relative rounded-3xl overflow-hidden border border-zinc-200 bg-zinc-900 shadow-xl">
        {/* Floating Top Header on Map */}
        <div className="absolute top-4 left-4 right-4 z-[400] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
          <div className="bg-black/90 backdrop-blur-md text-white px-4 py-2 rounded-2xl border border-zinc-800 shadow-md flex items-center gap-3 pointer-events-auto">
            <div className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Full Citywide Geographical Reach</p>
              <p className="text-[10px] text-zinc-400">Entire Lucknow (Active) • Barabanki (Upcoming)</p>
            </div>
          </div>

          <div className="flex items-center gap-2 pointer-events-auto">
            <div className="hidden sm:flex items-center gap-2 bg-black/85 backdrop-blur-md px-3 py-2 rounded-2xl border border-zinc-800 text-[11px] font-bold text-white">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Active Coverage</span>
              <span className="w-2 h-2 rounded-full bg-amber-400 ml-2" />
              <span>Upcoming Launch</span>
            </div>
          </div>
        </div>

        {/* Free Interactive Leaflet Map */}
        <div className="w-full h-[460px] sm:h-[500px] relative z-0">
          <div ref={mapContainerRef} className="w-full h-full" />
        </div>

        {/* Bottom Action Footer */}
        <div className="p-4 sm:p-5 bg-zinc-950 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3 text-left">
            <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400 shrink-0">
              <Navigation className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Need a pickup anywhere in Lucknow?</p>
              <p className="text-[11px] text-zinc-400">
                Instant transparent fare calculated on exact road distance with helper support.
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onOpenBooking('tata_ace', true)}
            className="w-full sm:w-auto bg-white hover:bg-zinc-200 text-black text-xs font-bold px-6 py-3 rounded-xl transition flex items-center justify-center gap-2 shrink-0 cursor-pointer shadow-md"
          >
            <span>Book Vehicle & Helper</span>
            <ArrowRight className="w-3.5 h-3.5 text-black" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};
