import React from "react";
import BasicMapComponent from "../BasicMapComponent";
import FindMeComponent from "../FindMeComponent";
import { HeatMapComponent } from "../HeatMapComponent/HeatMapComponent";

export const MapView: React.FC = () => {
  return (
    <div className="relative flex flex-1">
      <BasicMapComponent />
      <FindMeComponent />
      <HeatMapComponent />
    </div>
  );
};