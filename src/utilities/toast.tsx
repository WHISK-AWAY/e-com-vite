import toast from 'react-hot-toast';
import ToastBody from '../components/Toast/ToastBody';

export function toastGuestFavorite() {
  toast.custom((t) => (
    <ToastBody
      message='Please make an account to start adding favorites'
      toastInstance={t}
    />
  ));
}

export function toastUserLoggedIn(username: string) {
  if (!username) return;

  toast.custom((t) => (
    <ToastBody
      message={`Log-in successful. Welcome, ${username}!`}
      toastInstance={t}
    />
  ));
}

export function toastUserLoggedOut() {
  toast.custom((t) => (
    <ToastBody message='You have been signed out.' toastInstance={t} />
  ));
}

export function toastAddedToCart() {
  toast.custom((t) => (
    <ToastBody message='Item added to cart.' toastInstance={t} />
  ));
}

export function toastAddedToFavorites() {
  toast.custom((t) => (
    <ToastBody message='Item added to favorites.' toastInstance={t} />
  ));
}
