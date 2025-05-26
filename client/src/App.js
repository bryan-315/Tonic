// Imports for React and other libraries
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Page imports
import Home from './pages/Home';
import About from './pages/About';
// Users
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';

// Drinks
import CreateDrink from './pages/CreateDrink';
import DrinkPage from './pages/DrinkPage';

// Component imports
import Navbar from './components/Navbar';


const App = () => {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/about' element={<About />} />
                {/* Users */}
                <Route path='/login' element={<Login />} />
                <Route path='/signup' element={<Signup />} />
                <Route path='/profile' element={<Profile />} />
                {/* Drinks */}
                <Route path='/create' element={<CreateDrink />} />
                <Route path='/drinks/:drinkId' element={<DrinkPage />} />
                {/* Add more routes as needed */}
            </Routes>
        </Router>
    );
}

export default App;