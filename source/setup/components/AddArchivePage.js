import React, { PureComponent, Fragment } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Button, Callout, Card, Checkbox, H3, H4, FormGroup, InputGroup, Intent } from "@blueprintjs/core";
import uuid from "uuid/v4";
import { Input as ButtercupInput, Button as ButtercupButton } from "@buttercup/ui";
import { switchValue } from "../../shared/library/switch.js";
import LayoutMain from "./LayoutMain.js";
import ArchiveTypeChooser from "../containers/ArchiveTypeChooser.js";
import { VAULT_TYPES } from "../../shared/library/icons.js";
import RemoteExplorer from "../containers/RemoteExplorer.js";

const ENTER_KEY = 13;

const CalloutWithSpacing = styled(Callout)`
    margin-bottom: 10px;
`;
const Spacer = styled.div`
    width: 100%;
    height: 2rem;
`;
const SplitView = styled.div`
    display: grid;
    grid-template-columns: repeat(2, calc(50% - 0.5rem));
    grid-gap: 1rem;
`;
const RemoteExplorerCard = styled(Card)`
    max-height: 640px;
    overflow: auto;
`;

class AddArchivePage extends PureComponent {
    static propTypes = {
        dropboxAuthID: PropTypes.string,
        dropboxAuthToken: PropTypes.string,
        googleDriveAccessToken: PropTypes.string,
        googleDriveAuthID: PropTypes.string,
        isConnected: PropTypes.bool.isRequired,
        isConnecting: PropTypes.bool.isRequired,
        localAuthStatus: PropTypes.string.isRequired,
        myButtercupAccessToken: PropTypes.string,
        myButtercupRefreshToken: PropTypes.string,
        onAuthenticateDesktop: PropTypes.func.isRequired,
        onAuthenticateDropbox: PropTypes.func.isRequired,
        onAuthenticateMyButtercup: PropTypes.func.isRequired,
        onChooseDropboxBasedArchive: PropTypes.func.isRequired,
        onChooseGoogleDriveBasedArchive: PropTypes.func.isRequired,
        onChooseLocallyBasedArchive: PropTypes.func.isRequired,
        onChooseMyButtercupArchive: PropTypes.func.isRequired,
        onChooseWebDAVBasedArchive: PropTypes.func.isRequired,
        onConnectDesktop: PropTypes.func.isRequired,
        onConnectWebDAVBasedSource: PropTypes.func.isRequired,
        onCreateRemotePath: PropTypes.func.isRequired,
        onReady: PropTypes.func.isRequired,
        onSelectRemotePath: PropTypes.func.isRequired,
        selectedArchiveType: PropTypes.string,
        selectedFilename: PropTypes.string,
        selectedFilenameNeedsCreation: PropTypes.bool.isRequired
    };

    // We store some details in the state, because they're sensitive. No point
    // storing them globally..
    state = {
        archiveName: "",
        dropboxAuthenticationID: "",
        googleDriveAuthenticationID: "",
        googleDriveOpenPermissions: false,
        localCode: "",
        masterPassword: "",
        myButtercupAuthenticationID: "",
        remoteURL: "",
        remoteUsername: "",
        remotePassword: ""
    };

    componentDidMount() {
        this.setState({
            dropboxAuthenticationID: uuid(),
            googleDriveAuthenticationID: uuid(),
            myButtercupAuthenticationID: uuid()
        });
        this.props.onReady();
    }

    handleLocalAuth(event) {
        event.preventDefault();
        this.setState({ localCode: "" });
        this.props.onConnectDesktop();
    }

    handleDropboxAuth(event) {
        event.preventDefault();
        this.props.onAuthenticateDropbox(this.state.dropboxAuthenticationID);
    }

    handleGoogleDriveAuth(event) {
        event.preventDefault();
        this.props.onAuthenticateGoogleDrive(
            this.state.googleDriveAuthenticationID,
            this.state.googleDriveOpenPermissions
        );
    }

    handleChooseDropboxBasedFile(event) {
        event.preventDefault();
        this.props.onChooseDropboxBasedArchive(this.state.archiveName, this.state.masterPassword);
    }

    handleChooseGoogleDriveBasedFile(event) {
        event.preventDefault();
        this.props.onChooseGoogleDriveBasedArchive(this.state.archiveName, this.state.masterPassword);
    }

    handleChooseLocalBasedFile(event) {
        event.preventDefault();
        this.props.onChooseLocallyBasedArchive(this.state.archiveName, this.state.masterPassword);
    }

    handleChooseMyButtercupBasedFile(event) {
        event.preventDefault();
        this.props.onChooseMyButtercupArchive(this.state.masterPassword);
    }

    handleChooseWebDAVBasedFile(event) {
        event.preventDefault();
        this.props.onChooseWebDAVBasedArchive(
            this.props.selectedArchiveType,
            this.state.archiveName,
            this.state.masterPassword,
            this.state.remoteURL,
            this.state.remoteUsername,
            this.state.remotePassword
        );
    }

    handleConnectLocal(event) {
        event.preventDefault();
        this.props.onAuthenticateDesktop(this.state.localCode);
    }

    handleConnectWebDAV(event) {
        event.preventDefault();
        this.props.onConnectWebDAVBasedSource(
            this.props.selectedArchiveType,
            this.state.remoteURL,
            this.state.remoteUsername,
            this.state.remotePassword
        );
    }

    handleMyButtercupAuth(event) {
        event.preventDefault();
        this.props.onAuthenticateMyButtercup(this.state.myButtercupAuthenticationID);
        this.props.onSelectRemotePath("-");
    }

    handleUpdateForm(property, event) {
        this.setState({
            [property]: event.target.value
        });
    }

    render() {
        const { t } = this.props;
        const isTargetingWebDAV = ["webdav", "owncloud", "nextcloud"].includes(this.props.selectedArchiveType);
        const isTargetingDropbox = this.props.selectedArchiveType === "dropbox";
        const isTargetingGoogleDrive = this.props.selectedArchiveType === "googledrive";
        const isTargetingLocal = this.props.selectedArchiveType === "localfile";
        const isTargetingMyButtercup = this.props.selectedArchiveType === "mybuttercup";
        const hasAuthenticatedDropbox = typeof this.props.dropboxAuthToken === "string";
        const hasAuthenticatedGoogleDrive = typeof this.props.googleDriveAccessToken === "string";
        const hasAuthenticatedMyButtercup =
            this.props.myButtercupAuthID === this.state.myButtercupAuthenticationID &&
            !!this.props.myButtercupAccessToken;
        const hasAuthenticated =
            (isTargetingWebDAV && this.props.isConnected) ||
            (isTargetingDropbox && hasAuthenticatedDropbox) ||
            (isTargetingMyButtercup && hasAuthenticatedMyButtercup) ||
            (isTargetingGoogleDrive && hasAuthenticatedGoogleDrive) ||
            (isTargetingLocal && this.props.localAuthStatus === "authenticated");
        const fetchTypeSwitch = switchValue([
            [/webdav|owncloud|nextcloud/, "webdav"],
            ["dropbox", "dropbox"],
            ["googledrive", "googledrive"],
            ["mybuttercup", "mybuttercup"],
            ["localfile", "localfile"]
        ]);
        const fetchType = fetchTypeSwitch(this.props.selectedArchiveType);
        return (
            <LayoutMain title={t("add-vault")}>
                <H4>{t("setup:choose-vault-type")}</H4>
                <ArchiveTypeChooser disabled={hasAuthenticated} />
                <Spacer />
                <If condition={this.props.selectedArchiveType}>
                    <Choose>
                        <When condition={hasAuthenticated}>
                            <H4>{t("setup:choose-or-create-vault")}</H4>
                            <SplitView>
                                <Choose>
                                    <When condition={this.props.selectedArchiveType === "mybuttercup"}>
                                        <Card>
                                            <H4>Your Buttercup Account</H4>
                                            <p>
                                                Your vault is ready to be connected! The last step is to enter your
                                                master password, which is used for local encryption/decryption of your
                                                vault.
                                            </p>
                                        </Card>
                                    </When>
                                    <Otherwise>
                                        <RemoteExplorerCard>
                                            <RemoteExplorer
                                                onCreateRemotePath={path => this.props.onCreateRemotePath(path)}
                                                onSelectRemotePath={path => this.props.onSelectRemotePath(path)}
                                                selectedFilename={this.props.selectedFilename}
                                                selectedFilenameNeedsCreation={this.props.selectedFilenameNeedsCreation}
                                                fetchType={fetchType}
                                            />
                                        </RemoteExplorerCard>
                                    </Otherwise>
                                </Choose>
                                <Card>{this.renderArchiveNameInput()}</Card>
                            </SplitView>
                        </When>
                        <Otherwise>{this.renderConnectionInfo()}</Otherwise>
                    </Choose>
                </If>
            </LayoutMain>
        );
    }

    renderArchiveNameInput() {
        const { selectedFilename, t } = this.props;
        const disabled = !selectedFilename;
        const onClickTypeSwitch = switchValue([
            [/webdav|owncloud|nextcloud/, ::this.handleChooseWebDAVBasedFile],
            ["dropbox", ::this.handleChooseDropboxBasedFile],
            ["googledrive", ::this.handleChooseGoogleDriveBasedFile],
            ["mybuttercup", ::this.handleChooseMyButtercupBasedFile],
            ["localfile", ::this.handleChooseLocalBasedFile]
        ]);
        const handleSubmit = onClickTypeSwitch(this.props.selectedArchiveType);
        return (
            <Fragment>
                <If condition={this.props.selectedArchiveType !== "mybuttercup"}>
                    <FormGroup full label={t("setup:name")} labelInfo="(required)" disabled={disabled}>
                        <InputGroup
                            leftIcon="tag"
                            disabled={disabled}
                            placeholder={t("setup:vault-password-name")}
                            onChange={event => this.handleUpdateForm("archiveName", event)}
                            onKeyPress={event => (event.key === "Enter" ? handleSubmit(event) : true)}
                            value={this.state.archiveName}
                        />
                    </FormGroup>
                </If>
                <FormGroup full label={t("master-password")} labelInfo="(required)" disabled={disabled}>
                    <InputGroup
                        leftIcon="lock"
                        disabled={disabled}
                        placeholder={t("setup:placeholder.vault-password")}
                        type="password"
                        onChange={event => this.handleUpdateForm("masterPassword", event)}
                        onKeyPress={event => (event.key === "Enter" ? handleSubmit(event) : true)}
                        value={this.state.masterPassword}
                    />
                </FormGroup>
                <Button fill disabled={disabled} onClick={handleSubmit}>
                    {t("save-vault")}
                </Button>
            </Fragment>
        );
    }

    renderConnectionInfo() {
        const connectionOptionsDisabled = this.props.isConnecting || this.props.isConnected;
        const sectionTitle =
            this.props.selectedArchiveType === "dropbox" ? "Authenticate Cloud Source" : "Enter Connection Details";
        const isAuthenticatingDropbox = this.props.dropboxAuthID === this.state.dropboxAuthenticationID;
        const hasAuthenticatedDropbox = isAuthenticatingDropbox && this.props.dropboxAuthToken;
        const isAuthenticatingGoogleDrive = this.props.googleDriveAuthID === this.state.googleDriveAuthenticationID;
        const hasAuthenticatedGoogleDrive = isAuthenticatingGoogleDrive && this.props.googleDriveAccessToken;
        const isAuthenticatingMyButtercup = this.props.myButtercupAuthID === this.state.myButtercupAuthenticationID;
        const hasAuthenticatedMyButtercup = isAuthenticatingMyButtercup && this.props.myButtercupAccessToken;
        const isAuthenticatingDesktop = this.props.localAuthStatus === "authenticating";
        const hasAuthenticatedDesktop = this.props.localAuthStatus === "authenticated";
        const isWebDAV = ["webdav", "owncloud", "nextcloud"].includes(this.props.selectedArchiveType);
        const title = VAULT_TYPES.find(archiveType => archiveType.type === this.props.selectedArchiveType).title;
        return (
            <Fragment>
                <H4>{sectionTitle}</H4>
                <Choose>
                    <When condition={isWebDAV}>
                        <Card>
                            <FormGroup full label={`${title} URL`} labelInfo="(required)">
                                <InputGroup
                                    leftIcon="globe"
                                    placeholder="Enter remote URL..."
                                    disabled={connectionOptionsDisabled}
                                    onChange={event => this.handleUpdateForm("remoteURL", event)}
                                    value={this.state.remoteURL}
                                    onKeyDown={evt => evt.keyCode === ENTER_KEY && this.handleConnectWebDAV(evt)}
                                />
                            </FormGroup>
                            <FormGroup full label={`${title} Username`} labelInfo="(required)">
                                <InputGroup
                                    leftIcon="user"
                                    placeholder={`Enter ${title} username...`}
                                    disabled={connectionOptionsDisabled}
                                    onChange={event => this.handleUpdateForm("remoteUsername", event)}
                                    value={this.state.remoteUsername}
                                    onKeyDown={evt => evt.keyCode === ENTER_KEY && this.handleConnectWebDAV(evt)}
                                />
                            </FormGroup>
                            <FormGroup full label={`${title} Password`} labelInfo="(required)">
                                <InputGroup
                                    leftIcon="key"
                                    placeholder={`Enter ${title} password...`}
                                    type="password"
                                    disabled={connectionOptionsDisabled}
                                    onChange={event => this.handleUpdateForm("remotePassword", event)}
                                    value={this.state.remotePassword}
                                    onKeyDown={evt => evt.keyCode === ENTER_KEY && this.handleConnectWebDAV(evt)}
                                />
                            </FormGroup>
                            <Button
                                intent={Intent.SUCCESS}
                                onClick={::this.handleConnectWebDAV}
                                loading={this.props.isConnecting}
                                disabled={this.props.isConnected}
                            >
                                Connect
                            </Button>
                        </Card>
                    </When>
                    <When condition={this.props.selectedArchiveType === "dropbox"}>
                        <Card>
                            <H4>Dropbox</H4>
                            <p>
                                To start, please grant Buttercup access to your Dropbox account. This access will be
                                only used to store and read a Buttercup Vault that you choose or create.
                            </p>
                            <Button
                                icon="key"
                                onClick={::this.handleDropboxAuth}
                                disabled={hasAuthenticatedDropbox}
                                loading={isAuthenticatingDropbox && !hasAuthenticatedDropbox}
                            >
                                Grant Dropbox Access
                            </Button>
                        </Card>
                    </When>
                    <When condition={this.props.selectedArchiveType === "googledrive"}>
                        <Card>
                            <H4>Google Drive</H4>
                            <p>
                                To start, please grant Buttercup access to your Google Drive account. This access will
                                be only used to store and read a Buttercup Vault that you choose or create.
                            </p>
                            <CalloutWithSpacing intent={Intent.PRIMARY}>
                                <p>
                                    Buttercup, by default, will use permissions that only allow connecting to new vaults
                                    or existing vaults that were created or accessed by Buttercup previously.
                                </p>
                                <p>
                                    If you wish to connect to an existing vault that was{" "}
                                    <strong>uploaded manually</strong>, you'll need to grant additional permissions to
                                    connect it.
                                </p>
                                <Checkbox
                                    checked={this.state.googleDriveOpenPermissions}
                                    label="Grant access to all Google Drive contents"
                                    onChange={evt =>
                                        this.setState({ googleDriveOpenPermissions: !!evt.target.checked })
                                    }
                                />
                            </CalloutWithSpacing>
                            <Button
                                icon="key"
                                onClick={::this.handleGoogleDriveAuth}
                                disabled={hasAuthenticatedGoogleDrive}
                                loading={isAuthenticatingGoogleDrive && !hasAuthenticatedGoogleDrive}
                            >
                                Grant Google Drive Access
                            </Button>
                        </Card>
                    </When>
                    <When condition={this.props.selectedArchiveType === "mybuttercup"}>
                        <Card>
                            <H4>My Buttercup</H4>
                            <p>To start, please grant Buttercup access to your My Buttercup account.</p>
                            <Button
                                icon="key"
                                onClick={::this.handleMyButtercupAuth}
                                disabled={hasAuthenticatedMyButtercup}
                                loading={isAuthenticatingMyButtercup && !hasAuthenticatedMyButtercup}
                            >
                                Grant Access
                            </Button>
                        </Card>
                    </When>
                    <When condition={this.props.selectedArchiveType === "localfile"}>
                        <Card>
                            <H4>Local File</H4>
                            <FormGroup>
                                <p>
                                    To connect a local vault on your computer you must first gain access by connecting
                                    to the{" "}
                                    <a href="https://buttercup.pw/" target="_blank">
                                        Buttercup Desktop Application
                                    </a>
                                    . Make sure that it's running and that that Browser access is enabled via the
                                    menu:&nbsp;
                                    <strong>System &#10093; Enable Browser Access</strong>.
                                </p>
                                <Button
                                    icon="desktop"
                                    onClick={::this.handleLocalAuth}
                                    disabled={this.props.isConnected}
                                    loading={this.props.isConnecting && !this.isConnected}
                                >
                                    Connect to Desktop
                                </Button>
                            </FormGroup>
                            <FormGroup full label="Authorization Code" labelInfo="(required)">
                                <InputGroup
                                    leftIcon="asterisk"
                                    placeholder="Enter Authorization Code..."
                                    disabled={hasAuthenticatedDesktop || !this.props.isConnected}
                                    loading={isAuthenticatingDesktop && !hasAuthenticatedDesktop}
                                    onChange={event => this.setState({ localCode: event.target.value.toUpperCase() })}
                                    onKeyPress={e => (e.key === "Enter" ? this.handleConnectLocal(e) : true)}
                                    value={this.state.localCode}
                                />
                            </FormGroup>
                            <Button
                                intent={Intent.SUCCESS}
                                onClick={::this.handleConnectLocal}
                                loading={isAuthenticatingDesktop}
                                disabled={!this.props.isConnected || !this.state.localCode || hasAuthenticatedDesktop}
                            >
                                Continue
                            </Button>
                        </Card>
                    </When>
                    <Otherwise>
                        <i>Unsupported vault type.</i>
                    </Otherwise>
                </Choose>
            </Fragment>
        );
    }
}

export default AddArchivePage;
