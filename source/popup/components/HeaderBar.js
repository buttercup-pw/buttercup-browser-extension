import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Button, Icon, Menu, MenuDivider, MenuItem, Popover, Position, Tag } from "@blueprintjs/core";
import styled from "styled-components";
import { version } from "../../../package.json";
import { ArchiveShape, ArchivesShape } from "../../shared/prop-types/archive.js";
import { VAULT_TYPES } from "../../shared/library/icons.js";
import { VaultIcon } from "./VaultIcon";

const Container = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 0.5rem 0.5rem 0.25rem;
`;

const ArchiveMenu = styled(Menu)`
    max-height: 250px;
    overflow: auto;
`;

class HeaderBar extends PureComponent {
    static propTypes = {
        archives: ArchivesShape,
        current: PropTypes.string,
        darkMode: PropTypes.bool,
        onAboutClick: PropTypes.func.isRequired,
        onAddVaultClick: PropTypes.func.isRequired,
        onItemsClick: PropTypes.func.isRequired,
        onLockAllClick: PropTypes.func.isRequired,
        onManageDisabledLoginPromps: PropTypes.func.isRequired,
        onOtherSoftwareClick: PropTypes.func.isRequired,
        onSaveUnsavedClick: PropTypes.func.isRequired,
        onSettingsClick: PropTypes.func.isRequired,
        onToggleDarkMode: PropTypes.func.isRequired,
        onUnlockVaultClick: PropTypes.func.isRequired,
        onVaultsClick: PropTypes.func.isRequired,
        unsavedLogins: PropTypes.number.isRequired
    };

    handleItemsClick(event) {
        event.preventDefault();
        this.props.onItemsClick();
    }

    handleMenuClick(event) {
        event.preventDefault();
        this.props.onMenuClick();
    }

    handleVaultClick(vault) {
        this.props.onUnlockVaultClick(vault.id, vault.state);
    }

    render() {
        const { archives, location, darkMode, t } = this.props;
        const archiveMenu = (
            <ArchiveMenu>
                <If condition={archives.length > 0}>
                    <MenuDivider title={`${t("vaults")}:`} />
                    <For each="vault" of={archives} index="index">
                        <If condition={!!VAULT_TYPES.find(({ type }) => type === vault.type)}>
                            <MenuItem
                                icon={<VaultIcon vault={vault} darkMode={this.props.darkMode} />}
                                label={vault.state === "locked" ? <Icon icon="lock" /> : null}
                                text={vault.name}
                                key={index}
                                onClick={() => this.handleVaultClick(vault)}
                            />
                        </If>
                    </For>
                    <MenuDivider />
                </If>
                <MenuItem text={t("add-vault")} icon="add" onClick={::this.props.onAddVaultClick} />
                <MenuItem text={t("lock-all-vaults")} icon="lock" onClick={::this.props.onLockAllClick} />
                <MenuItem icon="numbered-list" text={t("manage-vaults")} onClick={this.props.onVaultsClick} />
            </ArchiveMenu>
        );
        const optionsMenu = (
            <Menu>
                <MenuItem text={`Buttercup v${version}`} icon="updated" disabled />
                <MenuItem text={t("settings")} icon="cog" onClick={::this.props.onSettingsClick} />
                <MenuItem
                    text={darkMode ? t("popup:settings.light-theme") : t("popup:settings.dark-theme")}
                    icon={darkMode ? "flash" : "moon"}
                    onClick={::this.props.onToggleDarkMode}
                />
                <MenuDivider />
                <MenuItem
                    text={t("popup:headerbar.about-buttercup")}
                    icon="info-sign"
                    onClick={::this.props.onAboutClick}
                />
                <MenuItem
                    text={t("popup:headerbar.other-applications")}
                    icon="mobile-phone"
                    onClick={::this.props.onOtherSoftwareClick}
                />
                <MenuDivider />
                <MenuItem
                    text={t("popup:headerbar.manage-disabled-login-prompts")}
                    icon="exclude-row"
                    onClick={::this.props.onManageDisabledLoginPromps}
                />
                <MenuItem
                    text={t("popup:headerbar.save-stored-logins")}
                    icon="saved"
                    disabled={this.props.unsavedLogins === 0}
                    labelElement={this.props.unsavedLogins > 0 ? <Tag round>{this.props.unsavedLogins}</Tag> : null}
                    onClick={::this.props.onSaveUnsavedClick}
                />
            </Menu>
        );
        return (
            <Container>
                <Choose>
                    <When condition={location.pathname !== "/"}>
                        <Button text={t("back")} icon="arrow-left" onClick={::this.props.onItemsClick} />
                    </When>
                    <When condition={location.pathname === "/" && archives.length === 0}>
                        <Button icon="add" onClick={::this.props.onAddVaultClick} />
                    </When>
                    <Otherwise>
                        <Popover content={archiveMenu} position={Position.BOTTOM_LEFT}>
                            <Button icon="shield" rightIcon="caret-down" text={t("vaults")} />
                        </Popover>
                    </Otherwise>
                </Choose>
                <Popover content={optionsMenu} position={Position.BOTTOM_RIGHT}>
                    <Button icon="cog" minimal />
                </Popover>
            </Container>
        );
    }
}

export default HeaderBar;
