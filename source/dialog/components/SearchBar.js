import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { InputGroup, Classes } from "@blueprintjs/core";

import BUTTERCUP_ICON from "../../../resources/buttercup-128.png";
import SEARCH_ICON from "../../../resources/search-icon.png";

const Container = styled.div`
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;
`;
const ButtercupIcon = styled.img`
    width: 30px;
    height: 30px;
    margin-right: 0.5rem;
`;
const SearchInput = styled.input`
    flex-grow: 2;
    border: 0;
    color: #fff;
    height: 36px;
    margin: 0px;
    background-color: rgba(0, 0, 0, 0);
    font-size: 16px;
    padding-left: 26px;
    outline: none;
    background: url(${SEARCH_ICON});
    background-repeat: no-repeat;
    background-position: 6px 50%;
    background-size: 14px 14px;
`;

class SearchBar extends Component {
    static propTypes = {
        onSearchTermChange: PropTypes.func.isRequired
    };

    state = {
        searchTerm: ""
    };

    componentDidMount() {
        setTimeout(() => {
            this._input.focus();
        }, 250);
    }

    handleSearchTermChange(event) {
        const value = event.target.value;
        this.setState({
            searchTerm: value
        });
        this.props.onSearchTermChange(value);
    }

    render() {
        return (
            <Container>
                <ButtercupIcon src={BUTTERCUP_ICON} />
                <InputGroup
                    className={Classes.FILL}
                    type="search"
                    leftIcon="search"
                    placeholder={this.props.t("search-for-entries")}
                    value={this.state.searchTerm}
                    onChange={::this.handleSearchTermChange}
                    inputRef={input => {
                        this._input = input;
                    }}
                />
            </Container>
        );
    }
}

export default SearchBar;
