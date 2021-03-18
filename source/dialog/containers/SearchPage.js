import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import SearchPage from "../components/SearchPage.js";
import { getSourcesCount } from "../../shared/selectors/searching.js";
import { getTopURL } from "../library/context.js";
import { searchEntriesForURL } from "../../shared/library/messaging.js";
import { createNewTab, getExtensionURL } from "../../shared/library/extension.js";

export default withTranslation()(
    connect(
        (state, ownProps) => ({
            availableSources: getSourcesCount(state)
        }),
        {
            onPrepareFirstResults: () => () => {
                getTopURL()
                    .then(url => searchEntriesForURL(url))
                    .catch(err => {
                        console.error(err);
                    });
            },
            onUnlockAllArchives: () => () => {
                createNewTab(getExtensionURL("setup.html#/unlock"));
            }
        }
    )(SearchPage)
);
