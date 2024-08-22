import { Route, Routes } from 'react-router-dom';

import AuthPage from './pages/auth/auth';
import GoogleOAuthSuccessRedirect from './pages/google-oauth-success-redirect/google-oauth-success-redirect';
import { useAuthState } from './pages/auth/state/state';

function App() {
  const user = useAuthState()
  console.log(user.user)
  return (
    <>
    <Routes>
  
      <Route path="auth" element={<AuthPage />} />
      <Route
        path="auth/google-oauth-success-redirect"
        element={<GoogleOAuthSuccessRedirect />}
      />
    </Routes>
    </>
  );
}

export default App;