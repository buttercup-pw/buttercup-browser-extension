import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import VaultEditor from "../components/VaultEditor.js";
import { setVaultFacade } from "../actions/vault.js";
import { getVaultFacade } from "../selectors/vault.js";
import {
    addAttachments,
    applyArchiveFacade,
    deleteAttachment,
    getArchiveFacade,
    getAttachmentData,
    getAttachmentDetails
} from "../library/messaging.js";
import { notifyError, notifySuccess } from "../library/notify.js";
import { setBusy, unsetBusy } from "../../shared/actions/app.js";
import { arrayBufferToBase64, base64ToArrayBuffer } from "../../shared/library/buffer.js";
import { getConfigKey } from "../../shared/selectors/app.js";

async function convertAttachmentFiles(files) {
    const output = [];
    for (const file of files) {
        const data = arrayBufferToBase64(await file.arrayBuffer());
        output.push({
            data,
            name: file.name,
            type: file.type || "application/octet-stream"
        });
    }
    return output;
}

export default withTranslation()(
    connect(
        (state, ownProps) => ({
            dynamicIconsSetting: getConfigKey(state, "dynamicIcons"),
            vault: getVaultFacade(state)
        }),
        {
            addAttachments: (sourceID, entryID, files) => dispatch => {
                dispatch(setBusy("Adding attachments"));
                convertAttachmentFiles(files)
                    .then(convertedFiles => addAttachments(sourceID, entryID, convertedFiles))
                    .then(() =>
                        getArchiveFacade(sourceID).then(facade => {
                            dispatch(setVaultFacade(facade));
                        })
                    )
                    .then(() => {
                        dispatch(unsetBusy());
                        notifySuccess("Attachments added", `Successfully added ${files.length} attachments`);
                    })
                    .catch(err => {
                        console.error(err);
                        dispatch(unsetBusy());
                        notifyError("Failed adding attachments", err.message);
                    });
            },
            deleteAttachment: (sourceID, entryID, attachmentID) => dispatch => {
                dispatch(setBusy("Deleting attachment"));
                deleteAttachment(sourceID, entryID, attachmentID)
                    .then(() =>
                        getArchiveFacade(sourceID).then(facade => {
                            dispatch(setVaultFacade(facade));
                        })
                    )
                    .then(() => {
                        dispatch(unsetBusy());
                        notifySuccess("Attachment deleted", `Successfully deleted the attachment`);
                    })
                    .catch(err => {
                        console.error(err);
                        dispatch(unsetBusy());
                        notifyError("Failed deleting attachment", err.message);
                    });
            },
            downloadAttachment: (sourceID, entryID, attachmentID) => dispatch => {
                dispatch(setBusy("Downloading attachment"));
                Promise.all([
                    getAttachmentData(sourceID, entryID, attachmentID),
                    getAttachmentDetails(sourceID, entryID, attachmentID)
                ])
                    .then(([base64, attachmentDetails]) => {
                        const attachmentData = base64ToArrayBuffer(base64);
                        const blob = new Blob([attachmentData], { type: attachmentDetails.type });
                        const objectUrl = URL.createObjectURL(blob);
                        const anchor = document.createElement("a");
                        anchor.href = objectUrl;
                        anchor.download = attachmentDetails.name;
                        document.body.appendChild(anchor);
                        anchor.click();
                        setTimeout(() => {
                            URL.revokeObjectURL(objectUrl);
                            document.body.removeChild(anchor);
                        }, 0);
                    })
                    .then(() => {
                        dispatch(unsetBusy());
                    })
                    .catch(err => {
                        console.error(err);
                        dispatch(unsetBusy());
                        notifyError("Failed downloading attachment", err.message);
                    });
            },
            fetchVaultFacade: sourceID => dispatch => {
                getArchiveFacade(sourceID)
                    .then(facade => {
                        dispatch(setVaultFacade(facade));
                    })
                    .catch(err => {
                        console.error(err);
                        notifyError("Failed fetching archive", `Unable to fetch archive (${sourceID}): ${err.message}`);
                    });
            },
            handlePreviewAttachmentError: err => () => {
                console.error(err);
                notifyError("Failed fetching attachment preview", err.message);
            },
            saveVaultFacade: (sourceID, facade) => dispatch => {
                dispatch(setBusy("Saving vault"));
                applyArchiveFacade(sourceID, facade)
                    .then(() => getArchiveFacade(sourceID))
                    .then(updatedFacade => {
                        dispatch(setVaultFacade(updatedFacade));
                    })
                    .then(() => {
                        dispatch(unsetBusy());
                        notifySuccess("Save successful", "Successfully updated the vault");
                    })
                    .catch(err => {
                        console.error(err);
                        notifyError(
                            "Failed updating archive",
                            `Unable to update archive (${sourceID}): ${err.message}`
                        );
                        dispatch(unsetBusy());
                    });
            }
        }
    )(VaultEditor)
);
