
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import LandingPage from './components/landing/LandingPage';
import CreateCoin from './components/CreateCoin';
import CreatorToken from './components/token/CreatorToken';
import AllTokens from './components/Test';
export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navigation />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/create" element={<CreateCoin />} />
            <Route path="/token/:tokenAddress" element={<CreatorToken />} />

            <Route path="/test" element={<AllTokens />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}