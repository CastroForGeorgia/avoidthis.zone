import React, { useEffect, useState } from 'react';
import { Modal, Form, Button, Spin, Alert } from 'antd';
import { useTranslation } from 'react-i18next'; // Assuming you're using react-i18next for translations
import { Map as OlMap, View } from 'ol';

import { fetchEnumValues } from '../../firebase';
import MapComponent from '@terrestris/react-geo/dist/Map/MapComponent/MapComponent';
import TileLayer from 'ol/layer/Tile';
import { fromLonLat } from 'ol/proj';
import { OSM } from 'ol/source';
import TacticsSelector from '../selectors/TacticsSelector';
import RaidLocationCategorySelector from '../selectors/RaidLocationCategorySelector';
import DetailLocationSelector from '../selectors/DetailLocationSelector';
import WasSuccessfulSelector from '../selectors/WasSuccessfulSelector';
import LocationReferenceSelector from '../selectors/LocationReferenceSelector';
import SourceOfInfoSelector from '../selectors/SourceOfInfoSelector';

interface ReportModalProps {
    map: OlMap;
    clickedCoordinates: [number, number];
    setClickedCoordinates: (coords: [number, number] | null) => void;
    onSubmit: (report: any) => void;
}

const ReportModal: React.FC<ReportModalProps> = ({
    map,
    clickedCoordinates,
    setClickedCoordinates,
    onSubmit,
}) => {
    const { t } = useTranslation();
    const [enumData, setEnumData] = useState<null | Record<string, any>>(null);
    const [isLoadingEnums, setIsLoadingEnums] = useState(false);
    const [enumError, setEnumError] = useState<string | null>(null);
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
                    center: fromLonLat([-84.3880, 33.7490]),
                    zoom: 15,
                    minZoom: 15,
                    maxZoom: 15,
                }),
                controls: [],
            });
            setMinimap(newMinimap);
        }

        if (minimap && clickedCoordinates) {
            minimap.getView().setCenter(clickedCoordinates);
        }
    }, [minimap, clickedCoordinates]);

    useEffect(() => {
        if (!enumData) {
            const loadEnums = async () => {
                setIsLoadingEnums(true);
                setEnumError(null);
                try {
                    const data = await fetchEnumValues();
                    if (data) {
                        setEnumData(data);
                    } else {
                        setEnumError(t('ReportModal.errorMessage'));
                    }
                } catch (error) {
                    console.error(t('ReportModal.errorMessage'), error);
                    setEnumError(t('ReportModal.errorMessage'));
                } finally {
                    setIsLoadingEnums(false);
                }
            };

            loadEnums();
        }
    }, [enumData, t]);

    const handleFormSubmit = (values: any) => {
        const report = {
            coordinates: clickedCoordinates,
            ...values,
        };
        console.log(t('ReportModal.successMessage'), report);

        onSubmit(report);
        setClickedCoordinates(null);
    };

    const handleCancel = () => {
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
            {clickedCoordinates && minimap && (
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
            )}
            {isLoadingEnums ? (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <Spin tip={t('ReportModal.loadingMessage')} />
                </div>
            ) : enumError ? (
                <Alert
                    message={t('Common.errorOccurred')}
                    description={enumError}
                    type="error"
                    showIcon
                    closable
                />
            ) : enumData ? (
                <Form onFinish={handleFormSubmit} layout="vertical">
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


                    {/* Submit Button */}
                    <div
                        className="modal-footer"
                        style={{ display: 'flex', justifyContent: 'flex-end' }}
                    >
                        <Button onClick={handleCancel} style={{ marginRight: '8px' }}>
                            {t('Common.cancelButton')}
                        </Button>
                        <Button type="primary" htmlType="submit">
                            {t('Common.confirmButton')}
                        </Button>
                    </div>
                </Form>
            ) : (
                <Alert
                    message={t('Common.errorOccurred')}
                    description={t('ReportModal.errorMessage')}
                    type="warning"
                    showIcon
                    closable
                />
            )}
        </Modal>
    );
};

export default ReportModal;
