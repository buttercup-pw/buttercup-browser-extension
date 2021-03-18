import React, { PureComponent, Fragment } from "react";
import PropTypes from "prop-types";
import { Button, Intent, Classes, FormGroup, InputGroup, Toaster, Position } from "@blueprintjs/core";
import Dialog from "./Dialog.js";
import { closeCurrentTab } from "../../shared/library/extension.js";
import VaultEditor from "../containers/VaultEditor.js";

const CLEAR_PASSWORD_CHANGE = {
    oldMasterPassword: "",
    newMasterPassword: "",
    newMasterPassword2: ""
};

class VaultPage extends PureComponent {
    static propTypes = {
        attachments: PropTypes.bool.isRequired,
        archiveTitle: PropTypes.string.isRequired,
        archiveType: PropTypes.string,
        changePassword: PropTypes.func.isRequired,
        isEditing: PropTypes.bool.isRequired,
        onLockArchive: PropTypes.func.isRequired,
        onRemoveArchive: PropTypes.func.isRequired,
        onUnlockArchive: PropTypes.func.isRequired,
        sourceID: PropTypes.string.isRequired,
        state: PropTypes.oneOf(["locked", "unlocked"]).isRequired
    };

    state = {
        changingMasterPassword: false,
        masterPassword: "",
        passwordToken: "",
        oldMasterPassword: "",
        newMasterPassword: "",
        newMasterPassword2: ""
    };

    get passwordChangeValid() {
        return (
            this.state.oldMasterPassword &&
            this.state.newMasterPassword &&
            this.state.newMasterPassword === this.state.newMasterPassword2
        );
    }

    componentDidMount() {
        if (this._passwordInput) {
            this._passwordInput.focus();
        }
    }

    handleCancelUnlock(event) {
        event.preventDefault();
        closeCurrentTab();
    }

    handleLockArchive(event) {
        event.preventDefault();
        this.props.onLockArchive(this.props.sourceID);
    }

    handlePasswordChange(event) {
        event.preventDefault();
        this.setState({
            changingMasterPassword: true,
            ...CLEAR_PASSWORD_CHANGE
        });
    }

    handlePasswordChangeSubmit(event) {
        event.preventDefault();
        this.props.changePassword(
            this.props.sourceID,
            this.state.oldMasterPassword,
            this.state.newMasterPassword,
            {
                passwordToken: this.state.passwordToken
            },
            () => {
                this.setState({
                    changingMasterPassword: false,
                    ...CLEAR_PASSWORD_CHANGE
                });
            }
        );
    }

    handleRemoveArchive(event) {
        event.preventDefault();
        this.props.onRemoveArchive(this.props.sourceID);
    }

    handleUnlockArchive(event) {
        event.preventDefault();
        this.props.onUnlockArchive(this.props.sourceID, this.state.masterPassword);
    }

    handleUpdateForm(property, event) {
        this.setState({
            [property]: event.target.value
        });
    }

    render() {
        const disableForm = this.props.isEditing;
        let title, action;
        switch (this.props.state) {
            case "locked":
                title = this.props.t("unlock-vault");
                action = "Unlock";
                break;
            case "unlocked":
                title = this.props.t("managing-vault");
                action = "Manage";
                break;
            default:
                throw new Error(`Unknown vault state: ${this.props.state}`);
        }
        const actions = (
            <Fragment>
                <Button
                    className="ml-0"
                    intent={Intent.DANGER}
                    icon="trash"
                    onClick={::this.handleRemoveArchive}
                    disabled={disableForm}
                >
                    {this.props.t("remove-vault")}
                </Button>
                <Button className="ml-auto" onClick={::this.handleCancelUnlock} disabled={disableForm}>
                    {this.props.t("cancel")}
                </Button>
                <Choose>
                    <When condition={this.props.state === "locked"}>
                        <Button onClick={::this.handleUnlockArchive} disabled={disableForm}>
                            {this.props.t("unlock")}
                        </Button>
                    </When>
                    <Otherwise>
                        <Button icon="text-highlight" onClick={::this.handlePasswordChange} disabled={disableForm}>
                            {this.props.t("change-password")}
                        </Button>
                        <Button icon="lock" onClick={::this.handleLockArchive} disabled={disableForm}>
                            {this.props.t("lock")}
                        </Button>
                    </Otherwise>
                </Choose>
            </Fragment>
        );
        return (
            <Fragment>
                <Dialog
                    maximise={this.props.state === "unlocked"}
                    title={`${title}: ${this.props.archiveTitle}`}
                    actions={actions}
                >
                    <If condition={this.props.state === "unlocked"}>
                        <VaultEditor attachments={this.props.attachments} sourceID={this.props.sourceID} />
                    </If>
                    <If condition={this.props.state === "locked"}>
                        <form onSubmit={::this.handleUnlockArchive}>
                            <FormGroup
                                disabled={disableForm}
                                label={this.props.t("master-password")}
                                labelFor="master-password"
                            >
                                <InputGroup
                                    id="master-password"
                                    type="password"
                                    placeholder={this.props.t("setup:placeholder.vault-password")}
                                    disabled={disableForm}
                                    large
                                    onChange={event => this.handleUpdateForm("masterPassword", event)}
                                    inputRef={input => {
                                        this._passwordInput = input;
                                    }}
                                />
                            </FormGroup>
                        </form>
                    </If>
                </Dialog>
                <If condition={this.state.changingMasterPassword}>
                    <Dialog
                        title={`${this.props.t("change-password")}: ${this.props.archiveTitle}`}
                        actions={
                            <Fragment>
                                <Button
                                    onClick={() =>
                                        this.setState({ changingMasterPassword: false, ...CLEAR_PASSWORD_CHANGE })
                                    }
                                    disabled={disableForm}
                                >
                                    {this.props.t("cancel")}
                                </Button>
                                <Button
                                    intent={Intent.DANGER}
                                    icon="confirm"
                                    onClick={::this.handlePasswordChangeSubmit}
                                    disabled={disableForm || !this.passwordChangeValid}
                                >
                                    {this.props.t("change-password")}
                                </Button>
                            </Fragment>
                        }
                        zIndex={2}
                    >
                        <form onSubmit={::this.handlePasswordChangeSubmit}>
                            <FormGroup
                                disabled={disableForm}
                                label={this.props.t("setup:current-password")}
                                labelFor="old-master-password"
                            >
                                <InputGroup
                                    id="old-master-password"
                                    type="password"
                                    placeholder={this.props.t("setup:placeholder.vault-current-password")}
                                    disabled={disableForm}
                                    large
                                    onChange={event => this.handleUpdateForm("oldMasterPassword", event)}
                                />
                            </FormGroup>
                            <If condition={this.props.archiveType === "mybuttercup"}>
                                <FormGroup
                                    disabled={disableForm}
                                    label={this.props.t("setup:password-token")}
                                    labelFor="password-token"
                                >
                                    <InputGroup
                                        id="password-token"
                                        type="text"
                                        placeholder={this.props.t("setup:placeholder.vault-reset-token")}
                                        disabled={disableForm}
                                        large
                                        onChange={event => this.handleUpdateForm("passwordToken", event)}
                                    />
                                </FormGroup>
                            </If>
                            <FormGroup
                                disabled={disableForm}
                                label={this.props.t("setup:new-master-password")}
                                labelFor="new-master-password"
                            >
                                <InputGroup
                                    id="new-master-password"
                                    type="password"
                                    placeholder={this.props.t("setup:placeholder.vault-new-password")}
                                    disabled={disableForm}
                                    large
                                    onChange={event => this.handleUpdateForm("newMasterPassword", event)}
                                />
                            </FormGroup>
                            <FormGroup
                                disabled={disableForm}
                                label={this.props.t("setup:new-master-password-2")}
                                labelFor="new-master-password-2"
                            >
                                <InputGroup
                                    id="new-master-password-2"
                                    type="password"
                                    placeholder={this.props.t("setup:placeholder.vault-new-password-again")}
                                    disabled={disableForm}
                                    large
                                    onChange={event => this.handleUpdateForm("newMasterPassword2", event)}
                                />
                            </FormGroup>
                        </form>
                    </Dialog>
                </If>
            </Fragment>
        );
    }
}

export default VaultPage;
