import PasswordPage from './pages/PasswordPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PasswordPage />} />
        <Route path="/home" element={<Home />} />
        {/* ... existing routes ... */}
      </Routes>
    </Router>
  );
}

export default App; 