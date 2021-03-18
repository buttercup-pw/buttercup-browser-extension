import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { push } from "react-router-redux";
import delay from "yoctodelay";
import MyBcupVaultPage from "../components/MyBcupVaultPage.js";
import { getArchiveState, getArchiveTitle } from "../../shared/selectors/archives.js";
import { unlockArchive } from "../library/messaging.js";
import { notifyError, notifySuccess, notifyWarning } from "../library/notify.js";
import { setBusy, unsetBusy } from "../../shared/actions/app.js";
import { isEditing } from "../selectors/manageArchive.js";
import { setEditing } from "../actions/manageArchive.js";

export default withTranslation()(
    connect(
        (state, ownProps) => ({
            archiveTitle: getArchiveTitle(state, ownProps.match.params.id),
            isEditing: isEditing(state),
            state: getArchiveState(state, ownProps.match.params.id),
            sourceID: ownProps.match.params.id
        }),
        {
            onUnlockArchive: (sourceID, masterPassword) => dispatch => {
                dispatch(setBusy("Unlocking vault..."));
                dispatch(setEditing(true));
                unlockArchive(sourceID, masterPassword)
                    .then(() => {
                        dispatch(unsetBusy());
                        dispatch(setEditing(false));
                        notifySuccess("Vault unlocked", "Successfully unlocked vault");
                        dispatch(push(`/mybuttercup-vault/${sourceID}`));
                    })
                    .catch(err => {
                        dispatch(setEditing(false));
                        dispatch(unsetBusy());
                        console.error(err);
                        const { hush } = Layerr.info(err);
                        if (hush) {
                            notifyWarning("Authorisation failed", "The credentials were invalid - re-authenticating");
                        } else {
                            notifyError("Failed unlocking vault", `Unable to unlock archive: ${err.message}`);
                        }
                    });
            }
        }
    )(MyBcupVaultPage)
);
