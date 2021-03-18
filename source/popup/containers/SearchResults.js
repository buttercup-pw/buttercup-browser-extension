import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import SearchResults from "../components/SearchResults.js";
import { getEntryResults } from "../../shared/selectors/searching.js";
import { getConfigKey } from "../../shared/selectors/app.js";
import { getTotalArchivesCount, getUnlockedArchivesCount } from "../../shared/selectors/archives.js";
import { requestCredentialsOpening } from "../library/messaging.js";
import { createNewTab, getExtensionURL } from "../../shared/library/extension.js";

export default withTranslation()(
    connect(
        (state, ownProps) => ({
            dynamicIconsSetting: getConfigKey(state, "dynamicIcons"),
            entries: getEntryResults(state),
            sourcesTotal: getTotalArchivesCount(state),
            sourcesUnlocked: getUnlockedArchivesCount(state)
        }),
        {
            onAddVault: () => () => {
                createNewTab(getExtensionURL("setup.html#/add-archive"));
            },
            onSelectEntry: (sourceID, entryID, autoSignIn) => () => {
                requestCredentialsOpening(sourceID, entryID, autoSignIn);
            },
            onUnlockAllArchives: () => () => {
                createNewTab(getExtensionURL("setup.html#/unlock"));
            }
        }
    )(SearchResults)
);
