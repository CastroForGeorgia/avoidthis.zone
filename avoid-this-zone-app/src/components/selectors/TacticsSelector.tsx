import React from 'react';
import { Checkbox, Tag } from 'antd';

interface TacticsSelectorProps {
    options: { key: string; label: string }[];
    value?: string[];
    onChange?: (value: string[]) => void;
    disabled?: boolean;
}

const TacticsSelector: React.FC<TacticsSelectorProps> = ({ options, value, onChange, disabled }) => {
    if (disabled) {
        // Display mode: Render selected options as tags
        return (
            <>
                {value?.map((selectedKey) => {
                    const option = options.find((opt) => opt.key === selectedKey);
                    return option ? (
                        <Tag key={option.key}>{option.label}</Tag>
                    ) : null;
                })}
            </>
        );
    }

    // Edit mode: Render a checkbox group
    return (
        <Checkbox.Group
            options={options.map((opt) => ({ label: opt.label, value: opt.key }))}
            value={value}
            onChange={onChange}
        />
    );
};

export default TacticsSelector;
