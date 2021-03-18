import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import SettingsPage from "../components/SettingsPage.js";
import { getConfig } from "../../shared/selectors/app.js";
import { setConfig } from "../../shared/library/messaging.js";

export default withTranslation()(
    connect(
        (state, ownProps) => ({
            config: getConfig(state)
        }),
        {
            onUpdateConfigValue: (key, value) => () => {
                setConfig(key, value);
            }
        }
    )(SettingsPage)
);
