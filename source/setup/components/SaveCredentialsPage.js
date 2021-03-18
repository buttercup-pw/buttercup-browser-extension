import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Async as Select } from "react-select";
import styled from "styled-components";
import classNames from "classnames";
import {
    Button,
    Callout,
    Card,
    Classes,
    ControlGroup,
    FormGroup,
    H4,
    InputGroup,
    Intent,
    Spinner
} from "@blueprintjs/core";
import { notifyError } from "../library/notify.js";
import LayoutMain from "./LayoutMain.js";
import { closeCurrentTab } from "../../shared/library/extension.js";

function flattenGroups(groups) {
    const processed = [];
    const nestGroup = (group, level = 0) => {
        processed.push({
            ...group,
            level
        });
        group.groups.sort(titleCompare).forEach(child => nestGroup(child, level + 1));
    };
    groups.sort(titleCompare).forEach(group => nestGroup(group));
    return processed;
}

function titleCompare(a, b) {
    return a.title.localeCompare(b.title);
}

const ButtonRow = styled.div`
    margin-top: 1rem;
    button {
        margin-right: 0.5rem;
    }
`;
const SelectColumns = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 1rem;
`;
const RaisedSelect = styled(Select)`
    z-index: 10;
`;

const ArchiveShape = PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired
});

class SaveCredentialsPage extends PureComponent {
    static propTypes = {
        archives: PropTypes.arrayOf(ArchiveShape).isRequired,
        cancel: PropTypes.func.isRequired,
        fetchGroupsForArchive: PropTypes.func.isRequired,
        fetchLoginDetails: PropTypes.func.isRequired,
        saveNewCredentials: PropTypes.func.isRequired
    };

    state = {
        groupID: "",
        loading: true,
        loginID: null,
        logins: [],
        password: "",
        showPassword: false,
        sourceID: "",
        title: "",
        url: "",
        username: ""
    };

    applyLogin(loginID) {
        const login = this.state.logins.find(item => item.id === loginID);
        const { id, username, password, url, title } = login;
        this.setState({
            loginID: id,
            username,
            password,
            url,
            title,
            loading: false
        });
    }

    componentDidMount() {
        this.props
            .fetchLoginDetails()
            .then(logins => {
                this.setState({
                    logins
                });
                this.applyLogin(logins[0].id);
            })
            .catch(err => {
                console.error(err);
                notifyError(
                    "Failed retrieving credentials",
                    `An error occurred while trying to fetch credentials: ${err.message}`
                );
            });
    }

    fetchArchiveOptions(input) {
        if (this.state.sourceID && this.state.sourceID.length > 0) {
            const sourceItem = this.props.archives.find(archive => archive.id === this.state.sourceID);
            if (!sourceItem) {
                this.setState({
                    groupID: "",
                    sourceID: ""
                });
            }
        }
        return Promise.resolve({
            options: this.props.archives.map(archive => ({
                value: archive.id,
                label: archive.name
            }))
        });
    }

    fetchGroupOptions(input) {
        const nestTitle = (title, level = 0) => {
            let indent = level,
                spacing = "";
            while (indent > 0) {
                spacing += "\u00A0\u00A0\u00A0";
                indent -= 1;
            }
            return level > 0 ? `${spacing}\u21B3 ${title}` : title;
        };
        return this.props
            .fetchGroupsForArchive(this.state.sourceID)
            .then(flattenGroups)
            .then(groups => ({
                options: groups.map(group => ({
                    value: group.id,
                    label: nestTitle(group.title, group.level)
                }))
            }));
    }

    handleArchiveGroupChange(selected) {
        const { value } = selected;
        this.setState({
            groupID: value
        });
    }

    handleArchiveSourceChange(selected) {
        const { value } = selected;
        this.setState({
            groupID: "",
            groups: [],
            sourceID: value
        });
    }

    handleCancelClick(event) {
        event.preventDefault();
        this.props.cancel();
    }

    handleEditProperty(property, event) {
        this.setState({
            [property]: event.target.value
        });
    }

    handleSaveClicked(event) {
        event.preventDefault();
        this.props.saveNewCredentials(
            this.state.sourceID,
            this.state.groupID,
            {
                username: this.state.username,
                password: this.state.password,
                title: this.state.title,
                url: this.state.url
            },
            this.state.loginID
        );
    }

    handleShowPasswordClick(event) {
        event.preventDefault();
        this.setState(state => ({
            ...state,
            showPassword: !state.showPassword
        }));
    }

    render() {
        const selectedArchive = this.state.sourceID && this.state.sourceID.length > 0;
        return (
            <LayoutMain title="Save New Credentials">
                <H4>New Entry Details</H4>
                <Card>
                    <Choose>
                        <When condition={this.state.loading}>
                            <Spinner size="20" />
                        </When>
                        <Otherwise>
                            <FormGroup label="Recorded Login Details">
                                <RaisedSelect
                                    name="loginDetails"
                                    value={this.state.loginID}
                                    onChange={selected => this.applyLogin(selected.value)}
                                    autoload={true}
                                    cache={false}
                                    searchable={false}
                                    clearable={false}
                                    loadOptions={() =>
                                        Promise.resolve({
                                            options: this.state.logins.map(login => ({
                                                label: `${login.username || "?"} @ ${login.title}`,
                                                value: login.id
                                            }))
                                        })
                                    }
                                />
                            </FormGroup>
                            <FormGroup label="Title">
                                <InputGroup
                                    leftIcon="new-text-box"
                                    placeholder="Enter entry title..."
                                    onChange={event => this.handleEditProperty("title", event)}
                                    value={this.state.title}
                                />
                            </FormGroup>
                            <FormGroup label={this.props.t("username")}>
                                <InputGroup
                                    leftIcon="user"
                                    placeholder="Enter username..."
                                    onChange={event => this.handleEditProperty("username", event)}
                                    value={this.state.username}
                                />
                            </FormGroup>
                            <FormGroup label={this.props.t("password")}>
                                <ControlGroup>
                                    <InputGroup
                                        className={Classes.FILL}
                                        leftIcon="key"
                                        placeholder="Enter password..."
                                        onChange={event => this.handleEditProperty("password", event)}
                                        value={this.state.password}
                                        type={this.state.showPassword ? "text" : "password"}
                                    />
                                    <Button
                                        active={this.state.showPassword}
                                        icon={this.state.showPassword ? "eye-open" : "eye-off"}
                                        onClick={::this.handleShowPasswordClick}
                                    />
                                </ControlGroup>
                            </FormGroup>
                            <FormGroup label="URL">
                                <InputGroup
                                    leftIcon="globe"
                                    placeholder="Enter URL..."
                                    onChange={event => this.handleEditProperty("url", event)}
                                    value={this.state.url}
                                />
                            </FormGroup>
                            <FormGroup label="Archive and Group">
                                <SelectColumns>
                                    <Select
                                        name="sourceID"
                                        value={this.state.sourceID}
                                        onChange={::this.handleArchiveSourceChange}
                                        autoload={true}
                                        cache={false}
                                        searchable={false}
                                        placeholder="Select archive..."
                                        loadingPlaceholder="Fetching archives..."
                                        loadOptions={::this.fetchArchiveOptions}
                                    />
                                    <If condition={selectedArchive}>
                                        <Select
                                            name="groupID"
                                            value={this.state.groupID}
                                            onChange={::this.handleArchiveGroupChange}
                                            autoload={true}
                                            cache={false}
                                            searchable={false}
                                            placeholder="Select group..."
                                            loadingPlaceholder="Fetching groups..."
                                            loadOptions={::this.fetchGroupOptions}
                                        />
                                    </If>
                                </SelectColumns>
                            </FormGroup>
                            <If condition={this.props.archives.length <= 0}>
                                <Callout intent={Intent.WARNING}>
                                    No <strong>unlocked</strong> archives were found. You must unlock at least one
                                    archive to be able to save new credentials.
                                </Callout>
                            </If>
                            <ButtonRow>
                                <Button
                                    icon="floppy-disk"
                                    text="Save New Entry"
                                    onClick={::this.handleSaveClicked}
                                    intent={Intent.PRIMARY}
                                />
                                <Button text={this.props.t("cancel")} onClick={::this.handleCancelClick} />
                            </ButtonRow>
                        </Otherwise>
                    </Choose>
                </Card>
            </LayoutMain>
        );
    }
}

export default SaveCredentialsPage;
