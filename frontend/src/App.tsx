import { Route, Routes } from 'react-router-dom';

import { AiCoachPage } from './pages/AiCoachPage';
import { DailyCheckInPage } from './pages/DailyCheckInPage';
import { DashboardPage } from './pages/DashboardPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/check-in" element={<DailyCheckInPage />} />
      <Route path="/ai-coach" element={<AiCoachPage />} />
      <Route path="*" element={<DashboardPage />} />
    </Routes>
  );
}

export default App;
