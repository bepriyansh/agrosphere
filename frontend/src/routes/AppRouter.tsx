import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Providers from '../Providers';
import { Suspense, lazy } from 'react';
import LoadingPage from '../components/loaderPage';

const NotFound = lazy(() => import('../pages/404'));
const Login = lazy(() => import('../pages/auth/login'));
const Home = lazy(() => import('../pages/home'));
const SignUp = lazy(() => import('../pages/auth/signup'));
const PostPage = lazy(() => import('../pages/post'));
const ResetPassword = lazy(() => import('../pages/resetPassword'));
const ForgetPassword = lazy(() => import('../pages/forgetPassword'));

const AppRouter = () => {
  return (
    <Router>
      <Providers>
        <Suspense fallback={<LoadingPage />}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/forgot-password" element={<ForgetPassword />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/post/:id"
              element={
                <ProtectedRoute>
                  <PostPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Providers>
    </Router>
  );
};

export default AppRouter;
