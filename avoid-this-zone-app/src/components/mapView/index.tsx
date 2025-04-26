import React from "react";
import BasicMapComponent from "../BasicMapComponent";
import FindMeComponent from "../FindMeComponent";
import { HeatMapComponent } from "../HeatMapComponent/HeatMapComponent";

export const MapView: React.FC = () => {
  return (
    <div>
      <BasicMapComponent />
      <FindMeComponent />
      <HeatMapComponent />
    </div>
  );
};