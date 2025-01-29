import React, { useState } from 'react';
import { Modal, Spin } from 'antd';
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
    const [submitting, setSubmitting] = useState(false);

    const handleCancel = () => {
        setClickedCoordinates(null);
    };

    const handleFormSubmit = async (values: any) => {
        setSubmitting(true);
        try {
            // Transform the clicked coordinates to WGS84 if necessary
            const transformedCoordinates = toLonLat(centerCoordinates) as [number, number];

            const report = {
                coordinates: {
                    lng: transformedCoordinates[0], // Longitude
                    lat: transformedCoordinates[1], // Latitude
                },
                ...values,
            };

            await createRaidReport(report);
            console.log(t('ReportModal.successMessage'), report);
            onSubmit(report);
            setClickedCoordinates(null);
        } catch (error) {
            console.error('Error submitting report:', error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal
            title={t("ReportModal.title")}
            open={!!clickedCoordinates}
            onCancel={handleCancel}
            footer={null}
            destroyOnClose
        >
            <LanguageSwitcher />
            {clickedCoordinates && (
                <Minimap
                    coordinates={clickedCoordinates}
                    onCenterChange={(newCenter) => setCenterCoordinates(newCenter)}
                />
            )}
            {submitting ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                    <Spin size="large" />
                </div>
            ) : (
                <EnumForm
                    enumData={enumData}
                    isLoading={isLoading}
                    error={error}
                    onSubmit={handleFormSubmit}
                    onCancel={handleCancel}
                />
            )}
        </Modal>
    );
};

export default ReportModal;
