import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import LoadingModal from "../components/LoadingModal.js";
import { getBusyMessage, shouldShowBusyModal } from "../../shared/selectors/app.js";

export default withTranslation()(
    connect(
        (state, ownProps) => ({
            busy: shouldShowBusyModal(state),
            busyMessage: getBusyMessage(state)
        }),
        {}
    )(LoadingModal)
);
