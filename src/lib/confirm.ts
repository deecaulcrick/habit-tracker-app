import { Alert, Platform } from 'react-native';

/** Destructive confirmation that also works on web. */
export function confirm(title: string, message: string, onYes: () => void, yes = 'Delete') {
  if (Platform.OS === 'web') {
    if (globalThis.confirm?.(`${title}\n\n${message}`)) onYes();
    return;
  }
  Alert.alert(title, message, [
    { text: 'Cancel', style: 'cancel' },
    { text: yes, style: 'destructive', onPress: onYes },
  ]);
}
