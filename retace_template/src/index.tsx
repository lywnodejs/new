import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
// Import Material Theme
import {createTheme, ThemeProvider} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
// import redux
import {Provider} from "react-redux";
import rootStore from "./redux/store";
import {useSelector} from './redux/hooks';

//添加自定义属性到theme

declare module "@material-ui/core/styles/createPalette" {
    interface Palette {
      menu: Palette['primary'];
    }
    interface PaletteOptions {
      menu: PaletteOptions['primary'];
    }
  }

const Index:React.FC = () => {
    const themeMode = useSelector(state => state.theme.currentMode);

    // System Default Theme
    const theme = createTheme({
        palette: {
            type: themeMode,
            common: {
                black: '#000',
                white: '#fff',
            },
            primary: {
                light: '#4b9fea',
                main: '#1e88e5',
                dark: '#233044',  //#1f2733
                contrastText: '#fff',
            },
            secondary: {
                light: '#ffc570',
                main: '#ffb74d',
                dark: '#b28035',
                contrastText: '#000',
            },
            error:{
                light: '#ff7171',
                main: '#f44336',
                dark: '#d32f2f',
            },
            action: {
                hover: 'rgb(0 0 0 / 10%)',  //4
                selected: 'rgb(0 0 0 / 14%)',  //8
            },
            background:{
                paper: themeMode === 'light'? '#fff':'#2e3642',
                default: themeMode === 'light'? '#F0F0F0':'#1f2733',
            },
            menu: {
                light: '#f9f9f9',
                main: '#666666',
                dark: '#25282f',
                // contrastText: '#fff'
            }
        },

    });

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <App/>
        </ThemeProvider>
    );
};

ReactDOM.render(
    // <React.StrictMode>
    // 全局链接Redux
    <Provider store={rootStore.store}>
        <Index />
    </Provider>
    // </React.StrictMode>,
    ,document.getElementById('root')
);
