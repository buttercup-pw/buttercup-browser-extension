import React, { PureComponent, Fragment } from "react";
import PropTypes from "prop-types";
import { FormGroup, Switch, HTMLSelect } from "@blueprintjs/core";
import ms from "ms";

import localesConfig from "../../../locales/config.json";

const languageOptions = Object.keys(localesConfig.languages).reduce(
    (before, value) => [
        ...before,
        {
            value,
            label: localesConfig.languages[value].name
        }
    ],
    []
);

export default class SettingsPage extends PureComponent {
    static propTypes = {
        config: PropTypes.object,
        onUpdateConfigValue: PropTypes.func.isRequired
    };

    handleConfigChange(event, configKey) {
        const { target } = event;

        const { onUpdateConfigValue } = this.props;
        if (target.type === "checkbox") {
            onUpdateConfigValue(configKey, target.checked ? true : false);
        } else {
            onUpdateConfigValue(configKey, target.value);
        }
    }

    render() {
        const { config, t } = this.props;
        return (
            <Fragment key={JSON.stringify(config)}>
                <FormGroup label={t("popup:settings.dark-theme")}>
                    <Switch
                        label={config.darkMode ? t("enabled") : t("disabled")}
                        checked={config.darkMode}
                        onChange={event => this.handleConfigChange(event, "darkMode")}
                    />
                </FormGroup>
                <FormGroup
                    label={t("popup:settings.vaults-auto-unlock.self")}
                    helperText={t("popup:settings.vaults-auto-unlock.helper-text")}
                >
                    <Switch
                        label={config.autoUnlockVaults ? t("enabled") : t("disabled")}
                        checked={config.autoUnlockVaults}
                        onChange={event => this.handleConfigChange(event, "autoUnlockVaults")}
                    />
                </FormGroup>
                <FormGroup
                    label={t("popup:settings.vaults-auto-lock.self")}
                    helperText={t("popup:settings.vaults-auto-lock.helper-text")}
                >
                    <HTMLSelect
                        key={config.autoLockVaults}
                        fill
                        value={config.autoLockVaults}
                        options={[
                            { label: t("minute", { count: 5 }), value: ms("5m") },
                            { label: t("minute", { count: 10 }), value: ms("10m") },
                            { label: t("minute", { count: 15 }), value: ms("15m") },
                            { label: t("minute", { count: 30 }), value: ms("30m") },
                            { label: t("hour", { count: 1 }), value: ms("1h") },
                            { label: t("hour", { count: 2 }), value: ms("2h") },
                            { label: t("hour", { count: 3 }), value: ms("3h") },
                            { label: t("hour", { count: 12 }), value: ms("12h") },
                            { label: t("day", { count: 1 }), value: ms("1d") },
                            { label: t("day", { count: 2 }), value: ms("2d") },
                            { label: t("week", { count: 1 }), value: ms("1w") },
                            { label: t("off"), value: "off" }
                        ]}
                        onChange={event => this.handleConfigChange(event, "autoLockVaults")}
                    />
                </FormGroup>
                <FormGroup
                    label={t("popup:settings.show-save-dialog.self")}
                    helperText={t("popup:settings.show-save-dialog.helper-text")}
                >
                    <HTMLSelect
                        fill
                        value={config.showSaveDialog}
                        options={[
                            { label: t("popup:settings.show-save-dialog.options.always"), value: "always" },
                            { label: t("popup:settings.show-save-dialog.options.unlocked"), value: "unlocked" },
                            { label: t("popup:settings.show-save-dialog.options.never"), value: "never" }
                        ]}
                        onChange={event => this.handleConfigChange(event, "showSaveDialog")}
                    />
                </FormGroup>
                <FormGroup label={t("language")}>
                    <HTMLSelect
                        fill
                        value={config.language}
                        options={languageOptions}
                        onChange={event => this.handleConfigChange(event, "language")}
                    />
                </FormGroup>
                <FormGroup
                    label={t("popup:settings.dynamic-entry-icons.self")}
                    helperText={t("popup:settings.dynamic-entry-icons.helper-text")}
                >
                    <HTMLSelect
                        fill
                        value={config.dynamicIcons}
                        options={[
                            { label: t("popup:settings.dynamic-entry-icons.options.enabled"), value: "enabled" },
                            { label: t("popup:settings.dynamic-entry-icons.options.disabled"), value: "disabled" }
                        ]}
                        onChange={event => this.handleConfigChange(event, "dynamicIcons")}
                    />
                </FormGroup>
            </Fragment>
        );
    }
}
