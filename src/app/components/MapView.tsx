import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Search,
  X,
  Loader2,
  Filter,
  MapPin as MapPinIcon,
} from "lucide-react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { SERVER_URL, useAuth } from "./AuthContext";

// Fix Leaflet default marker image paths inside bundled environments.
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

type ReportType = "lost" | "found" | "sighting";
type ReportStatus =
  | "active"
  | "under_review"
  | "possible_match"
  | "reunited"
  | "removed";
type VisibleStatus = "lost" | "found" | "sighting" | "reunited";

interface ReportPin {
  id: string;
  pet_name: string | null;
  animal_type: string | null;
  report_type: ReportType;
  status: ReportStatus;
  breed: string | null;
  color: string | null;
  location_name: string | null;
  latitude: number;
  longitude: number;
  image_url: string | null;

  // Optional compatibility fields from server.
  display_status?: VisibleStatus;
}

const DEFAULT_CENTER: [number, number] = [14.5995, 120.9842];
const DEFAULT_ZOOM = 12;

function getVisibleStatus(pin: ReportPin): VisibleStatus {
  if (pin.status === "reunited") return "reunited";
  return pin.report_type;
}

function createPinIcon(status: VisibleStatus) {
  const color =
    status === "lost"
      ? "#ef4444"
      : status === "found"
        ? "#3b82f6"
        : status === "sighting"
          ? "#f59e0b"
          : "#10b981";

  return L.divIcon({
    html: `
      <div style="
        background:${color};
        width:30px;
        height:30px;
        border-radius:9999px;
        border:3px solid white;
        box-shadow:0 6px 18px rgba(15,23,42,0.28);
        display:flex;
        align-items:center;
        justify-content:center;
      ">
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="white">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/>
        </svg>
      </div>
    `,
    className: "",
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });
}

function FlyToLocation({
  center,
}: {
  center: [number, number] | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.flyTo(center, 14, { animate: true, duration: 0.8 });
    }
  }, [center, map]);

  return null;
}

export default function MapView() {
  const navigate = useNavigate();
  const { getAuthHeader } = useAuth();

  const [pins, setPins] = useState<ReportPin[]>([]);
  const [selectedPin, setSelectedPin] =
    useState<ReportPin | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | VisibleStatus
  >("all");
  const [flyTo, setFlyTo] = useState<[number, number] | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPins = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${SERVER_URL}/map-pins`, {
        headers: getAuthHeader(),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(
          json.error || "Failed to load map pins",
        );
      }

      setPins(json.data ?? []);
    } catch (err: any) {
      console.log("Error fetching map pins:", err);
      setError(err.message || "Failed to load map pins");
    } finally {
      setLoading(false);
    }
  }, [getAuthHeader]);

  useEffect(() => {
    fetchPins();
  }, [fetchPins]);

  const filteredPins = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return pins.filter((pin) => {
      const visibleStatus = getVisibleStatus(pin);

      const matchesStatus =
        filterStatus === "all" ||
        visibleStatus === filterStatus;

      const searchableText = [
        pin.pet_name,
        pin.animal_type,
        pin.report_type,
        pin.status,
        pin.breed,
        pin.color,
        pin.location_name,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = !q || searchableText.includes(q);

      return matchesStatus && matchesSearch;
    });
  }, [pins, filterStatus, searchQuery]);

  const handlePinClick = (pin: ReportPin) => {
    setSelectedPin(pin);
    setFlyTo([pin.latitude, pin.longitude]);
  };

  const getStatusBadgeClass = (status: VisibleStatus) => {
    switch (status) {
      case "lost":
        return "bg-red-100 text-red-700";
      case "found":
        return "bg-blue-100 text-blue-700";
      case "sighting":
        return "bg-amber-100 text-amber-700";
      case "reunited":
        return "bg-emerald-100 text-emerald-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="h-screen bg-slate-50 flex flex-col">
      <nav className="bg-white border-b border-slate-200 shadow-sm z-[1000] relative">
        <div className="px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/feed")}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              aria-label="Back to feed"
            >
              <ArrowLeft className="w-6 h-6 text-slate-600" />
            </button>

            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search pet name, breed, color, or location"
                className="w-full pl-12 pr-4 py-3 bg-slate-100 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-slate-700 transition-all"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-slate-500 hidden sm:block" />
              <select
                value={filterStatus}
                onChange={(e) =>
                  setFilterStatus(
                    e.target.value as "all" | VisibleStatus,
                  )
                }
                className="px-4 py-3 bg-white border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-slate-700"
              >
                <option value="all">All</option>
                <option value="lost">Lost</option>
                <option value="found">Found</option>
                <option value="sighting">Sightings</option>
                <option value="reunited">Reunited</option>
              </select>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex-1 relative">
        <MapContainer
          center={DEFAULT_CENTER}
          zoom={DEFAULT_ZOOM}
          scrollWheelZoom
          className="h-full w-full"
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <FlyToLocation center={flyTo} />

          {filteredPins.map((pin) => {
            const visibleStatus = getVisibleStatus(pin);

            return (
              <Marker
                key={pin.id}
                position={[pin.latitude, pin.longitude]}
                icon={createPinIcon(visibleStatus)}
                eventHandlers={{
                  click: () => handlePinClick(pin),
                }}
              >
                <Popup>
                  <div className="w-56">
                    {pin.image_url && (
                      <img
                        src={pin.image_url}
                        alt={pin.pet_name || "Pet report"}
                        className="mb-3 h-28 w-full rounded-lg object-cover"
                      />
                    )}

                    <div className="mb-2 flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-slate-900">
                          {pin.pet_name || "Unknown pet"}
                        </p>
                        <p className="text-xs text-slate-500">
                          {pin.animal_type || "Pet"} •{" "}
                          {pin.location_name ||
                            "Unknown location"}
                        </p>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold ${getStatusBadgeClass(
                          visibleStatus,
                        )}`}
                      >
                        {visibleStatus.toUpperCase()}
                      </span>
                    </div>

                    {(pin.breed || pin.color) && (
                      <p className="mb-3 text-xs text-slate-500">
                        {[pin.breed, pin.color]
                          .filter(Boolean)
                          .join(" • ")}
                      </p>
                    )}

                    <button
                      onClick={() =>
                        navigate(`/post/${pin.id}`)
                      }
                      className="w-full rounded-full bg-[#263143] px-4 py-2 text-sm font-medium text-white transition-all hover:bg-[#111827]"
                    >
                      View report
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        {loading && (
          <div className="absolute inset-0 z-[500] flex items-center justify-center bg-white/60 backdrop-blur-sm">
            <div className="flex items-center gap-3 rounded-2xl bg-white px-5 py-4 shadow-lg border border-slate-200">
              <Loader2 className="w-5 h-5 animate-spin text-slate-500" />
              <span className="text-sm font-medium text-slate-600">
                Loading map reports...
              </span>
            </div>
          </div>
        )}

        {error && !loading && (
          <div className="absolute top-6 left-1/2 z-[500] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-2xl border border-red-200 bg-white p-5 text-center shadow-lg">
            <p className="font-semibold text-red-700">
              Map failed to load
            </p>
            <p className="mt-1 text-sm text-slate-600">
              {error}
            </p>
            <button
              onClick={fetchPins}
              className="mt-4 rounded-full bg-[#263143] px-5 py-2 text-sm font-medium text-white"
            >
              Try again
            </button>
          </div>
        )}

        {!loading && !error && filteredPins.length === 0 && (
          <div className="absolute left-1/2 top-1/2 z-[500] w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-lg">
            <MapPinIcon className="mx-auto mb-3 h-10 w-10 text-slate-300" />
            <p className="font-semibold text-slate-800">
              No pins on map
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {pins.length === 0
                ? "Reports with latitude and longitude will appear here."
                : "No reports match your current search or filter."}
            </p>
          </div>
        )}

        {selectedPin && (
          <motion.div
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="absolute bottom-6 left-6 right-6 z-[500] md:left-auto md:w-96"
          >
            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
              <button
                onClick={() => setSelectedPin(null)}
                className="absolute right-4 top-4 z-10 rounded-full bg-white p-2 shadow-lg transition-colors hover:bg-slate-100"
                aria-label="Close selected report"
              >
                <X className="h-5 w-5 text-slate-600" />
              </button>

              {selectedPin.image_url ? (
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={selectedPin.image_url}
                    alt={selectedPin.pet_name || "Pet report"}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex aspect-[16/10] items-center justify-center bg-slate-100">
                  <MapPinIcon className="h-12 w-12 text-slate-300" />
                </div>
              )}

              <div className="p-5">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <h3 className="text-xl font-bold text-slate-900">
                    {selectedPin.pet_name || "Unknown pet"}
                  </h3>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadgeClass(
                      getVisibleStatus(selectedPin),
                    )}`}
                  >
                    {getVisibleStatus(
                      selectedPin,
                    ).toUpperCase()}
                  </span>
                </div>

                <p className="mb-2 text-sm text-slate-600">
                  {selectedPin.animal_type || "Pet"} •{" "}
                  {selectedPin.location_name ||
                    "Unknown location"}
                </p>

                {(selectedPin.breed || selectedPin.color) && (
                  <p className="mb-4 text-sm text-slate-500">
                    {[selectedPin.breed, selectedPin.color]
                      .filter(Boolean)
                      .join(" • ")}
                  </p>
                )}

                <button
                  onClick={() =>
                    navigate(`/post/${selectedPin.id}`)
                  }
                  className="w-full rounded-xl bg-[#263143] py-3 font-medium text-white transition-all hover:shadow-lg"
                >
                  View Details
                </button>
              </div>
            </div>
          </motion.div>
        )}

        <div className="absolute right-4 top-4 z-[500] rounded-xl border border-slate-200 bg-white p-4 shadow-lg">
          <h3 className="mb-3 text-sm font-semibold text-slate-900">
            Legend
          </h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-red-500" />
              <span className="text-xs text-slate-600">
                Lost
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-blue-500" />
              <span className="text-xs text-slate-600">
                Found
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-amber-500" />
              <span className="text-xs text-slate-600">
                Sighting
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-emerald-500" />
              <span className="text-xs text-slate-600">
                Reunited
              </span>
            </div>
          </div>

          <div className="mt-3 border-t border-slate-100 pt-3">
            <p className="text-xs text-slate-400">
              {filteredPins.length} visible pin
              {filteredPins.length === 1 ? "" : "s"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}