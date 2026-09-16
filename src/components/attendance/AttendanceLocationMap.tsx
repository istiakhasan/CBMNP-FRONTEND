"use client";

import { useEffect } from "react";
import { Circle, CircleMarker, MapContainer, TileLayer, Tooltip, useMap } from "react-leaflet";
import type { LatLngExpression } from "leaflet";

type Coordinates = { latitude: number; longitude: number };
type Props = { office?: { name?: string; latitude?: number | string; longitude?: number | string; radiusMeters?: number | string } | null; employeeLocation: Coordinates; isInsideRange: boolean };

function MapViewport({ office, employeeLocation }: Pick<Props, "office" | "employeeLocation">) {
  const map = useMap();
  useEffect(() => {
    const employeePoint: LatLngExpression = [employeeLocation.latitude, employeeLocation.longitude];
    if (!office?.latitude || !office?.longitude) { map.setView(employeePoint, 16); return; }
    const latitude = Number(office.latitude); const longitude = Number(office.longitude); const radius = Number(office.radiusMeters || 100);
    const bounds = map.getBounds();
    bounds.extend([latitude, longitude]).extend(employeePoint).extend([latitude + radius / 111_320, longitude]);
    map.fitBounds(bounds, { padding: [28, 28], maxZoom: 17 });
  }, [map, office, employeeLocation]);
  return null;
}

export default function AttendanceLocationMap({ office, employeeLocation, isInsideRange }: Props) {
  const hasOfficeCoordinates = Number.isFinite(Number(office?.latitude)) && Number.isFinite(Number(office?.longitude));
  const initialCenter: LatLngExpression = hasOfficeCoordinates ? [Number(office!.latitude), Number(office!.longitude)] : [employeeLocation.latitude, employeeLocation.longitude];
  return <MapContainer center={initialCenter} zoom={16} className="h-full w-full" scrollWheelZoom>
    <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
    <MapViewport office={office} employeeLocation={employeeLocation} />
    {hasOfficeCoordinates && <Circle center={[Number(office!.latitude), Number(office!.longitude)]} radius={Number(office!.radiusMeters || 100)} pathOptions={{ color: "#2563eb", fillColor: "#3b82f6", fillOpacity: 0.18, weight: 2 }}><Tooltip permanent direction="bottom" offset={[0, 14]}>{office?.name || "Office"} · {office?.radiusMeters || 100}m</Tooltip></Circle>}
    <CircleMarker center={[employeeLocation.latitude, employeeLocation.longitude]} radius={8} pathOptions={{ color: "#ffffff", fillColor: isInsideRange ? "#10b981" : "#ef4444", fillOpacity: 1, weight: 3 }}><Tooltip permanent direction="top" offset={[0, -8]}>Your location {isInsideRange ? "(inside range)" : "(outside range)"}</Tooltip></CircleMarker>
  </MapContainer>;
}
