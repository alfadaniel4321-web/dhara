import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";

const KERALA_CITIES = {
  wayanad: { name: "Wayanad", lat: 11.6854, lon: 76.1320, desc: "High-range organic farming belt" },
  kozhikode: { name: "Kozhikode", lat: 11.2588, lon: 75.7804, desc: "Malabar coastal hub" },
  malappuram: { name: "Malappuram", lat: 11.0510, lon: 76.0711, desc: "Farm district" },
  thrissur: { name: "Thrissur", lat: 10.5276, lon: 76.2144, desc: "Cultural capital" },
  cochin: { name: "Kochi", lat: 9.9312, lon: 76.2673, desc: "Commercial hub" },
  idukki: { name: "Idukki", lat: 9.8513, lon: 76.9374, desc: "Spice garden district" },
  kottayam: { name: "Kottayam", lat: 9.5916, lon: 76.5222, desc: "Backwater crop belt" },
  alappuzha: { name: "Alappuzha", lat: 9.4981, lon: 76.3388, desc: "Rice bowl of Kerala" },
  kollam: { name: "Kollam", lat: 8.8932, lon: 76.6141, desc: "Cashew & coconut" },
  trivandrum: { name: "Thiruvananthapuram", lat: 8.5241, lon: 76.9366, desc: "Capital district" },
  palakkad: { name: "Palakkad", lat: 10.7867, lon: 76.6548, desc: "Granary of Kerala" },
  kannur: { name: "Kannur", lat: 11.8745, lon: 75.3704, desc: "Northern farm belt" },
};

function haversineDist(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(1);
}

export default function FarmMap({ farmerLocation = "wayanad", customerLocation = "kochi" }) {
  const mapRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [dist, setDist] = useState(null);

  const farmer = KERALA_CITIES[farmerLocation] || KERALA_CITIES.wayanad;
  const customer = KERALA_CITIES[customerLocation] || KERALA_CITIES.cochin;

  useEffect(() => {
    const d = haversineDist(farmer.lat, farmer.lon, customer.lat, customer.lon);
    setDist(d);
  }, [farmerLocation, customerLocation]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://unpkg.com/leaflet@1.9.4/dist/leaflet.js`;
    script.onload = () => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);

      script.onload = () => {
        if (!mapRef.current || !window.L) return;
        const L = window.L;
        const map = L.map(mapRef.current, {
          zoomControl: false,
          attributionControl: false,
        }).setView([(farmer.lat + customer.lat) / 2, (farmer.lon + customer.lon) / 2], 8);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
        }).addTo(map);

        const farmerIcon = L.divIcon({
          html: `<div style="background:#2D6A4F;color:#fff;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;border:2px solid #95D5B2;box-shadow:0 2px 8px rgba(0,0,0,0.3);">🌾</div>`,
          className: "",
          iconSize: [32, 32],
          iconAnchor: [16, 32],
        });

        const customerIcon = L.divIcon({
          html: `<div style="background:#C8A951;color:#fff;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;border:2px solid #FFFDF5;box-shadow:0 2px 8px rgba(0,0,0,0.3);">🏠</div>`,
          className: "",
          iconSize: [32, 32],
          iconAnchor: [16, 32],
        });

        L.marker([farmer.lat, farmer.lon], { icon: farmerIcon })
          .addTo(map)
          .bindPopup(`<b>${farmer.name}</b><br/>${farmer.desc}`);

        L.marker([customer.lat, customer.lon], { icon: customerIcon })
          .addTo(map)
          .bindPopup(`<b>${customer.name}</b><br/>Your location`);

        const line = L.polyline(
          [
            [farmer.lat, farmer.lon],
            [customer.lat, customer.lon],
          ],
          {
            color: "#2D6A4F",
            weight: 2,
            opacity: 0.6,
            dashArray: "8, 8",
          }
        ).addTo(map);

        map.invalidateSize();
        setLoaded(true);
      };
    };
    document.head.appendChild(script);
  }, [farmerLocation, customerLocation]);

  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="relative">
        <div
          ref={mapRef}
          style={{
            width: "100%",
            height: "220px",
            background: "#042f1a",
          }}
        />
        {!loaded && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: "rgba(4,47,26,0.8)" }}
          >
            <div className="text-center">
              <div
                style={{
                  width: 32,
                  height: 32,
                  border: "3px solid rgba(149,213,178,0.3)",
                  borderTopColor: "#95D5B2",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                  margin: "0 auto 8px",
                }}
              />
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>
                Loading map...
              </p>
            </div>
          </div>
        )}
      </div>
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ background: "rgba(255,255,255,0.03)" }}
      >
        <div className="flex items-center gap-2 text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>
          <MapPin size={14} style={{ color: "#95D5B2" }} />
          <span>{farmer.name} → {customer.name}</span>
        </div>
        {dist && (
          <span
            className="text-xs font-bold"
            style={{ color: "#95D5B2" }}
          >
            ~{dist} km
          </span>
        )}
      </div>
    </div>
  );
}
