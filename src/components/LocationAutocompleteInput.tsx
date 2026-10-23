import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, CheckCircle2, X, LocateFixed, Loader2, AlertCircle } from 'lucide-react';
import {
  getPlacePredictions,
  getPlaceDetails,
  reverseGeocode,
  PlacePrediction,
} from '../lib/maps';

interface LocationAutocompleteInputProps {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onSelectLocation: (location: { address: string; lat: number; lng: number; placeId: string }) => void;
  iconColor?: string;
  required?: boolean;
  selectedCoordinates?: { lat: number | null; lng: number | null };
  showCurrentLocationButton?: boolean;
}

export const LocationAutocompleteInput: React.FC<LocationAutocompleteInputProps> = ({
  label,
  placeholder = 'Type landmark, street, area, or city...',
  value,
  onChange,
  onSelectLocation,
  iconColor = 'text-black',
  required = true,
  selectedCoordinates,
  showCurrentLocationButton = false,
}) => {
  const [query, setQuery] = useState(value);
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [unselectedWarning, setUnselectedWarning] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync internal query state with external value prop
  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Handle outside click to close dropdown and validate selection
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setIsFocused(false);
        // If user entered text but didn't pick from suggestions, show raw text warning
        if (query.trim().length > 0 && (!selectedCoordinates?.lat || !selectedCoordinates?.lng)) {
          setUnselectedWarning('Please select a location from the suggestions.');
        } else {
          setUnselectedWarning(null);
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [query, selectedCoordinates]);

  // Debounced place predictions lookup using free OpenStreetMap search & local directory
  useEffect(() => {
    if (!isFocused || query.trim().length < 2) {
      setPredictions([]);
      setErrorMessage(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const results = await getPlacePredictions(query);
        setPredictions(results);
        setIsOpen(true);
      } catch (e: any) {
        console.error('Location Autocomplete Error:', e);
        setPredictions([]);
        const technicalDetails = e?.message || String(e);
        setErrorMessage(`Location search error: ${technicalDetails}`);
        setIsOpen(true);
      } finally {
        setIsLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query, isFocused]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setQuery(newVal);
    onChange(newVal);
    // Invalidate stale selected coordinates immediately if address text is modified
    if (selectedCoordinates?.lat || selectedCoordinates?.lng) {
      onSelectLocation({ address: newVal, lat: null as any, lng: null as any, placeId: '' });
    }
    setUnselectedWarning(null);
    setErrorMessage(null);
    if (!isOpen && newVal.trim().length >= 2) {
      setIsOpen(true);
    }
  };

  const handleSelectPrediction = async (item: PlacePrediction) => {
    setQuery(item.description);
    onChange(item.description);
    setIsOpen(false);
    setIsLoading(true);
    setErrorMessage(null);
    setUnselectedWarning(null);

    try {
      const details = await getPlaceDetails(item.placeId, item.description, item.rawSuggestion);
      onSelectLocation(details);
    } catch (e: any) {
      console.error('Error getting Place details:', e);
      setErrorMessage(`Failed to fetch place details: ${e?.message || String(e)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setErrorMessage('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setErrorMessage(null);
    setUnselectedWarning(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        try {
          // Resolve exact human-readable address using free reverse geocoder
          const locationDetails = await reverseGeocode(lat, lng);
          setQuery(locationDetails.address);
          onChange(locationDetails.address);
          onSelectLocation(locationDetails);
        } catch (err) {
          console.warn('Geocoder failed for GPS coordinates:', err);
          const fallbackAddress = `GPS Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
          setQuery(fallbackAddress);
          onChange(fallbackAddress);
          onSelectLocation({
            address: fallbackAddress,
            lat,
            lng,
            placeId: `gps_${Date.now()}`,
          });
        } finally {
          setIsLocating(false);
          setIsOpen(false);
        }
      },
      (err) => {
        console.warn('Geolocation error or permission denied:', err);
        setIsLocating(false);
        setErrorMessage('Unable to retrieve GPS location. Please type your location.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleClear = () => {
    setQuery('');
    onChange('');
    setPredictions([]);
    setIsOpen(false);
    setErrorMessage(null);
    setUnselectedWarning(null);
  };

  const hasCoords = Boolean(selectedCoordinates?.lat && selectedCoordinates?.lng);

  return (
    <div ref={containerRef} className="relative space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <label className="font-bold text-black flex items-center gap-1.5">
          <MapPin className={`w-3.5 h-3.5 ${iconColor}`} />
          <span>{label}</span>
        </label>
        <div className="flex items-center gap-2">
          {showCurrentLocationButton && (
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              disabled={isLocating}
              className="inline-flex items-center gap-1 text-[10px] font-bold text-black bg-zinc-100 hover:bg-zinc-200 px-2.5 py-1 rounded-full border border-zinc-300 transition"
            >
              {isLocating ? (
                <Loader2 className="w-3 h-3 animate-spin text-black" />
              ) : (
                <LocateFixed className="w-3 h-3 text-black" />
              )}
              <span>Use Current GPS</span>
            </button>
          )}
          {hasCoords && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-black bg-zinc-100 px-2 py-0.5 rounded-full border border-zinc-300">
              <CheckCircle2 className="w-3 h-3 text-black" />
              <span>Location Selected</span>
            </span>
          )}
        </div>
      </div>

      {/* Input Field Wrapper */}
      <div className="relative flex items-center">
        <input
          type="text"
          required={required}
          value={query}
          onChange={handleInputChange}
          onFocus={() => {
            setIsFocused(true);
            if (query.trim().length >= 2) setIsOpen(true);
          }}
          placeholder={placeholder}
          className={`w-full bg-zinc-50 border ${
            unselectedWarning ? 'border-amber-600' : 'border-zinc-300'
          } rounded-xl pl-9 pr-8 py-2.5 text-xs font-medium focus:outline-none focus:border-black text-black transition placeholder:text-zinc-400`}
        />
        <Search className="w-4 h-4 text-zinc-400 absolute left-3 pointer-events-none" />

        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2.5 p-1 rounded-full text-zinc-500 hover:text-black hover:bg-zinc-200 transition"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Unselected raw text warning */}
      {unselectedWarning && (
        <p className="text-[11px] font-semibold text-amber-700 flex items-center gap-1 mt-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-700" />
          <span>{unselectedWarning}</span>
        </p>
      )}

      {/* Autocomplete Suggestions Dropdown */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 top-full mt-1.5 bg-white border border-zinc-300 rounded-2xl shadow-xl max-h-64 overflow-y-auto divide-y divide-zinc-200">
          {isLoading && (
            <div className="p-3 text-center text-xs text-zinc-600 flex items-center justify-center gap-2">
              <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              <span>Searching locations...</span>
            </div>
          )}

          {/* Search Notice / Error */}
          {!isLoading && errorMessage && (
            <div className="p-3 text-xs font-medium space-y-1.5 bg-zinc-50 border border-zinc-300 rounded-xl m-1.5">
              <div className="flex items-start gap-2 text-zinc-800">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-black" />
                <div className="space-y-1 text-left">
                  <p className="font-bold text-black text-xs">Search Notice</p>
                  <p className="text-[11px] leading-relaxed text-zinc-700">{errorMessage}</p>
                </div>
              </div>
            </div>
          )}

          {/* Predictions List */}
          {!isLoading && !errorMessage && predictions.length > 0 && (
            <div className="p-1.5">
              {predictions.map((p, idx) => (
                <button
                  key={`${p.placeId}-${idx}`}
                  type="button"
                  onClick={() => handleSelectPrediction(p)}
                  className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-zinc-100 transition flex items-start gap-2.5 group"
                >
                  <MapPin className="w-4 h-4 text-black shrink-0 mt-0.5 group-hover:scale-110 transition" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-black truncate">{p.mainText}</p>
                    <p className="text-[11px] text-zinc-600 truncate">{p.description}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* No Predictions Found */}
          {!isLoading && !errorMessage && query.trim().length >= 2 && predictions.length === 0 && (
            <div className="p-3 text-center text-xs text-zinc-600">
              No places found for "{query}". Try typing a street, landmark, or area name.
            </div>
          )}

          {/* Free Map Attribution */}
          <div className="px-3 py-1.5 bg-zinc-50 border-t border-zinc-200 flex items-center justify-between text-[10px] text-zinc-600">
            <span>Free OpenStreetMap Search</span>
            <span className="font-semibold text-black">Lucknow & Regional</span>
          </div>
        </div>
      )}
    </div>
  );
};
