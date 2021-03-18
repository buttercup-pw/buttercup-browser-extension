import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import PasswordGeneratorPage from "../components/PasswordGeneratorPage.js";
import { setGeneratedPassword } from "../library/messaging.js";

export default withTranslation()(
    connect((state, ownProps) => ({}), {
        onSetPassword: password => () => {
            setGeneratedPassword(password);
        }
    })(PasswordGeneratorPage)
);
