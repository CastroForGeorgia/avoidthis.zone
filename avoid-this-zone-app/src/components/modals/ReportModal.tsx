import React, { useState } from 'react';
import { Modal } from 'antd';
import { useTranslation } from 'react-i18next';

import { useEnumData } from '../../hooks/useEnumData'; // Adjust the import path as needed
import { EnumForm } from '../forms/EnumForm';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import { Minimap } from './Minimap';
import { generateRandomPins } from '../../utils/geoUtils';

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
    const [centerCoordinates, setCenterCoordinates] = useState<[number, number]>(clickedCoordinates);

    const handleCancel = () => {
        setClickedCoordinates(null);
    };

    const handleFormSubmit = (values: any) => {
        const report = {
            coordinates: generateRandomPins(centerCoordinates, 100, 5),
            ...values,
        };
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
