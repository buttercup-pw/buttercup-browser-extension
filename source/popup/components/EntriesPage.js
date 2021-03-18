import React, { PureComponent, Fragment } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { InputGroup, Classes } from "@blueprintjs/core";
import SearchResults from "../containers/SearchResults.js";

const SearchInputWrapper = styled.div`
    flex: 0;
    margin-bottom: 0.5rem;
`;

export default class EntriesPage extends PureComponent {
    handleSearchTermChange(event) {
        const value = event.target.value;
        this.props.onSearchTermChange(value);
    }

    render() {
        return (
            <Fragment>
                <SearchInputWrapper>
                    <InputGroup
                        placeholder={this.props.t("search-for-entries")}
                        className={Classes.FILL}
                        type="search"
                        leftIcon="search"
                        autoFocus={true}
                        onChange={::this.handleSearchTermChange}
                    />
                </SearchInputWrapper>
                <SearchResults />
            </Fragment>
        );
    }
}
