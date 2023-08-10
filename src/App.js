import { ErrorBoundary } from './components';
import AppRoutes from './routes/AppRoutes';
import { AppThemeProvider } from './theme';
import { AppSnackBarProvider } from './components/AppSnackBar';
import WalletContextProvider from './components/Wallet/WalletContextProvider.js';

/**
 * Root Application Component
 * @component App
 */
const App = () => {
  return (
    <ErrorBoundary name="App">
        <WalletContextProvider>
          <AppThemeProvider>
            <AppSnackBarProvider>
              <AppRoutes />
            </AppSnackBarProvider>
          </AppThemeProvider>
        </WalletContextProvider>
    </ErrorBoundary>
  );
};

export default App;
