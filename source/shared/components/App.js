import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Classes } from "@blueprintjs/core";
import { ThemeProvider } from "styled-components";
import Container from "../components/Container.js";
import themes from "../themes.js";

import i18n from "../i18n";

const App = ({ children, darkMode, noBackgroundColor, language }) => {
    useEffect(() => {
        i18n.changeLanguage(language);
    }, [language]);

    return (
        <ThemeProvider theme={darkMode ? themes.dark : themes.light}>
            <Container className={darkMode ? Classes.DARK : null} noBackgroundColor={noBackgroundColor}>
                {children}
            </Container>
        </ThemeProvider>
    );
};

App.propTypes = {
    darkMode: PropTypes.bool,
    noBackgroundColor: PropTypes.bool
};

export default App;
