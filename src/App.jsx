import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LoginPage from "./pages/LoginPage";
import NewsListPage from "./pages/NewsListPage";
import NewsDetailPage from "./pages/NewsDetailPage";
import NewsFormPage from "./pages/NewsFormPage";
import RegisterPage from "./pages/RegisterPage";

const HomeRoute = () => {
  const { user } = useAuth();
  return user ? <NewsListPage /> : <LoginPage />;
};

const PrivateRoute = ({ children, roles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" />;

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex-col" style={{ minHeight: '100vh' }}>
          <Header />
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<HomeRoute />} />
              <Route path="/login" element={<Navigate to="/" replace />} />
              <Route path="/register" element={<RegisterPage />} />

              <Route path="/news/:id" element={
                <PrivateRoute>
                  <NewsDetailPage />
                </PrivateRoute>
              } />

              <Route
                path="/create"
                element={
                  <PrivateRoute roles={['author']}>
                    <NewsFormPage />
                  </PrivateRoute>
                }
              />

              <Route
                path="/edit/:id"
                element={
                  <PrivateRoute roles={['author']}>
                    <NewsFormPage />
                  </PrivateRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
