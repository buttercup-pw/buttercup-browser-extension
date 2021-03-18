import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { withRouter } from "react-router";
import { getConfigKey } from "../selectors/app.js";
import App from "../components/App.js";

export default withTranslation()(
    withRouter(
        connect((state, ownProps) => ({
            darkMode: getConfigKey(state, "darkMode"),
            language: getConfigKey(state, "language")
        }))(App)
    )
);
