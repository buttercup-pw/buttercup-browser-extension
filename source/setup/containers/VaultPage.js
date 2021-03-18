import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { push } from "react-router-redux";
import delay from "yoctodelay";
import { Layerr } from "layerr";
import VaultPage from "../components/VaultPage.js";
import { getArchiveAttachmentsSupport, getArchiveTitle, getArchiveType } from "../../shared/selectors/archives.js";
import { changeSourcePassword, lockArchive, removeArchive, unlockArchive } from "../library/messaging.js";
import { notifyError, notifySuccess, notifyWarning } from "../library/notify.js";
import { setBusy, unsetBusy } from "../../shared/actions/app.js";
import { isEditing } from "../selectors/manageArchive.js";
import { setEditing } from "../actions/manageArchive.js";
import { closeCurrentTab } from "../../shared/library/extension.js";

export default withTranslation()(
    connect(
        (state, ownProps) => ({
            archiveTitle: getArchiveTitle(state, ownProps.match.params.id),
            archiveType: getArchiveType(state, ownProps.match.params.id),
            attachments: getArchiveAttachmentsSupport(state, ownProps.match.params.id),
            isEditing: isEditing(state),
            state: ownProps.match.params.state,
            sourceID: ownProps.match.params.id
        }),
        {
            changePassword: (sourceID, oldPassword, newPassword, meta, onSuccessCB) => dispatch => {
                if (oldPassword.length <= 0 || newPassword.length <= 0) {
                    notifyError("Password empty", "Both old and new passwords must be specified");
                    return;
                }
                dispatch(setBusy("Changing password..."));
                changeSourcePassword(sourceID, oldPassword, newPassword, meta)
                    .then(() => {
                        dispatch(unsetBusy());
                        notifySuccess("Vault password changed", "Successfully changed vault password");
                        onSuccessCB();
                    })
                    .catch(err => {
                        dispatch(unsetBusy());
                        console.error(err);
                        notifyError(
                            "Failed changing password",
                            `Failed changing vault password for source (${sourceID}): ${err.message}`
                        );
                    });
            },
            onLockArchive: sourceID => dispatch => {
                dispatch(setBusy("Locking archive..."));
                dispatch(setEditing(true));
                lockArchive(sourceID)
                    .then(() => {
                        dispatch(unsetBusy());
                        notifySuccess("Archive locked", "Successfully locked archive");
                        setTimeout(() => {
                            closeCurrentTab();
                        }, 1250);
                    })
                    .catch(err => {
                        dispatch(unsetBusy());
                        dispatch(setEditing(false));
                        console.error(err);
                        notifyError("Failed locking archive", `Unable to lock archive (${sourceID}): ${err.message}`);
                    });
            },
            onRemoveArchive: sourceID => (dispatch, getState) => {
                const state = getState();
                const title = getArchiveTitle(state, sourceID);
                const remove = window.confirm(`Are you sure that you want to remove the archive '${title}'?`);
                if (remove) {
                    dispatch(setBusy("Removing archive..."));
                    dispatch(setEditing(true));
                    removeArchive(sourceID)
                        .then(() => delay(500))
                        .then(() => {
                            dispatch(unsetBusy());
                            notifySuccess("Archive removed", "Successfully removed archive");
                            setTimeout(() => {
                                closeCurrentTab();
                            }, 1250);
                        })
                        .catch(err => {
                            dispatch(setEditing(false));
                            dispatch(unsetBusy());
                            console.error(err);
                            notifyError(
                                "Failed removing archive source",
                                `Unable to remove source (${sourceID}): ${err.message}`
                            );
                        });
                }
            },
            onUnlockArchive: (sourceID, masterPassword, completeAction = "edit") => dispatch => {
                dispatch(setBusy("Unlocking archive..."));
                dispatch(setEditing(true));
                unlockArchive(sourceID, masterPassword)
                    .then(() => {
                        dispatch(unsetBusy());
                        dispatch(setEditing(false));
                        notifySuccess("Archive unlocked", "Successfully unlocked archive");
                        if (completeAction === "close") {
                            setTimeout(() => {
                                closeCurrentTab();
                            }, 1250);
                        } else if (completeAction === "edit") {
                            dispatch(push(`/access-archive/${sourceID}/unlocked`));
                        }
                    })
                    .catch(err => {
                        dispatch(setEditing(false));
                        dispatch(unsetBusy());
                        console.error(err);
                        const { hush } = Layerr.info(err);
                        if (hush) {
                            notifyWarning("Authorisation failed", "The credentials were invalid - re-authenticating");
                        } else {
                            notifyError("Failed unlocking archive", `Unable to unlock archive: ${err.message}`);
                        }
                    });
            }
        }
    )(VaultPage)
);
