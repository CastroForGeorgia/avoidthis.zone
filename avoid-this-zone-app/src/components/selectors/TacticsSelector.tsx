import React from 'react';
import { Checkbox, Tag } from 'antd';
import { useTranslation } from 'react-i18next';

interface TacticsSelectorProps {
    options: string[];
    value?: string[];
    onChange?: (value: string[]) => void;
    disabled?: boolean;
}

const TacticsSelector: React.FC<TacticsSelectorProps> = ({ options, value, onChange, disabled }) => {
    const { t } = useTranslation();

    if (disabled) {
        // Display mode: Render selected options as tags
        return (
            <>
                {value?.map((selectedKey) => {
                    const translatedOption = t(`Enums.ALLOWED_TACTICS.${selectedKey}`);
                    return (
                        <Tag key={selectedKey}>{translatedOption}</Tag>
                    );
                })}
            </>
        );
    }

    // Edit mode: Render a checkbox group
    return (
        <Checkbox.Group
            options={options.map((tactic) => ({
                label: t(`Enums.ALLOWED_TACTICS.${tactic}`),
                value: tactic
            }))}
            value={value}
            onChange={onChange}
        />
    );
};

export default TacticsSelector;
