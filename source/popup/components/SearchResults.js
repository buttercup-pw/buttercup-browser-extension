import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Button, NonIdealState } from "@blueprintjs/core";
import Entries from "../../shared/components/Entries.js";
import { copyToClipboard } from "../library/messaging.js";

import BUTTERCUP_LOGO from "../../../resources/buttercup-standalone.png";

const Container = styled.div`
    flex: 1;
`;

const EntryShape = PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    url: PropTypes.string
});

class SearchResults extends PureComponent {
    static propTypes = {
        dynamicIconsSetting: PropTypes.string.isRequired,
        entries: PropTypes.arrayOf(EntryShape),
        sourcesTotal: PropTypes.number.isRequired,
        sourcesUnlocked: PropTypes.number.isRequired,
        onAddVault: PropTypes.func.isRequired,
        onSelectEntry: PropTypes.func.isRequired,
        onUnlockAllArchives: PropTypes.func.isRequired
    };

    render() {
        return (
            <Container>
                <Choose>
                    <When condition={this.props.entries.length > 0}>
                        <Entries
                            autoLoginEnabled={true}
                            copyValue={value => copyToClipboard(value)}
                            entries={this.props.entries}
                            icons={this.props.dynamicIconsSetting === "enabled"}
                            onSelectEntry={this.props.onSelectEntry}
                            sourcesUnlocked={this.props.sourcesUnlocked}
                        />
                    </When>
                    <Otherwise>
                        <NonIdealState
                            title={this.props.t("popup:welcome.title")}
                            description={this.props.t("popup:welcome.description")}
                            icon={<img src={BUTTERCUP_LOGO} width="64" />}
                            action={
                                this.props.sourcesUnlocked === 0 ? (
                                    this.props.sourcesTotal === 0 ? (
                                        <Button icon="add" onClick={::this.props.onAddVault}>
                                            {this.props.t("add-vault")}
                                        </Button>
                                    ) : (
                                        <Button icon="unlock" onClick={::this.props.onUnlockAllArchives}>
                                            {this.props.t("unlock-vaults")}
                                        </Button>
                                    )
                                ) : null
                            }
                        />
                    </Otherwise>
                </Choose>
            </Container>
        );
    }
}

export default SearchResults;
