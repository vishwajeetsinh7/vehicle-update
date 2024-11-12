import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ViewVehicles.css';

const ViewVehicles = () => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [email, setEmail] = useState(sessionStorage.getItem('email'));
    const [filterType, setFilterType] = useState(''); // State for filtering vehicles
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:3004/viewVehicles", {
            params: { email }
        })
            .then(res => {
                if (res.data === "Error retrieving vehicles") {
                    setError("Error fetching vehicles");
                } else {
                    setVehicles(res.data);
                }
                setLoading(false);
            })
            .catch(err => {
                console.log(err);
                setError("Error fetching vehicles");
                setLoading(false);
            });
    }, [email]);

    const handleUpdate = (id) => {
        navigate(`/updateVehicle/${id}`);
    };

    const handleDelete = (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this vehicle?");
        if (confirmDelete) {
            axios.delete(`http://localhost:3004/deleteVehicle/${id}`)
                .then(res => {
                    if (res.data === "Error Deleting Vehicle") {
                        alert("Error deleting vehicle");
                    } else {
                        setVehicles(vehicles.filter(vehicle => vehicle.id !== id));
                        alert("Vehicle deleted successfully");
                    }
                })
                .catch(err => {
                    console.log(err);
                    alert("Error deleting vehicle");
                });
        }
    };

    const handleAdd = () => {
        navigate(`/addVehicle`);
    };

    // Filter vehicles based on selected type
    const filteredVehicles = filterType 
        ? vehicles.filter(vehicle => vehicle.type === filterType) 
        : vehicles;

    if (loading) return <div className="loading-spinner">Loading...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="vehicles-container">
            <h2>Registered Vehicles</h2>

            {/* Dropdown for selecting vehicle type filter */}
            <div className="filter">
            <label htmlFor="vehicleFilter">Filter by Type:</label>
            <select
                id="vehicleFilter"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
            >
                <option value="">All</option>
                <option value="car">Car</option>
                <option value="bike">Bike</option>
                <option value="bicycle">Bicycle</option>
                <option value="truck">Truck</option>
                <option value="autorickshaw">Autorickshaw</option>
                {/* Add more vehicle types as needed */}
            </select>
            </div>

            <button onClick={handleAdd} className="add-vehicle-btn">Add Vehicle</button>

            <div className="vehicle-list">
                {filteredVehicles.map((vehicle) => (
                    <div key={vehicle.id} className="vehicle-card">
                        <div className="vehicle-image">
                            <img src={vehicle.image} alt={vehicle.model} />
                        </div>
                        <div className="vehicle-info">
                            <h3>{vehicle.model}</h3>
                            <p><strong>Registration Number:</strong> {vehicle.number}</p>
                            <p><strong>Type:</strong> {vehicle.type}</p>
                            <p><strong>Purchase Date:</strong> {new Date(vehicle.pdate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}</p>
                        </div>
                        <div className="vehicle-actions">
                            <button onClick={() => handleUpdate(vehicle._id)} className="update-btn">Update</button>
                            <button onClick={() => handleDelete(vehicle._id)} className="delete-btn">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ViewVehicles;
