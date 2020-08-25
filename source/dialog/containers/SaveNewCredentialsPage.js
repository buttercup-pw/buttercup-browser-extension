import { connect } from "react-redux";
import { push } from "connected-react-router";
import SaveNewCredentialsPage from "../components/SaveNewCredentialsPage.js";
import { getLastLogins, stopCurrentSavePrompt } from "../library/messaging.js";
import { closeDialog, openURL } from "../library/context.js";
import { getExtensionURL } from "../../shared/library/extension.js";

export default connect((state, ownProps) => ({}), {
    cancelSavingCredentials: () => () => {
        stopCurrentSavePrompt();
        closeDialog();
    },
    disableSavePrompt: () => dispatch => {
        dispatch(push("/save-new-credentials/disable"));
    },
    fetchCredentials: () => () => getLastLogins(),
    openSaveForm: () => () => {
        openURL(getExtensionURL("setup.html#/save-new-credentials"));
        closeDialog();
    },
})(SaveNewCredentialsPage);
