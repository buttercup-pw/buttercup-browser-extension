import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import EntriesPage from "../components/EntriesPage.js";
import { clearSearchResults } from "../library/messaging.js";
import { searchEntriesForTerm } from "../../shared/library/messaging.js";

export default withTranslation()(
    connect((state, ownProps) => ({}), {
        onSearchTermChange: searchTerm => () => {
            if (searchTerm.trim().length > 0) {
                searchEntriesForTerm(searchTerm);
            } else {
                clearSearchResults();
            }
        }
    })(EntriesPage)
);
