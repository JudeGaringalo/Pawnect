import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  ArrowLeft,
  Loader2,
  MapPin,
  Search,
  AlertCircle,
  CheckCircle,
  PawPrint,
} from "lucide-react";
import { SERVER_URL, useAuth } from "./AuthContext";

interface MapPinItem {
  id: string;
  pet_name: string | null;
  animal_type?: string | null;
  pet_type?: string | null;
  report_type: "lost" | "found" | "sighting";
  status: string;
  display_status?: string;
  breed: string | null;
  color: string | null;
  location_name?: string | null;
  location?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  lat?: number | null;
  lng?: number | null;
  image_url?: string | null;
  photo_url?: string | null;
  created_at: string;
}

const DEFAULT_CENTER: [number, number] = [14.5995, 120.9842];

function getPinLat(pin: MapPinItem) {
  return Number(pin.latitude ?? pin.lat);
}

function getPinLng(pin: MapPinItem) {
  return Number(pin.longitude ?? pin.lng);
}

function getPinStatus(pin: MapPinItem) {
  if (pin.status === "reunited") return "reunited";
  return pin.display_status || pin.report_type || "lost";
}

function getStatusLabel(status: string) {
  if (status === "lost") return "Lost";
  if (status === "found") return "Found";
  if (status === "sighting") return "Sighting";
  if (status === "reunited") return "Reunited";
  return "Report";
}

function getStatusColor(status: string) {
  if (status === "lost") return "#dc2626";
  if (status === "found") return "#2563eb";
  if (status === "sighting") return "#d97706";
  if (status === "reunited") return "#059669";
  return "#263143";
}

function createMarkerIcon(status: string) {
  const color = getStatusColor(status);

  return L.divIcon({
    className: "",
    html: `
      <div style="
        width: 34px;
        height: 34px;
        border-radius: 999px;
        background: ${color};
        border: 3px solid white;
        box-shadow: 0 8px 20px rgba(15, 23, 42, 0.25);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          width: 9px;
          height: 9px;
          border-radius: 999px;
          background: white;
        "></div>
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -18],
  });
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

async function readJsonResponse(res: Response) {
  const text = await res.text();

  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return {
      error: text || "Unexpected server response",
    };
  }
}

export default function MapView() {
  const navigate = useNavigate();
  const { getAuthHeader } = useAuth();

  const mapElementRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const [pins, setPins] = useState<MapPinItem[]>([]);
  const [selectedPin, setSelectedPin] =
    useState<MapPinItem | null>(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const filteredPins = useMemo(() => {
    return pins.filter((pin) => {
      const status = getPinStatus(pin);
      const petType = (
        pin.pet_type ||
        pin.animal_type ||
        ""
      ).toLowerCase();

      if (activeFilter === "lost" && status !== "lost")
        return false;
      if (activeFilter === "found" && status !== "found")
        return false;
      if (activeFilter === "sighting" && status !== "sighting")
        return false;
      if (activeFilter === "reunited" && status !== "reunited")
        return false;
      if (activeFilter === "dog" && petType !== "dog")
        return false;
      if (activeFilter === "cat" && petType !== "cat")
        return false;

      const query = searchTerm.trim().toLowerCase();

      if (!query) return true;

      const searchable = [
        pin.pet_name,
        pin.breed,
        pin.color,
        pin.location,
        pin.location_name,
        pin.animal_type,
        pin.pet_type,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchable.includes(query);
    });
  }, [pins, activeFilter, searchTerm]);

  const fetchPins = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${SERVER_URL}/map-pins`, {
        method: "GET",
        headers: {
          ...getAuthHeader(),
        },
      });

      const json = await readJsonResponse(res);

      if (!res.ok) {
        throw new Error(
          json.error ||
            json.message ||
            "Failed to load map pins",
        );
      }

      const nextPins = (json.data || []).filter(
        (pin: MapPinItem) => {
          const lat = getPinLat(pin);
          const lng = getPinLng(pin);

          return Number.isFinite(lat) && Number.isFinite(lng);
        },
      );

      setPins(nextPins);
    } catch (err: any) {
      console.log("Error loading map pins:", err);
      setError(err.message || "Failed to load map pins");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!mapElementRef.current || mapRef.current) return;

    const map = L.map(mapElementRef.current, {
      center: DEFAULT_CENTER,
      zoom: 11,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution: "&copy; OpenStreetMap contributors",
        maxZoom: 19,
      },
    ).addTo(map);

    const markersLayer = L.layerGroup().addTo(map);

    mapRef.current = map;
    markersLayerRef.current = markersLayer;

    setTimeout(() => {
      map.invalidateSize();
    }, 250);

    return () => {
      map.remove();
      mapRef.current = null;
      markersLayerRef.current = null;
    };
  }, []);

  useEffect(() => {
    fetchPins();
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const markersLayer = markersLayerRef.current;

    if (!map || !markersLayer) return;

    markersLayer.clearLayers();

    const bounds = L.latLngBounds([]);

    filteredPins.forEach((pin) => {
      const lat = getPinLat(pin);
      const lng = getPinLng(pin);

      if (!Number.isFinite(lat) || !Number.isFinite(lng))
        return;

      const status = getPinStatus(pin);
      const petName = pin.pet_name || "Unknown pet";
      const location =
        pin.location || pin.location_name || "Unknown location";
      const petType = pin.pet_type || pin.animal_type || "Pet";

      const marker = L.marker([lat, lng], {
        icon: createMarkerIcon(status),
      });

      marker.bindPopup(`
        <div style="min-width: 190px;">
          <strong style="font-size: 14px;">${petName}</strong>
          <div style="font-size: 12px; margin-top: 4px; color: #475569;">
            ${getStatusLabel(status)} • ${petType}
          </div>
          <div style="font-size: 12px; margin-top: 6px; color: #475569;">
            ${location}
          </div>
        </div>
      `);

      marker.on("click", () => {
        setSelectedPin(pin);
      });

      marker.addTo(markersLayer);
      bounds.extend([lat, lng]);
    });

    if (filteredPins.length > 0 && bounds.isValid()) {
      map.fitBounds(bounds, {
        padding: [40, 40],
        maxZoom: 13,
      });
    }
  }, [filteredPins]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => navigate("/feed")}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Feed
            </button>

            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#263143]" />
              <h1 className="text-xl font-bold text-slate-900">
                Pet Map
              </h1>
            </div>

            <button
              onClick={() => navigate("/create-report")}
              className="px-4 py-2 bg-[#263143] text-white rounded-full text-sm font-medium hover:bg-slate-900 transition-colors"
            >
              Report Pet
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <h2 className="font-semibold text-slate-900 mb-4">
                Find nearby reports
              </h2>

              <div className="relative mb-4">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  value={searchTerm}
                  onChange={(event) =>
                    setSearchTerm(event.target.value)
                  }
                  placeholder="Search pet, breed, color, or location"
                  className="w-full rounded-full border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none focus:border-[#263143] focus:ring-2 focus:ring-[#263143]/10"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  ["all", "All"],
                  ["lost", "Lost"],
                  ["found", "Found"],
                  ["sighting", "Sightings"],
                  ["dog", "Dogs"],
                  ["cat", "Cats"],
                  ["reunited", "Reunited"],
                ].map(([id, label]) => (
                  <button
                    key={id}
                    onClick={() => setActiveFilter(id)}
                    className={`px-3 py-2 rounded-full text-sm font-medium transition-all ${
                      activeFilter === id
                        ? "bg-[#263143] text-white"
                        : "bg-white border border-slate-200 text-slate-600 hover:border-[#263143]"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-slate-900">
                  Reports on map
                </h2>

                <span className="text-sm text-slate-500">
                  {filteredPins.length}
                </span>
              </div>

              {loading && (
                <div className="flex items-center gap-2 text-sm text-slate-500 py-6">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading map reports...
                </div>
              )}

              {!loading && error && (
                <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-red-700">
                  <p className="text-sm font-semibold mb-2">
                    Failed to load map
                  </p>
                  <p className="text-xs mb-3">{error}</p>

                  <button
                    onClick={fetchPins}
                    className="px-3 py-2 rounded-full bg-red-600 text-white text-xs font-medium"
                  >
                    Try again
                  </button>
                </div>
              )}

              {!loading &&
                !error &&
                filteredPins.length === 0 && (
                  <div className="text-center py-8 text-slate-400">
                    <PawPrint className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm">
                      No map reports found.
                    </p>
                  </div>
                )}

              {!loading &&
                !error &&
                filteredPins.length > 0 && (
                  <div className="space-y-3 max-h-[390px] overflow-y-auto pr-1">
                    {filteredPins.map((pin) => {
                      const status = getPinStatus(pin);
                      const petName =
                        pin.pet_name || "Unknown pet";
                      const location =
                        pin.location ||
                        pin.location_name ||
                        "Unknown location";
                      const photoUrl =
                        pin.photo_url || pin.image_url || null;

                      return (
                        <button
                          key={pin.id}
                          onClick={() => {
                            setSelectedPin(pin);

                            const map = mapRef.current;
                            const lat = getPinLat(pin);
                            const lng = getPinLng(pin);

                            if (
                              map &&
                              Number.isFinite(lat) &&
                              Number.isFinite(lng)
                            ) {
                              map.setView([lat, lng], 15);
                            }
                          }}
                          className={`w-full text-left rounded-xl border p-3 transition-all ${
                            selectedPin?.id === pin.id
                              ? "border-[#263143] bg-slate-50"
                              : "border-slate-200 bg-white hover:border-[#263143]"
                          }`}
                        >
                          <div className="flex gap-3">
                            <div className="w-14 h-14 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
                              {photoUrl ? (
                                <img
                                  src={photoUrl}
                                  alt={petName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-400">
                                  <PawPrint className="w-5 h-5" />
                                </div>
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-semibold text-slate-900 truncate">
                                  {petName}
                                </p>

                                <span
                                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                                  style={{
                                    backgroundColor:
                                      getStatusColor(status),
                                  }}
                                />
                              </div>

                              <p className="text-xs text-slate-500 line-clamp-1">
                                {getStatusLabel(status)} •{" "}
                                {pin.pet_type ||
                                  pin.animal_type ||
                                  "Pet"}
                              </p>

                              <p className="text-xs text-slate-500 line-clamp-1 mt-1">
                                {location}
                              </p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
            </div>

            {selectedPin && (
              <div className="bg-white rounded-2xl border border-slate-200 p-5">
                <div className="flex items-center gap-2 mb-3">
                  {getPinStatus(selectedPin) === "reunited" ? (
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                  ) : getPinStatus(selectedPin) === "lost" ? (
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  ) : (
                    <MapPin className="w-5 h-5 text-blue-600" />
                  )}

                  <h3 className="font-semibold text-slate-900">
                    Selected report
                  </h3>
                </div>

                <p className="text-sm font-medium text-slate-900">
                  {selectedPin.pet_name || "Unknown pet"}
                </p>

                <p className="text-sm text-slate-500 mt-1">
                  {getStatusLabel(getPinStatus(selectedPin))} •{" "}
                  {selectedPin.breed ||
                    selectedPin.pet_type ||
                    selectedPin.animal_type ||
                    "Pet"}
                </p>

                <p className="text-sm text-slate-600 mt-3">
                  {selectedPin.location ||
                    selectedPin.location_name}
                </p>

                <p className="text-xs text-slate-400 mt-2">
                  Posted {formatDate(selectedPin.created_at)}
                </p>

                <button
                  onClick={() =>
                    navigate(`/post/${selectedPin.id}`)
                  }
                  className="mt-4 w-full rounded-full bg-[#263143] py-3 text-sm font-medium text-white hover:bg-slate-900 transition-colors"
                >
                  View report details
                </button>
              </div>
            )}
          </div>

          <div className="lg:col-span-8">
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="h-[680px] w-full relative">
                <div
                  ref={mapElementRef}
                  className="h-full w-full"
                />

                {loading && (
                  <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-[500]">
                    <div className="flex items-center gap-3 rounded-full bg-white px-5 py-3 shadow-lg border border-slate-200">
                      <Loader2 className="w-5 h-5 animate-spin text-[#263143]" />
                      <span className="text-sm font-medium text-slate-700">
                        Loading map...
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <p className="text-xs text-slate-500 mt-3">
              Map data is based on reported coordinates. Always
              confirm details with the reporter before arranging
              pet returns.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}