import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { withRouter } from "react-router";
import ArchivesListPage from "../components/ArchivesListPage.js";
import { getArchives, getArchiveTitle } from "../../shared/selectors/archives.js";
import { createNewTab, getExtensionURL } from "../../shared/library/extension.js";
import { lockArchive, removeArchive } from "../library/messaging";
import { getConfigKey } from "../../shared/selectors/app.js";
import i18n from "../../shared/i18n";

export default withTranslation()(
    withRouter(
        connect(
            (state, ownProps) => ({
                archives: getArchives(state),
                darkMode: getConfigKey(state, "darkMode")
            }),
            {
                onArchiveClick: (archiveID, state) => () => {
                    createNewTab(getExtensionURL(`setup.html#/access-archive/${archiveID}/${state}`));
                },
                onAddArchiveClick: () => () => {
                    createNewTab(getExtensionURL("setup.html#/add-archive"));
                },
                onLockArchive: sourceID => dispatch => {
                    return lockArchive(sourceID);
                },
                onRemoveArchive: sourceID => (dispatch, getState) => {
                    const state = getState();
                    const title = getArchiveTitle(state, sourceID);
                    const remove = window.confirm(i18n.t("notification.confirm.remove-vault", { title }));
                    if (remove) {
                        return removeArchive(sourceID);
                    }
                }
            }
        )(ArchivesListPage)
    )
);
