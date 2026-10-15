import { router } from 'expo-router';

/** Go back, or home if this screen was opened directly (e.g. a deep link or web refresh). */
export function close() {
  if (router.canGoBack()) router.back();
  else router.replace('/');
}
