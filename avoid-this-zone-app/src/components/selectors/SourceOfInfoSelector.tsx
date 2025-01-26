import React from 'react';
import { Select, Tag } from 'antd';

interface SourceOfInfoSelectorProps {
    options: { key: string; label: string }[];
    value?: string;
    onChange?: (value: string) => void;
    disabled?: boolean;
}

const SourceOfInfoSelector: React.FC<SourceOfInfoSelectorProps> = ({
    options,
    value,
    onChange,
    disabled,
}) => {
    if (disabled) {
        // Display mode: Render the selected option as a tag
        const selectedOption = options.find((opt) => opt.key === value);
        return selectedOption ? <Tag>{selectedOption.label}</Tag> : null;
    }

    // Edit mode: Render a dropdown
    return (
        <Select
            value={value}
            onChange={onChange}
            placeholder="Select source of information"
            allowClear
            options={options.map((opt) => ({ label: opt.label, value: opt.key }))}
        />
    );
};

export default SourceOfInfoSelector;
