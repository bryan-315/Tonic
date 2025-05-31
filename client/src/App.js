// Imports for React and other libraries
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Page imports
import Home from './pages/Home';
import About from './pages/About';
// Users
import Login from './pages/Login';
import Signup from './pages/Signup';
//import Profile from './pages/Profile';
// Drinks
import CreateDrink from './pages/CreateDrink';
import DrinkPage from './pages/DrinkPage';
import AllDrinks from './pages/AllDrinks';
import UserCreations from './pages/UserCreations';
import LikedDrinks from './pages/LikedDrinks';
import EditDrink from './pages/EditDrink';

// Component imports
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';

//Style imports
import layout from "./styles/Layout.module.css";


const App = () => {
    return (
        <Router>
            <Sidebar />
            <Toaster 
            position='top-center'
            toastOptions={{ duration: 4000 }}
            />
            <div className={layout.container}>
                <Navbar />
                <main className={layout.mainContent}>
                    <Routes>
                        <Route path='/' element={<Home />} />
                        <Route path='/about' element={<About />} />
                        {/* Users */}
                        <Route path='/login' element={<Login />} />
                        <Route path='/signup' element={<Signup />} />
                        {/* Drinks */}
                        <Route path='/create' element={<CreateDrink />} />
                        <Route path='/all-drinks' element={<AllDrinks />} />
                        <Route path='/user/:userId/drinks' element={<UserCreations />} />
                        <Route path='/liked-drinks' element={<LikedDrinks />} />
                        <Route path='/drinks/:drinkId' element={<DrinkPage />} />
                        <Route path='/drinks/:drinkId/edit' element={<EditDrink />} />
                        {/* Add more routes as needed */}
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;