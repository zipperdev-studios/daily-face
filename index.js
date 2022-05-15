import { AppRegistry, Platform } from 'react-native';

import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately

AppRegistry.registerComponent('dailyface', () => App);

if (Platform.OS === 'web') {
    const rootTag = document.getElementById('root') || document.getElementById('dailyface');
    AppRegistry.runApplication('dailyface', { rootTag });
};