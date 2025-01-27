import React from 'react';
import { Select, Tag } from 'antd';
import { useTranslation } from 'react-i18next';

interface WasSuccessfulSelectorProps {
    options: string[];
    value?: string;
    onChange?: (value: string) => void;
    disabled?: boolean;
}

const WasSuccessfulSelector: React.FC<WasSuccessfulSelectorProps> = ({
    options,
    value,
    onChange,
    disabled,
}) => {
    const { t } = useTranslation();

    if (disabled) {
        // Display mode: Render the selected option as a tag
        const selectedOption = options.find((opt) => opt === value);
        return selectedOption ? <Tag>{selectedOption}</Tag> : null;
    }

    // Edit mode: Render a dropdown
    return (
        <Select
            value={value}
            onChange={onChange}
            placeholder="Select outcome"
            allowClear
            options={options.map((opt) => ({ label: t(`Enums.ALLOWED_WAS_SUCCESSFUL.${opt}`), value: opt }))}
        />
    );
};

export default WasSuccessfulSelector;
