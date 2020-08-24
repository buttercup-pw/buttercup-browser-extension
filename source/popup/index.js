import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Route } from "react-router-dom";
import { ConnectedRouter } from "connected-react-router";
import styled from "styled-components";
import { Divider } from "@blueprintjs/core";
import store from "./redux/index.js";
import history from "./redux/history.js";
import ArchivesListPage from "./containers/ArchivesListPage.js";
import EntriesPage from "./containers/EntriesPage.js";
import SettingsPage from "./containers/SettingsPage.js";
import HeaderBar from "./containers/HeaderBar.js";
import App from "../shared/containers/App.js";
import { trackUserActivity } from "./library/messaging.js";

import "../shared/styles/base.sass";
import "./styles/popup.sass";

const ContentWrapper = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    padding: 0.25rem 0.5rem 0.5rem;
`;

ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <App>
                <HeaderBar />
                <Divider />
                <ContentWrapper>
                    <Route exact path="/" component={EntriesPage} />
                    <Route path="/vaults" component={ArchivesListPage} />
                    <Route exact path="/settings" component={SettingsPage} />
                </ContentWrapper>
            </App>
        </ConnectedRouter>
    </Provider>,
    document.getElementById("root"),
    () => trackUserActivity()
);
