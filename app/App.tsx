import { ColorSchemeName } from 'react-native';
import Navigation from './navigation';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { registerRootComponent } from 'expo';
import store from './redux/store';
import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import 'expo-dev-client';
import 'react-native-gesture-handler';

const AppWithProvider: React.FC = (): JSX.Element => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};

const App: React.FC = (): JSX.Element | null => {
  // Colour settings
  const colorScheme: NonNullable<ColorSchemeName> = useColorScheme();

  // Loading settings
  const isLoadingComplete: boolean = useCachedResources();
  if (!isLoadingComplete) {
    return null;
  }
  return (
    <>
      <Navigation colorScheme={colorScheme} />
      <StatusBar />
    </>
  );
};

export default registerRootComponent(AppWithProvider);
