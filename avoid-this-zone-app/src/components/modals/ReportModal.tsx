// src/components/ReportModal.tsx
import React, { useEffect, useState } from 'react';
import { Modal, Form, Select, Checkbox, Button, Spin, Alert } from 'antd';
import { Map as OlMap } from 'ol';

import { fetchEnumValues } from '../../firebase';

interface ReportModalProps {
    map: OlMap;
    onSubmit: (report: any) => void;
}

const ReportModal: React.FC<ReportModalProps> = ({ map, onSubmit }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [clickedCoordinates, setClickedCoordinates] = useState<[number, number] | null>(null);
    const [enumData, setEnumData] = useState<null | Record<string, string[]>>(null);
    const [isLoadingEnums, setIsLoadingEnums] = useState(false);
    const [enumError, setEnumError] = useState<string | null>(null);

    useEffect(() => {
        const handleMapClick = (evt: any) => {
            const coordinates = evt.coordinate as [number, number];
            setClickedCoordinates(coordinates);
            setIsModalOpen(true);
        };

        // Attach map click listener
        map.on('singleclick', handleMapClick);

        // Cleanup listener on unmount
        return () => {
            map.un('singleclick', handleMapClick);
        };
    }, [map]);

    useEffect(() => {
        if (isModalOpen && !enumData) {
            // Fetch enums only when modal is opened and enums are not yet loaded
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
    }, [isModalOpen, enumData]);

    const handleFormSubmit = (values: any) => {
        if (!clickedCoordinates) {
            // Safety check, should not happen
            console.error("No coordinates available for the report.");
            return;
        }

        const report = {
            coordinates: clickedCoordinates,
            ...values,
        };
        console.log('New Report:', report);

        onSubmit(report);
        setIsModalOpen(false);
        setClickedCoordinates(null);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setClickedCoordinates(null);
    };

    return (
        <Modal
            title="Submit a Report"
            open={isModalOpen}
            onCancel={handleCancel}
            footer={null}
            destroyOnClose
        >
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