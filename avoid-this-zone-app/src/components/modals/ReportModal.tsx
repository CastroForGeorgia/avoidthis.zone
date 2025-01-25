import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, Checkbox, Button } from 'antd';
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
        // Fetch enumeration data when the modal is initialized
        (async () => {
            const data = await fetchEnumValues();
            if (data) {
                setEnumData(data);
            }
        })();
    }, []);

    const handleFormSubmit = (values: any) => {
        const report = {
            coordinates: clickedCoordinates,
            ...values,
        };
        console.log('New Report:', report);

        onSubmit(report);
        setIsModalOpen(false);
        setClickedCoordinates(null);
    };

    if (!enumData) {
        return null; // Don't render the modal until data is loaded
    }

    const {
        ALLOWED_TACTICS = [],
        ALLOWED_RAID_LOCATION_CATEGORY = [],
        ALLOWED_DETAIL_LOCATION = [],
        ALLOWED_WAS_SUCCESSFUL = [],
        ALLOWED_LOCATION_REFERENCE = [],
        ALLOWED_SOURCE_OF_INFO = [],
    } = enumData;

    return (
        <Modal
            title="Submit a Report"
            open={isModalOpen} // Updated to use 'open'
            onCancel={() => setIsModalOpen(false)}
            footer={null}
        >
            <Form onFinish={handleFormSubmit} layout="vertical">
                {/* Tactics */}
                <Form.Item label="Tactics" name="tactics">
                    <Checkbox.Group
                        options={ALLOWED_TACTICS.map((tactic) => ({
                            label: tactic,
                            value: tactic,
                        }))}
                    />
                </Form.Item>

                {/* Raid Location Category */}
                <Form.Item label="Raid Location Category" name="raidLocationCategory">
                    <Select placeholder="Select a category" allowClear>
                        {ALLOWED_RAID_LOCATION_CATEGORY.map((category) => (
                            <Select.Option key={category} value={category}>
                                {category}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                {/* Detail Location */}
                <Form.Item label="Detail Location" name="detailLocation">
                    <Select placeholder="Select a detail location" allowClear>
                        {ALLOWED_DETAIL_LOCATION.map((detail) => (
                            <Select.Option key={detail} value={detail}>
                                {detail}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                {/* Was Successful */}
                <Form.Item label="Was Successful" name="wasSuccessful">
                    <Select placeholder="Select outcome" allowClear>
                        {ALLOWED_WAS_SUCCESSFUL.map((option) => (
                            <Select.Option key={option} value={option}>
                                {option}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                {/* Location Reference */}
                <Form.Item label="Location Reference" name="locationReference">
                    <Select placeholder="Select reference" allowClear>
                        {ALLOWED_LOCATION_REFERENCE.map((ref) => (
                            <Select.Option key={ref} value={ref}>
                                {ref}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                {/* Source of Info */}
                <Form.Item label="Source of Info" name="sourceOfInfo">
                    <Select placeholder="Select source" allowClear>
                        {ALLOWED_SOURCE_OF_INFO.map((source) => (
                            <Select.Option key={source} value={source}>
                                {source}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                {/* Submit Button */}
                <div className="modal-footer">
                    <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

export default ReportModal;