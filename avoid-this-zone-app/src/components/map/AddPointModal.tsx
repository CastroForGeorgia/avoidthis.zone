import React, { useState } from 'react';
import { Modal, Button, InputNumber } from 'antd';
import { useFeatureStore } from '../store/FeatureStore';

/**
 * A tiny example modal letting the user specify coordinates
 * and create a new point in the store.
 */
export const AddPointModal: React.FC = () => {
    const { addFeature } = useFeatureStore();
    const [open, setOpen] = useState(false);

    // We'll store the user’s input for X and Y in state
    const [coordX, setCoordX] = useState(0);
    const [coordY, setCoordY] = useState(0);

    const handleOk = () => {
        addFeature([coordX, coordY]);
        setOpen(false);
    };

    return (
        <>
            <Button type="primary" onClick={() => setOpen(true)}>
                Add Point
            </Button>
            <Modal
                title="Create a New Point Feature"
                visible={open}
                onOk={handleOk}
                onCancel={() => setOpen(false)}
            >
                <p>Enter coordinate (EPSG:3857, for example):</p>
                <div>
                    X: <InputNumber value={coordX} onChange={(val) => setCoordX(val || 0)} />
                    &nbsp;
                    Y: <InputNumber value={coordY} onChange={(val) => setCoordY(val || 0)} />
                </div>
            </Modal>
        </>
    );
};