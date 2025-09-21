import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { StatusBar, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import Store from './app/redux/Store';
import AppNavigator from './app/navigation/AppNavigator';

function App() {
  return (
    <Provider store={Store}>
      <SafeAreaProvider>
        <NavigationContainer>
          <StatusBar barStyle={'default'} />
          <AppNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
}

export default App;
