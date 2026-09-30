"use client";

import { useEffect, useRef, useState } from "react";
import { DistrictConfig, Project } from "@/lib/types";
import { MapPin, Layers } from "lucide-react";

interface MapViewProps {
  districts: DistrictConfig[];
  projects: Project[];
  selectedDistrictId?: string;
  onSelectDistrict?: (distId: string) => void;
}

export function MapView({
  districts,
  projects,
  selectedDistrictId,
  onSelectDistrict,
}: MapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let isMounted = true;

    // Dynamically load leaflet on client only
    import("leaflet").then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      // Import css dynamically
      // @ts-ignore
      import("leaflet/dist/leaflet.css");

      // Clear existing map instance if any
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      if (districts.length === 0) return;

      // Calculate center
      const avgLat = districts.reduce((acc, d) => acc + d.lat, 0) / districts.length;
      const avgLng = districts.reduce((acc, d) => acc + d.lng, 0) / districts.length;

      const map = L.map(mapContainerRef.current, {
        zoomControl: true,
        scrollWheelZoom: false,
      }).setView([avgLat, avgLng], 6);

      // OpenStreetMap standard tiles (Zero API key/billing risk)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18,
      }).addTo(map);

      // Add district circles
      districts.forEach((d) => {
        const districtProjects = projects.filter(
          (p) => p.district.toLowerCase() === d.id.toLowerCase()
        );
        const projectCount = districtProjects.length;
        const totalRequests = districtProjects.reduce((acc, p) => acc + p.issue_count, 0);
        const avgScore =
          projectCount > 0
            ? districtProjects.reduce((acc, p) => acc + p.priority_score, 0) / projectCount
            : 50;

        // Size circle based on need count
        const radius = Math.max(18000, Math.min(55000, totalRequests * 3500));

        // Color based on priority score
        const color = avgScore >= 75 ? "#dc2626" : avgScore >= 60 ? "#d97706" : "#059669";
        const isSelected = selectedDistrictId?.toLowerCase() === d.id.toLowerCase();

        const circle = L.circle([d.lat, d.lng], {
          color: isSelected ? "#1e3a8a" : color,
          weight: isSelected ? 3 : 1.5,
          fillColor: color,
          fillOpacity: isSelected ? 0.6 : 0.35,
          radius: radius,
        }).addTo(map);

        circle.bindPopup(`
          <div style="font-family: inherit; font-size: 13px; line-height: 1.4;">
            <strong style="font-size: 14px; color: #0f172a;">${d.name} (${d.native_name || ""})</strong><br/>
            <span style="color: #64748b;">Population:</span> ${d.population.toLocaleString()}<br/>
            <span style="color: #64748b;">Digital Access:</span> ${Math.round(d.digital_access_rate * 100)}%<br/>
            <hr style="margin: 6px 0; border: none; border-top: 1px solid #e2e8f0;"/>
            <span style="color: #1e3a8a; font-weight: bold;">${districtProjects.length} Community Needs</span> (${totalRequests} Citizen Requests)<br/>
            <span style="color: #64748b;">Avg Priority:</span> <strong>${avgScore.toFixed(1)}/100</strong>
          </div>
        `);

        circle.on("click", () => {
          if (onSelectDistrict) {
            onSelectDistrict(d.id);
          }
        });
      });

      mapInstanceRef.current = map;
      setMapLoaded(true);
    });

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [districts, projects, selectedDistrictId, onSelectDistrict]);

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs flex flex-col h-full">
      <div className="p-3 border-b border-slate-100 flex items-center justify-between text-xs bg-slate-50">
        <div className="flex items-center gap-1.5 font-bold text-slate-800">
          <MapPin className="w-4 h-4 text-blue-700" />
          <span>GIS District Need Density</span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600 inline-block" />
            High Priority
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
            Moderate
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
            Lower Gap
          </span>
        </div>
      </div>

      <div className="relative flex-1 min-h-[360px] w-full bg-slate-100">
        <div ref={mapContainerRef} className="absolute inset-0 w-full h-full z-10" />
        {!mapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-100 text-slate-400 text-xs">
            <Layers className="w-5 h-5 animate-pulse mr-2" />
            Loading GIS Map...
          </div>
        )}
      </div>
    </div>
  );
}
