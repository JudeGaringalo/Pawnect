import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Upload,
  MapPin,
  Check,
  Loader2,
  X,
  Image,
} from "lucide-react";
import { useAuth, SERVER_URL } from "./AuthContext";
import { toast } from "sonner";

export default function CreateReport() {
  const navigate = useNavigate();
  const { user, getAuthHeader } = useAuth();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [reportType, setReportType] = useState<
    "lost" | "found"
  >("lost");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<
    string | null
  >(null);
  const [petType, setPetType] = useState("Dog");
  const [petName, setPetName] = useState("");
  const [breed, setBreed] = useState("");
  const [color, setColor] = useState("");
  const [size, setSize] = useState("Medium");
  const [gender, setGender] = useState("Unknown");
  const [location, setLocation] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null); 
  const [incidentDate, setIncidentDate] = useState("");
  const [incidentTime, setIncidentTime] = useState("");
  const [description, setDescription] = useState("");
  const [contactPreference, setContactPreference] = useState(
    "Contact me via Pawnect messages",
  );

  const handlePhotoChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Photo must be under 5MB");
      return;
    }
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  useEffect(() => {
    if (location.trim().length < 3) return;

    const fetchCoordinates = async () => {
      setIsLoading(true);
      try {
        // limit=1 ensures we only ask the API for the top match
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&limit=1&countrycodes=ph`
        );
        const data = await res.json();

        // If the API found a match, auto-fill the coordinates 
        if (data && data.length > 0) {
          setLat(parseFloat(data[0].lat).toFixed(4));
          setLng(parseFloat(data[0].lon).toFixed(4));
        }
      } catch (error) {
        console.error("Error fetching location data:", error);
      } finally {
        setIsLoading(false);
      }
    };

  const timeoutId = setTimeout(fetchCoordinates, 1000);
    return () => clearTimeout(timeoutId);
  }, [location]);

  const handleLocationSelect = (place) => {
    setLocation(place.display_name); 
    setLat(place.lat);               
    setLng(place.lon);                         
  };

  const handleSubmit = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!location.trim()) {
      toast.error("Location is required");
      return;
    }

    setSubmitting(true);

    try {
      let imageUrl: string | null = null;

      if (photoFile) {
        const formData = new FormData();
        formData.append("file", photoFile);

        const uploadRes = await fetch(`${SERVER_URL}/upload`, {
          method: "POST",
          headers: getAuthHeader(),
          body: formData,
        });

        const uploadJson = await uploadRes.json();

        if (!uploadRes.ok) {
          throw new Error(
            uploadJson.error || "Photo upload failed",
          );
        }

        imageUrl = uploadJson.url;
      }

      const payload: Record<string, any> = {
        report_type: reportType,
        status: "active",
        pet_name:
          petName.trim() ||
          (reportType === "found" ? "Unknown" : "Unnamed"),
        animal_type: petType.toLowerCase(),
        breed: breed.trim() || null,
        color: color.trim() || null,
        size,
        gender,
        location_name: location.trim(),
        description: description.trim() || null,
        contact_preference: contactPreference,
        image_url: imageUrl,
        date_reported: new Date().toISOString(),
      };

      if (lat && lng) {
        payload.latitude = parseFloat(lat);
        payload.longitude = parseFloat(lng);
      }

      const res = await fetch(`${SERVER_URL}/reports`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(
          json.error || "Failed to create report",
        );
      }

      setSubmitted(true);
      setTimeout(() => navigate("/feed"), 2500);
    } catch (err: any) {
      console.log("Error submitting report:", err);
      toast.error(err.message || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center p-8 max-w-sm">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            Sign in required
          </h2>
          <p className="text-slate-600 mb-6">
            You need to be signed in to create a report.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-3 bg-[#263143] text-white rounded-full font-medium"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center px-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/20">
            <Check className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-3">
            Report Submitted!
          </h2>
          <p className="text-slate-600 mb-6">
            Your pet report has been published to the community.
          </p>
          <p className="text-sm text-slate-500">
            Redirecting to feed...
          </p>
        </motion.div>
      </div>
    );
  }

  const stepIndicator = (
    <div className="flex items-center gap-2">
      {[1, 2, 3].map((n) => (
        <>
          <div
            key={n}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= n
                ? "bg-[#1F2937] text-white"
                : "bg-slate-200 text-slate-400"
            }`}
          >
            {n}
          </div>
          {n < 3 && (
            <div
              className={`w-12 h-1 ${step > n ? "bg-[#1F2937]" : "bg-slate-200"}`}
            />
          )}
        </>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate("/feed")}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
              <span>Cancel</span>
            </button>
            {stepIndicator}
            <div className="w-20" />
          </div>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-6 py-12">
        {step === 1 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Report a Pet
              </h1>
              <p className="text-slate-600">
                Let's start by selecting the type of report.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setReportType("lost")}
                className={`p-8 rounded-2xl border-2 transition-all text-left ${
                  reportType === "lost"
                    ? "border-red-500 bg-red-50 shadow-sm"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="text-4xl mb-3">🔍</div>
                <h3 className="font-semibold text-slate-900 mb-1">
                  Lost Pet
                </h3>
                <p className="text-sm text-slate-600">
                  Your pet is missing.
                </p>
              </motion.button>

              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setReportType("found")}
                className={`p-8 rounded-2xl border-2 transition-all text-left ${
                  reportType === "found"
                    ? "border-blue-500 bg-blue-50 shadow-sm"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="text-4xl mb-3">🐾</div>
                <h3 className="font-semibold text-slate-900 mb-1">
                  Found Pet
                </h3>
                <p className="text-sm text-slate-600">
                  You found a pet.
                </p>
              </motion.button>
            </div>

            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full py-4 bg-[#1F2937] text-white rounded-full font-medium hover:bg-[#0F172B] hover:shadow-lg transition-all"
            >
              Continue
            </button>
          </motion.section>
        )}

        {step === 2 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Pet Details
              </h1>
              <p className="text-slate-600">
                Provide information about the pet.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
              {/* Photo Upload */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Upload Photo
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
                {photoPreview ? (
                  <div className="relative rounded-xl overflow-hidden aspect-[16/9]">
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => {
                        setPhotoFile(null);
                        setPhotoPreview(null);
                      }}
                      className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-black/70"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                    className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-[#1F2937] transition-colors cursor-pointer"
                  >
                    <Image className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm text-slate-600">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Max 5MB
                    </p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Pet Type
                  </label>
                  <select
                    value={petType}
                    onChange={(e) => setPetType(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#263143]"
                  >
                    <option>Dog</option>
                    <option>Cat</option>
                    <option>Bird</option>
                    <option>Rabbit</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Pet Name
                  </label>
                  <input
                    type="text"
                    value={petName}
                    onChange={(e) => setPetName(e.target.value)}
                    placeholder={
                      reportType === "found"
                        ? "Unknown (if not sure)"
                        : "e.g., Luna"
                    }
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#263143]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Breed
                  </label>
                  <input
                    type="text"
                    value={breed}
                    onChange={(e) => setBreed(e.target.value)}
                    placeholder="e.g., Golden Retriever"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#263143]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Color
                  </label>
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    placeholder="e.g., Golden, White with black spots"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#263143]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Size
                  </label>
                  <select
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#263143]"
                  >
                    <option>Small</option>
                    <option>Medium</option>
                    <option>Large</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#263143]"
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Unknown</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 py-4 bg-white text-slate-700 border-2 border-slate-200 rounded-full font-medium hover:border-[#263143] transition-all"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex-1 py-4 bg-[#1F2937] text-white rounded-full font-medium hover:bg-[#0F172B] hover:shadow-lg transition-all"
              >
                Continue
              </button>
            </div>
          </motion.section>
        )}

        {step === 3 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Location & Details
              </h1>
              <p className="text-slate-600">
                Where was the pet last seen or found?
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Location{" "}
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g., Quezon City, near Barangay Hall"
                    className="w-full pl-12 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#263143]"
                  />

                  {isLoading && (
                    <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 animate-spin" />
                  )}

                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Exact Coordinates{" "}
                  <span className="text-slate-400 text-xs">
                    (Enables map pin)
                  </span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                    placeholder="Latitude (e.g., 14.5995)"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#263143] text-sm"
                  />
                  <input
                    type="text"
                    value={lng}
                    onChange={(e) => setLng(e.target.value)}
                    placeholder="Longitude (e.g., 120.9842)"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#263143] text-sm"
                  />
                </div>
              </div>
            
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={incidentDate}
                    onChange={(e) =>
                      setIncidentDate(e.target.value)
                    }
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#263143]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    value={incidentTime}
                    onChange={(e) =>
                      setIncidentTime(e.target.value)
                    }
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#263143]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                  placeholder="Provide additional details, distinctive markings, behavior, or circumstances."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#263143] resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Contact Preference
                </label>
                <select
                  value={contactPreference}
                  onChange={(e) =>
                    setContactPreference(e.target.value)
                  }
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#263143]"
                >
                  <option>
                    Contact me via Pawnect messages
                  </option>
                  <option>Display my phone number</option>
                  <option>Display my email</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex-1 py-4 bg-white text-slate-700 border-2 border-slate-200 rounded-full font-medium hover:border-[#263143] transition-all"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting || !location.trim()}
                className="flex-1 py-4 bg-[#1F2937] text-white rounded-full font-medium hover:bg-[#0F172B] hover:shadow-lg transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {submitting && (
                  <Loader2 className="w-5 h-5 animate-spin" />
                )}
                {submitting ? "Submitting..." : "Submit Report"}
              </button>
            </div>
          </motion.section>
        )}
      </main>
    </div>
  );
}