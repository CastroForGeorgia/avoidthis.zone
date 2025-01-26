import React, { useEffect, useState } from 'react';
import { Modal, Form, Select, Checkbox, Button, Spin, Alert } from 'antd';
import { Map as OlMap, View } from 'ol';

import { fetchEnumValues } from '../../firebase';
import MapComponent from '@terrestris/react-geo/dist/Map/MapComponent/MapComponent';
import TileLayer from 'ol/layer/Tile';
import { fromLonLat } from 'ol/proj';
import { OSM } from 'ol/source';

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
    const [enumData, setEnumData] = useState<null | Record<string, string[]>>(null);
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
                        setEnumError("Failed to load enumeration data.");
                    }
                } catch (error) {
                    console.error("Error fetching enums:", error);
                    setEnumError("An error occurred while fetching data.");
                } finally {
                    setIsLoadingEnums(false);
                }
            };

            loadEnums();
        }
    }, [enumData]);

    const handleFormSubmit = (values: any) => {
        const report = {
            coordinates: clickedCoordinates,
            ...values,
        };
        console.log('New Report:', report);

        onSubmit(report);
        setClickedCoordinates(null);
    };

    const handleCancel = () => {
        setClickedCoordinates(null);
    };

    return (
        <Modal
            title="Submit a Report"
            open={!!clickedCoordinates}
            onCancel={handleCancel}
            footer={null}
            destroyOnClose
        >
            {clickedCoordinates && minimap && (
                <div style={{ height: '200px', marginBottom: '16px' }}>
                    <MapComponent
                        id='minimap'
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
                    <Spin tip="Loading..." />
                </div>
            ) : enumError ? (
                <Alert
                    message="Error"
                    description={enumError}
                    type="error"
                    showIcon
                    closable
                />
            ) : enumData ? (
                <Form onFinish={handleFormSubmit} layout="vertical">
                    {/* Tactics */}
                    <Form.Item
                        label="Tactics"
                        name="tactics"
                        rules={[{ required: true, message: 'Please select at least one tactic.' }]}
                    >
                        <Checkbox.Group
                            options={enumData.ALLOWED_TACTICS.map((tactic) => ({
                                label: tactic,
                                value: tactic,
                            }))}
                        />
                    </Form.Item>

                    {/* Raid Location Category */}
                    <Form.Item
                        label="Raid Location Category"
                        name="raidLocationCategory"
                        rules={[{ required: true, message: 'Please select a raid location category.' }]}
                    >
                        <Select placeholder="Select a category" allowClear>
                            {enumData.ALLOWED_RAID_LOCATION_CATEGORY.map((category) => (
                                <Select.Option key={category} value={category}>
                                    {category}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    {/* Detail Location */}
                    <Form.Item
                        label="Detail Location"
                        name="detailLocation"
                        rules={[{ required: true, message: 'Please select a detail location.' }]}
                    >
                        <Select placeholder="Select a detail location" allowClear>
                            {enumData.ALLOWED_DETAIL_LOCATION.map((detail) => (
                                <Select.Option key={detail} value={detail}>
                                    {detail}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    {/* Was Successful */}
                    <Form.Item
                        label="Was Successful"
                        name="wasSuccessful"
                        rules={[{ required: true, message: 'Please select an outcome.' }]}
                    >
                        <Select placeholder="Select outcome" allowClear>
                            {enumData.ALLOWED_WAS_SUCCESSFUL.map((option) => (
                                <Select.Option key={option} value={option}>
                                    {option}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    {/* Location Reference */}
                    <Form.Item
                        label="Location Reference"
                        name="locationReference"
                        rules={[{ required: true, message: 'Please select a location reference.' }]}
                    >
                        <Select placeholder="Select reference" allowClear>
                            {enumData.ALLOWED_LOCATION_REFERENCE.map((ref) => (
                                <Select.Option key={ref} value={ref}>
                                    {ref}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    {/* Source of Info */}
                    <Form.Item
                        label="Source of Info"
                        name="sourceOfInfo"
                        rules={[{ required: true, message: 'Please select a source of information.' }]}
                    >
                        <Select placeholder="Select source" allowClear>
                            {enumData.ALLOWED_SOURCE_OF_INFO.map((source) => (
                                <Select.Option key={source} value={source}>
                                    {source}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    {/* Submit Button */}
                    <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button onClick={handleCancel} style={{ marginRight: '8px' }}>
                            Cancel
                        </Button>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </div>
                </Form>
            ) : (
                <Alert
                    message="No Data"
                    description="No enumeration data available."
                    type="warning"
                    showIcon
                    closable
                />
            )}
        </Modal>
    );
};

export default ReportModal;