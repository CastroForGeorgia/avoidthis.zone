import React, { useState } from 'react';
import { Modal } from 'antd';
import { useTranslation } from 'react-i18next';

import { useEnumData } from '../../hooks/useEnumData'; // Adjust the import path as needed
import { EnumForm } from '../forms/EnumForm';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import { Minimap } from './Minimap';
import { createRaidReport } from '../../firebase';
import { Coordinate } from 'ol/coordinate';
import { fromLonLat, toLonLat } from 'ol/proj';

interface ReportModalProps {
    clickedCoordinates: [number, number];
    setClickedCoordinates: (coords: [number, number] | null) => void;
    onSubmit: (report: any) => void;
}

const ReportModal: React.FC<ReportModalProps> = ({
    clickedCoordinates,
    setClickedCoordinates,
    onSubmit,
}) => {
    const { t } = useTranslation();
    const { enumData, isLoading, error } = useEnumData();
    const [centerCoordinates, setCenterCoordinates] = useState<Coordinate>(clickedCoordinates);

    const handleCancel = () => {
        setClickedCoordinates(null);
    };

    const handleFormSubmit = async (values: any) => {
        // Transform the clicked coordinates to WGS84 if necessary
        // Assuming clickedCoordinates are in EPSG:3857, convert to EPSG:4326
        const transformedCoordinates = toLonLat(centerCoordinates) as [number, number];
        // If clickedCoordinates are already in EPSG:4326, skip transformation
        // const transformedCoordinates = clickedCoordinates;

        const report = {
            coordinates: { 
                lng: transformedCoordinates[0], // Longitude
                lat: transformedCoordinates[1], // Latitude
            },
            ...values,
        };
        await createRaidReport(report)
        console.log(t('ReportModal.successMessage'), report);
        onSubmit(report);
        setClickedCoordinates(null);
    };

    return (
        <Modal
            title={t("ReportModal.title")}
            open={!!clickedCoordinates}
            onCancel={handleCancel}
            footer={null}
            destroyOnClose
        >
            {/* Language Switcher */}
            <LanguageSwitcher />
            {clickedCoordinates && (
                <Minimap
                    coordinates={clickedCoordinates}
                    onCenterChange={(newCenter) => setCenterCoordinates(newCenter)}
                />
            )}
            <EnumForm
                enumData={enumData}
                isLoading={isLoading}
                error={error}
                onSubmit={handleFormSubmit}
                onCancel={handleCancel}
            />
        </Modal>
    );
};

export default ReportModal;
