
import { LanguageProvider } from './features/language/LanguageContext';
import { ToastProvider } from './components/Toast';
import { CivicConnectApp } from './pages/CivicConnectApp';

function App() {
  return (
    <LanguageProvider>
      <ToastProvider>
        <CivicConnectApp />
      </ToastProvider>
    </LanguageProvider>
  );
}

export default App;
