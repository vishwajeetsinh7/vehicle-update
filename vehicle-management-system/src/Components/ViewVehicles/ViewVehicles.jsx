import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ViewVehicles.css';

const ViewVehicles = () => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [email, setEmail] = useState(sessionStorage.getItem('email'));
    const [filterType, setFilterType] = useState('');
    const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [maintenanceRecords, setMaintenanceRecords] = useState([]);
    const [maintenanceType, setMaintenanceType] = useState('');
    const [maintenanceDate, setMaintenanceDate] = useState('');
    const [maintenanceCost, setMaintenanceCost] = useState('');

    const navigate = useNavigate();

    // Fetch vehicles from server on component mount
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

    // Handle navigation to add vehicle page
    const handleAdd = () => {
        navigate(`/addVehicle`);
    };

    // Handle vehicle update by navigating to update page
    const handleUpdate = (id) => {
        navigate(`/updateVehicle/${id}`);
    };

    // Handle vehicle deletion
    const handleDelete = (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this vehicle?");
        if (confirmDelete) {
            axios.delete(`http://localhost:3004/deleteVehicle/${id}`)
                .then(res => {
                    if (res.data === "Error Deleting Vehicle") {
                        alert("Error deleting vehicle");
                    } else {
                        setVehicles(vehicles.filter(vehicle => vehicle._id !== id));
                        alert("Vehicle deleted successfully");
                    }
                })
                .catch(err => {
                    console.log(err);
                    alert("Error deleting vehicle");
                });
        }
    };

    // Filter vehicles based on selected type
    const filteredVehicles = filterType 
        ? vehicles.filter(vehicle => vehicle.type === filterType) 
        : vehicles;

    // Display maintenance records and form in a modal
    const handleViewMaintenance = (vehicle) => {
        setSelectedVehicle(vehicle);
        axios.get(`http://localhost:3004/getMaintenanceRecords/${vehicle._id}`)
            .then(res => {
                setMaintenanceRecords(res.data);
                setShowMaintenanceModal(true);
            })
            .catch(err => {
                console.log(err);
                alert("Error fetching maintenance records");
            });
    };

    const handleAddMaintenance = () => {
        const data = {
            vehicleId: selectedVehicle._id,
            type: maintenanceType,
            date: maintenanceDate,
            cost: maintenanceCost
        };

        axios.post("http://localhost:3004/addMaintenanceRecord", data)
            .then(res => {
                setMaintenanceRecords([...maintenanceRecords, data]);
                setMaintenanceType('');
                setMaintenanceDate('');
                setMaintenanceCost('');
                alert("Maintenance record added successfully");
            })
            .catch(err => {
                console.error(err);
                alert("Error adding maintenance record");
            });
    };

    const handleCloseModal = () => {
        setShowMaintenanceModal(false);
        setSelectedVehicle(null);
        setMaintenanceRecords([]);
    };

    if (loading) return <div className="loading-spinner">Loading...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="vehicles-container">
            <h2>Registered Vehicles</h2>
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
                </select>
            </div>

            <button onClick={handleAdd} className="add-vehicle-btn">Add Vehicle</button>

            <div className="vehicle-list">
                {filteredVehicles.map((vehicle) => (
                    <div key={vehicle._id} className="vehicle-card">
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
                            <button onClick={() => handleViewMaintenance(vehicle)} className="maintenance-btn">View/Add Maintenance</button>
                        </div>
                    </div>
                ))}
            </div>

            {showMaintenanceModal && (
                <div className="maintenance-modal">
                    <div className="maintenance-content">
                        <h3>Maintenance Records for {selectedVehicle.model}</h3>
                        <button className="close-btn" onClick={handleCloseModal}>Close</button>
                        
                        <h4>Add Maintenance</h4>
                        <input
                            type="text"
                            placeholder="Maintenance Type"
                            value={maintenanceType}
                            onChange={(e) => setMaintenanceType(e.target.value)}
                        />
                        <input
                            type="date"
                            value={maintenanceDate}
                            onChange={(e) => setMaintenanceDate(e.target.value)}
                        />
                        <input
                            type="number"
                            placeholder="Cost"
                            value={maintenanceCost}
                            onChange={(e) => setMaintenanceCost(e.target.value)}
                        />
                        <button onClick={handleAddMaintenance} className="add-maintenance-btn">Add Maintenance</button>

                        <h4>Maintenance History</h4>
                        <ul>
                            {maintenanceRecords.map((record, index) => (
                                <li key={index}>
                                    <p><strong>Type:</strong> {record.type}</p>
                                    <p><strong>Date:</strong> {new Date(record.date).toLocaleDateString()}</p>
                                    <p><strong>Cost:</strong> ${record.cost}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViewVehicles;
