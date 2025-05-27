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
import AllDrinks from './pages/AllDrinks';
import EditDrink from './pages/EditDrink';
// Component imports
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';


const App = () => {
    return (
        <Router>
            <Navbar />
            <div style={{ display: 'flex' }}>
                <Sidebar />
                <main>
                    <Routes>
                        <Route path='/' element={<Home />} />
                        <Route path='/about' element={<About />} />
                        {/* Users */}
                        <Route path='/login' element={<Login />} />
                        <Route path='/signup' element={<Signup />} />
                        <Route path='/profile' element={<Profile />} />
                        {/* Drinks */}
                        <Route path='/create' element={<CreateDrink />} />
                        <Route path='/all-drinks' element={<AllDrinks />} />
                        <Route path='/drinks/:drinkId' element={<DrinkPage />} />
                        <Route path='/drinks/:drinkId/edit' element={<EditDrink />} />
                        {/* Add more routes as needed */}
                    </Routes>
                </main>
            </div>
            <Footer />
        </Router>
    );
}

export default App;