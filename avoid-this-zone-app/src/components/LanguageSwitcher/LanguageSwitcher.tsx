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
        { value: "en", label: "English (United States)" },
        { value: "es", label: "Español (Spanish)" },
        { value: "vi", label: "Tiếng Việt (Vietnamese)" },
        { value: "ko", label: "한국어 (Korean)" },
        { value: "zh", label: "中文 (Simplified Chinese)" }
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
