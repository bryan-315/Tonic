// Imports for React and other libraries
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Page imports
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Create from './pages/Create';

// Component imports
import Navbar from './components/Navbar';


const App = () => {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/about' element={<About />} />
                <Route path='/login' element={<Login />} />
                <Route path='/signup' element={<Signup />} />
                <Route path='/profile' element={<Profile />} />
                <Route path='/create' element={<Create />} />
            </Routes>
        </Router>
    );
}

export default App;