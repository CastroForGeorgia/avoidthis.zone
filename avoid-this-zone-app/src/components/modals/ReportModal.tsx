import React, { useEffect, useState } from 'react';
import { Modal, Form, Button, Spin, Alert } from 'antd';
import { useTranslation } from 'react-i18next';
import { Map as OlMap, View } from 'ol';

import { useEnumData } from '../../hooks/useEnumData'; // Adjust the import path as needed
import MapComponent from '@terrestris/react-geo/dist/Map/MapComponent/MapComponent';
import TileLayer from 'ol/layer/Tile';
import { fromLonLat } from 'ol/proj';
import TacticsSelector from '../selectors/TacticsSelector';
import RaidLocationCategorySelector from '../selectors/RaidLocationCategorySelector';
import DetailLocationSelector from '../selectors/DetailLocationSelector';
import WasSuccessfulSelector from '../selectors/WasSuccessfulSelector';
import LocationReferenceSelector from '../selectors/LocationReferenceSelector';
import SourceOfInfoSelector from '../selectors/SourceOfInfoSelector';
import OSM from 'ol/source/OSM';

interface ReportModalProps {
    map: OlMap;
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

const EnumErrorAlert: React.FC<{ error: string }> = ({ error }) => (
    <Alert
        message="Error"
        description={error}
        type="error"
        showIcon
        closable
    />
);

const EnumLoadingSpinner: React.FC<{ message: string }> = ({ message }) => (
    <div style={{ textAlign: 'center', padding: '20px' }}>
        <Spin tip={message} />
    </div>
);

const EnumForm: React.FC<{
    enumData: Record<string, any>;
    onSubmit: (values: any) => void;
    onCancel: () => void;
}> = ({ enumData, onSubmit, onCancel }) => {
    const { t } = useTranslation();

    return (
        <Form onFinish={onSubmit} layout="vertical">
            <Form.Item
                label={t('ReportModal.labels.tactics')}
                name="tactics"
                rules={[
                    {
                        required: true,
                        message: t('ReportModal.formErrors.requiredField'),
                    },
                ]}
            >
                <TacticsSelector options={enumData.ALLOWED_TACTICS} />
            </Form.Item>

            <Form.Item
                label={t('ReportModal.labels.raidLocationCategory')}
                name="raidLocationCategory"
                rules={[
                    {
                        required: true,
                        message: t('ReportModal.formErrors.requiredField'),
                    },
                ]}
            >
                <RaidLocationCategorySelector options={enumData.ALLOWED_RAID_LOCATION_CATEGORY} />
            </Form.Item>

            <Form.Item
                label={t('ReportModal.labels.detailLocation')}
                name="detailLocation"
                rules={[
                    {
                        required: true,
                        message: t('ReportModal.formErrors.requiredField'),
                    },
                ]}
            >
                <DetailLocationSelector options={enumData.ALLOWED_DETAIL_LOCATION} />
            </Form.Item>

            <Form.Item
                label={t('ReportModal.labels.wasSuccessful')}
                name="wasSuccessful"
                rules={[
                    {
                        required: true,
                        message: t('ReportModal.formErrors.requiredField'),
                    },
                ]}
            >
                <WasSuccessfulSelector options={enumData.ALLOWED_WAS_SUCCESSFUL} />
            </Form.Item>

            <Form.Item
                label={t('ReportModal.labels.locationReference')}
                name="locationReference"
                rules={[
                    {
                        required: true,
                        message: t('ReportModal.formErrors.requiredField'),
                    },
                ]}
            >
                <LocationReferenceSelector options={enumData.ALLOWED_LOCATION_REFERENCE} />
            </Form.Item>

            <Form.Item
                label={t('ReportModal.labels.sourceOfInfo')}
                name="sourceOfInfo"
                rules={[
                    {
                        required: true,
                        message: t('ReportModal.formErrors.requiredField'),
                    },
                ]}
            >
                <SourceOfInfoSelector options={enumData.ALLOWED_SOURCE_OF_INFO} />
            </Form.Item>

            <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button onClick={onCancel} style={{ marginRight: '8px' }}>
                    {t('Common.cancelButton')}
                </Button>
                <Button type="primary" htmlType="submit">
                    {t('Common.confirmButton')}
                </Button>
            </div>
        </Form>
    );
};

const ReportModal: React.FC<ReportModalProps> = ({
    map,
    clickedCoordinates,
    setClickedCoordinates,
    onSubmit,
}) => {
    const { t } = useTranslation();
    const { enumData, isLoading: isLoadingEnums, error: enumError } = useEnumData();

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
            title={t('ReportModal.title')}
            open={!!clickedCoordinates}
            onCancel={handleCancel}
            footer={null}
            destroyOnClose
        >
            {clickedCoordinates && <Minimap coordinates={clickedCoordinates} />}
            {isLoadingEnums && <EnumLoadingSpinner message={t('ReportModal.loadingMessage')} />}
            {enumError && <EnumErrorAlert error={enumError} />}
            {enumData && (
                <EnumForm enumData={enumData} onSubmit={handleFormSubmit} onCancel={handleCancel} />
            )}
        </Modal>
    );
};

export default ReportModal;
