import React from "react";
import { Select } from "antd";
import { useTranslation } from "react-i18next";

const { Option } = Select;

const LanguageSwitcher: React.FC = () => {
    const { t, i18n } = useTranslation();

    const changeLanguage = (lang: string) => {
        i18n.changeLanguage(lang);
    };

    const languageOptions = [
        { value: "en", label: "English (US)" },
        { value: "es", label: "Español" },
        { value: "vi", label: "Vietnamese" },
        { value: "ko", label: "Korean" },
        { value: "zh", label: "Mandarin (中文)" }, // Mandarin with 中文 for native representation
    ];

    return (
        <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "8px" }}>
                {t("SideDrawer.languageSwitcher.label")}
            </label>
            <Select
                defaultValue={i18n.language}
                style={{ width: "100%" }}
                onChange={changeLanguage}
                optionLabelProp="label"
            >
                {languageOptions.map((lang) => (
                    <Option key={lang.value} value={lang.value} label={lang.label}>
                        {lang.label}
                    </Option>
                ))}
            </Select>
        </div>
    );
};

export default LanguageSwitcher;
