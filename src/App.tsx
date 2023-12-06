import {
  ThemeProvider,
  createTheme,
} from '@mui/material'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Main from './Main';

export const theme = createTheme({
  palette: {
    primary: {
      main: "#230448",
    },
    secondary: {
      main: '#212226',
    },
    warning: {
      main: '#FFBF42',
    },
    error: {
      main: '#d61644',
    }
  },
});

const App = () => {

  return (
    <ThemeProvider theme={theme}>
      <Main />
    </ThemeProvider>
  );
};

export default App;