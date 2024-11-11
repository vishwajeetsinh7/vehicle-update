import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ViewVehicles.css';

const ViewVehicles = () => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [email, setEmail] = useState(sessionStorage.getItem('email'));
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:8081/viewVehicles", {
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
    }, []);

    const handleUpdate = (id) => {
        // Update logic here
        navigate(`/updateVehicle/${id}`);
    };

    const handleDelete = (id) => {
        // Delete logic here
        const confirmDelete = window.confirm("Are you sure you want to delete this vehicle?");
        if (confirmDelete) {
            axios.delete(`http://localhost:8081/deleteVehicle/${id}`)
                .then(res => {
                    if (res.data === "Error Deleting Vehicle") {
                        alert("Error deleting vehicle");
                    } else {
                        // Filter out the deleted vehicle from the state
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

    const handleadd = ()=>{
        navigate(`/addVehicle`)
    }
    const registeredVehicles = [];

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="vehicles-container">
            <h2>Registered Vehicles</h2>
            <br />
            <button onClick={() => handleadd()}>Add Vehicle</button>

            <br />

            <table>
                <thead>
                    <tr>
                        <th>Model</th>
                        <th>Registration Number</th>
                        <th>Type</th>
                        <th>Purchase Date</th>
                        <th>Image</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {vehicles.map((vehicle) => (
                        <tr key={vehicle.id}>
                            <td>{vehicle.model}</td>
                            <td>{vehicle.number}{registeredVehicles.push(vehicle.number)}</td>
                            <td>{vehicle.type}</td>
                            <td>{vehicle.pdate}</td>
                            <td>
                                <img
                                    src={`http://localhost:8081/${vehicle.image}`}
                                    alt={vehicle.model}
                                    style={{ width: '100px' }}
                                />
                            </td>
                            <td>
                                <button onClick={() => handleUpdate(vehicle.id)}>Update</button>
                                <button onClick={() => handleDelete(vehicle.id)}>Delete</button>
                                
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ViewVehicles;
