import React, { useEffect, useState } from 'react';
import { Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import { Map as OlMap, View } from 'ol';

import { useEnumData } from '../../hooks/useEnumData'; // Adjust the import path as needed
import MapComponent from '@terrestris/react-geo/dist/Map/MapComponent/MapComponent';
import TileLayer from 'ol/layer/Tile';
import { fromLonLat } from 'ol/proj';
import OSM from 'ol/source/OSM';
import { EnumForm } from '../forms/EnumForm';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';

interface ReportModalProps {
    clickedCoordinates: [number, number];
    setClickedCoordinates: (coords: [number, number] | null) => void;
    onSubmit: (report: any) => void;
}

const Minimap: React.FC<{
    coordinates: [number, number];
}> = ({ coordinates }) => {
    const [minimap, setMinimap] = useState<OlMap | null>(null);

    useEffect(() => {
        if (!minimap) {
            const newMinimap = new OlMap({
                layers: [
                    new TileLayer({
                        source: new OSM(),
                    }),
                ],
                view: new View({
                    center: fromLonLat([-84.388, 33.749]), // Default center
                    zoom: 15,
                    minZoom: 15,
                    maxZoom: 15,
                }),
                controls: [],
            });
            setMinimap(newMinimap);
        }

        if (minimap && coordinates) {
            minimap.getView().setCenter(coordinates);
        }
    }, [minimap, coordinates]);

    return minimap ? (
        <div style={{ height: '200px', marginBottom: '16px' }}>
            <MapComponent
                id="minimap"
                map={minimap}
                className="minimap"
                style={{
                    width: '100%',
                    height: '100%',
                    border: '1px solid #ddd',
                }}
            />
        </div>
    ) : null;
};

const ReportModal: React.FC<ReportModalProps> = ({
    clickedCoordinates,
    setClickedCoordinates,
    onSubmit,
}) => {
    const { t } = useTranslation();
    const { enumData, isLoading, error } = useEnumData();
    const handleCancel = () => {
        setClickedCoordinates(null);
    };

    const handleFormSubmit = (values: any) => {
        const report = {
            coordinates: clickedCoordinates,
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
            {clickedCoordinates && <Minimap coordinates={clickedCoordinates} />}
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
