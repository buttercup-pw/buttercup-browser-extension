import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { Layerr } from "layerr";
import UnlockAllArchivesPage from "../components/UnlockAllArchivesPage.js";
import { getArchives } from "../../shared/selectors/archives.js";
import { unlockArchive } from "../library/messaging.js";
import { notifyError, notifySuccess, notifyWarning } from "../library/notify.js";
import { closeCurrentTab } from "../../shared/library/extension.js";
import { getConfigKey } from "../../shared/selectors/app.js";
import { DATASOURCE_TYPES } from "../../shared/library/icons.js";

function getArchivesArray(state) {
    return getArchives(state)
        .filter(source => DATASOURCE_TYPES.includes(source.type))
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map(source => ({
            name: source.name,
            sourceID: source.id,
            state: source.state,
            type: source.type
        }));
}

export default withTranslation()(
    connect(
        (state, ownProps) => ({
            archives: getArchivesArray(state),
            darkMode: getConfigKey(state, "darkMode")
        }),
        {
            onUnlockArchive: (sourceID, masterPassword) => (dispatch, getState) => {
                const state = getState();
                const archives = getArchivesArray(state);
                const isLast = archives.filter(a => a.state !== "unlocked" && a.sourceID !== sourceID).length === 0;
                return unlockArchive(sourceID, masterPassword)
                    .then(() => {
                        notifySuccess("Archive unlocked", "Successfully unlocked archive");
                        setTimeout(() => {
                            if (isLast) {
                                closeCurrentTab();
                            }
                        }, 1250);
                        return true;
                    })
                    .catch(err => {
                        console.error(err);
                        const { hush } = Layerr.info(err);
                        if (hush) {
                            notifyWarning("Authorisation failed", "The credentials were invalid - re-authenticating");
                        } else {
                            notifyError(
                                "Failed unlocking archive",
                                `Unable to unlock archive (${sourceID}): ${err.message}`
                            );
                        }
                        return false;
                    });
            }
        }
    )(UnlockAllArchivesPage)
);
