import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Button, NonIdealState } from "@blueprintjs/core";
import styled from "styled-components";
import SearchBar from "../containers/SearchBar.js";
import SearchResults from "../containers/SearchResults.js";
import DialogFrame from "./DialogFrame.js";

import BUTTERCUP_LOGO from "../../../resources/buttercup-standalone.png";

class SearchPage extends PureComponent {
    static propTypes = {
        availableSources: PropTypes.number.isRequired,
        onPrepareFirstResults: PropTypes.func.isRequired,
        onUnlockAllArchives: PropTypes.func.isRequired
    };

    componentDidMount() {
        this.props.onPrepareFirstResults();
    }

    render() {
        return (
            <DialogFrame>
                <Choose>
                    <When condition={this.props.availableSources > 0}>
                        <SearchBar />
                        <SearchResults />
                    </When>
                    <Otherwise>
                        <NonIdealState
                            title={this.props.t("dialog:search.no-unlocked-vaults")}
                            description={this.props.t("dialog:search.no-vaults-are-available-or-unlocked")}
                            icon={<img src={BUTTERCUP_LOGO} width="64" />}
                            action={
                                this.props.availableSources === 0 ? (
                                    <Button icon="unlock" onClick={::this.props.onUnlockAllArchives}>
                                        {this.props.t("unlock-vaults")}
                                    </Button>
                                ) : null
                            }
                        />
                    </Otherwise>
                </Choose>
            </DialogFrame>
        );
    }
}

export default SearchPage;
