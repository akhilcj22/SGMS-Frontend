import "leaflet/dist/leaflet.css";

import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../services/api";


import L from "leaflet";


import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});


function LeafletMap({ center, zoom, userLocation, centers, setSelectedCenter }) {
  const mapRef = useRef(null);

  useEffect(() => {

    if (!mapRef.current) {
      mapRef.current = L.map("map-container").setView(center, zoom);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(mapRef.current);
    }

    if (userLocation) {
      L.marker([userLocation.lat, userLocation.lng])
        .addTo(mapRef.current)
        .bindPopup("You are here");
    }


    centers.forEach((center) => {
      const marker = L.marker([
        parseFloat(center.latitude),
        parseFloat(center.longitude),
      ])
        .addTo(mapRef.current)
        .on("click", () => setSelectedCenter(center.id));

      marker.bindPopup(`<b>${center.name}</b><br>${center.address}`);
    });
  }, [userLocation, centers]);

  return (
    <div
      id="map-container"
      style={{ height: "400px", width: "100%", borderRadius: "10px" }}
    ></div>
  );
}

function BookingCreate() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(1);
  const [wasteTypes, setWasteTypes] = useState([]);
  const [centers, setCenters] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 11.874477, lng: 75.370369 }); // Default: Kannur
  const [nearestCenter, setNearestCenter] = useState(null);

  const [formData, setFormData] = useState({
    waste_type_id: searchParams.get("waste_type") || "",
    quantity_kg: "",
    pickup_date: "",
    pickup_time: "",
    address: "",
    waste_image: null,
  });

  useEffect(() => {
    api.get("waste/types/")
      .then((res) => {
        setWasteTypes(res.data);
        const wasteTypeParam = searchParams.get("waste_type");
        if (wasteTypeParam) {
          setFormData((prev) => ({ ...prev, waste_type_id: wasteTypeParam }));
        }
      })
      .catch((err) => console.error(err));

    api.get("waste/centers/")
      .then((res) => setCenters(res.data))
      .catch((err) => console.error(err));

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(location);
          setMapCenter(location);
          findNearestCenter(location);
        },
        (err) => {
          console.warn("Location access denied:", err.message);
          const fallback = { lat: 28.6139, lng: 77.2090 };
          setMapCenter(fallback);
        }
      );
    }
  }, []);

  const findNearestCenter = async (location) => {
    try {
      const res = await api.post("waste/centers/nearest/", {
        latitude: location.lat,
        longitude: location.lng,
      });
      setNearestCenter(res.data.center);
      setSelectedCenter(res.data.center.id);
    } catch (err) {
      console.error("Error finding nearest center:", err);
    }
  };

  const handleChange = (e) => {
    if (e.target.name === "waste_image") {
      setFormData({ ...formData, waste_image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (step === 1) {
      setStep(2);
      return;
    }

    const submitData = new FormData();
    submitData.append("waste_type_id", formData.waste_type_id);
    submitData.append("quantity_kg", formData.quantity_kg);
    submitData.append("pickup_date", formData.pickup_date);
    submitData.append("pickup_time", formData.pickup_time);
    submitData.append("address", formData.address);

    if (selectedCenter) {
      submitData.append("selected_center_id", selectedCenter);
    }

    if (formData.waste_image) {
      submitData.append("waste_image", formData.waste_image);
    }

    try {
      const res = await api.post("waste/booking/create/", submitData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate(`/booking/${res.data.id}/payment`);
    } catch (err) {
      console.error("Error creating booking:", err);
      alert("Error creating booking.");
    }
  };

  const selectedWasteType = wasteTypes.find(
    (wt) => wt.id === parseInt(formData.waste_type_id)
  );
  const totalPrice = selectedWasteType
    ? (parseFloat(formData.quantity_kg) || 0) *
      parseFloat(selectedWasteType.price_per_kg)
    : 0;

  return (
    <div className="page-shell">
      <div className="container">
        <div className="card stack">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <div>
              <h2 style={{ margin: "0 0 6px" }}>Book Waste Pickup</h2>
              <p style={{ color: "#6b7280", margin: 0 }}>Two quick steps to schedule a pickup.</p>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <div
                className="pill"
                style={{
                  background: step >= 1 ? "#2196F3" : "#e5e7eb",
                  color: step >= 1 ? "#fff" : "#374151",
                }}
              >
                Step 1: Details
              </div>
              <div
                className="pill"
                style={{
                  background: step >= 2 ? "#2196F3" : "#e5e7eb",
                  color: step >= 2 ? "#fff" : "#374151",
                }}
              >
                Step 2: Select Center
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="stack">
            {step === 1 && (
              <div className="grid-wide">
                <div className="stack">
                  <div className="form-control">
                    <label>Waste Type *</label>
                    <select
                      name="waste_type_id"
                      value={formData.waste_type_id}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select waste type</option>
                      {wasteTypes.map((wt) => (
                        <option key={wt.id} value={wt.id}>
                          {wt.name} - ₹{wt.price_per_kg}/kg
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-control">
                    <label>Quantity (kg) *</label>
                    <input
                      type="number"
                      name="quantity_kg"
                      value={formData.quantity_kg}
                      onChange={handleChange}
                      min="0.01"
                      step="0.01"
                      required
                    />
                  </div>

                  <div className="form-control">
                    <label>Pickup Date *</label>
                    <input
                      type="date"
                      name="pickup_date"
                      value={formData.pickup_date}
                      onChange={handleChange}
                      min={new Date().toISOString().split("T")[0]}
                      required
                    />
                  </div>

                  <div className="form-control">
                    <label>Pickup Time *</label>
                    <input
                      type="time"
                      name="pickup_time"
                      value={formData.pickup_time}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="stack">
                  <div className="form-control">
                    <label>Address *</label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      rows="5"
                    />
                  </div>

                  <div className="form-control">
                    <label>Waste Image (Optional)</label>
                    <input
                      type="file"
                      name="waste_image"
                      accept="image/*"
                      onChange={handleChange}
                    />
                  </div>

                  {selectedWasteType && formData.quantity_kg && (
                    <div
                      style={{
                        padding: 14,
                        background: "#f8fafc",
                        borderRadius: 12,
                        border: "1px solid #e5e7eb",
                      }}
                    >
                      <strong>Estimated Total: ₹{totalPrice.toFixed(2)}</strong>
                    </div>
                  )}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="stack">
                <div>
                  <h3 style={{ margin: "0 0 6px" }}>Select Collection Center</h3>
                  <p style={{ margin: 0, color: "#6b7280" }}>
                    Choose the nearest center for waste collection.
                  </p>
                </div>

                <div className="map-shell">
                  <LeafletMap
                    center={[mapCenter.lat, mapCenter.lng]}
                    zoom={12}
                    userLocation={userLocation}
                    centers={centers}
                    setSelectedCenter={setSelectedCenter}
                  />
                </div>

                <div className="stack">
                  {nearestCenter && (
                    <div
                      style={{
                        padding: 14,
                        backgroundColor: "#e3f2fd",
                        borderRadius: 12,
                        border: "1px solid #bfdbfe",
                      }}
                    >
                      <strong>Nearest Center: {nearestCenter.name}</strong>
                      <p style={{ margin: "6px 0 0", color: "#1f2937" }}>{nearestCenter.address}</p>
                    </div>
                  )}

                  <div className="form-control">
                    <label>Select Center *</label>
                    <select
                      value={selectedCenter || ""}
                      onChange={(e) => setSelectedCenter(parseInt(e.target.value))}
                      required
                    >
                      <option value="">Select a center</option>
                      {centers.map((center) => (
                        <option key={center.id} value={center.id}>
                          {center.name} - {center.address}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="booking-actions">
                  <button type="button" onClick={() => setStep(1)} className="btn btn-outline">
                    Back
                  </button>
                  <button type="submit" className="btn btn-accent">
                    Create Booking
                  </button>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="booking-actions">
                <button type="submit" className="btn btn-primary">
                  Next: Select Center
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default BookingCreate;
