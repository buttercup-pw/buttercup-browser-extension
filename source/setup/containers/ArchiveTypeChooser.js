import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import ArchiveTypeChooser from "../components/ArchiveTypeChooser.js";
import { setSelectedArchiveType } from "../actions/addArchive.js";
import { getSelectedArchiveType } from "../selectors/addArchive.js";
import { getConfigKey } from "../../shared/selectors/app.js";

export default withTranslation()(
    connect(
        (state, ownProps) => ({
            selectedArchiveType: getSelectedArchiveType(state),
            darkMode: getConfigKey(state, "darkMode")
        }),
        {
            onSelectArchiveType: type => dispatch => {
                dispatch(setSelectedArchiveType(type));
            }
        }
    )(ArchiveTypeChooser)
);
