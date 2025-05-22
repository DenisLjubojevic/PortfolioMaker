import Auth from './components/Auth';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import './App.css';
import './CustomDatePicker.css';
import axios from 'axios';
import PortfolioPreview from './components/PreviewPortfolio/PortfolioPreview';
import BrowsePortfoliosComponent from './components/BrowsePortfolios/BrowsePortfoliosComponent';
import MessagesComponent from './components/Messages/MessagesComponent';

function App() {
    axios.interceptors.request.use((config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    });

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Auth />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/browse" element={<BrowsePortfoliosComponent />} />
                <Route path="/messages" element={<MessagesComponent /> } />
                <Route path="/preview/:previewId" element={<PortfolioPreview />} />
            </Routes>
        </Router>
    )
}

export default App
