import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AddUpdateVehicle.css';

const UpdateVehicle = () => {
    const { id } = useParams();
    const [email, setEmail] = useState(sessionStorage.getItem('email'));
    const [model, setModel] = useState('');
    const [registrationNumber, setRegistrationNumber] = useState('');
    const [vehicleType, setVehicleType] = useState('');
    const [purchaseDate, setPurchaseDate] = useState('');
    const [imageUrl, setImageUrl] = useState('');  // Changed to image URL
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch current vehicle details by ID
        axios.get(`http://localhost:3004/getVehicle/${id}`)
            .then(res => {
                const vehicle = res.data;
                setModel(vehicle.model);
                setRegistrationNumber(vehicle.number);
                setVehicleType(vehicle.type);
                setPurchaseDate(vehicle.pdate);
                setImageUrl(vehicle.image);  // Initialize with current image URL
            })
            .catch(err => console.log(err));
    }, [id]);

    const validate = () => {
        const newErrors = {};
        const regNumberRegex = /^[A-Z0-9-]+$/; // Regex for vehicle registration number

        if (!model) newErrors.model = 'Vehicle Model is required';
        if (!registrationNumber) newErrors.registrationNumber = 'Vehicle Registration Number is required';
        else if (!regNumberRegex.test(registrationNumber)) newErrors.registrationNumber = 'Invalid Registration Number format';
        if (!vehicleType) newErrors.vehicleType = 'Vehicle Type is required';
        if (!purchaseDate) newErrors.purchaseDate = 'Purchase Date is required';
        if (!imageUrl) newErrors.imageUrl = 'Vehicle Image URL is required';  // Validation for URL

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            const updatedValues = { id, email, model, registrationNumber, vehicleType, purchaseDate, imageUrl };

            axios.put("http://localhost:3004/updateVehicle", updatedValues)
                .then(res => {
                    if (res.data === "Error Updating Vehicle") {
                        alert("Error Updating Vehicle");
                    } else {
                        navigate("/home");
                    }
                })
                .catch(err => console.log(err));
        }
    };

    return (
        <div className="form-container">
            <h2>Update Vehicle</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-item">
                    <label htmlFor="model">Vehicle Model:</label>
                    <input
                        type="text"
                        id="model"
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                    />
                    {errors.model && <span className="error">{errors.model}</span>}
                </div>
                <div className="form-item">
                    <label htmlFor="registrationNumber">Vehicle Registration Number:</label>
                    <input
                        type="text"
                        id="registrationNumber"
                        value={registrationNumber}
                        onChange={(e) => setRegistrationNumber(e.target.value)}
                    />
                    {errors.registrationNumber && <span className="error">{errors.registrationNumber}</span>}
                </div>
                <div className="form-item">
                    <label htmlFor="vehicleType">Vehicle Type:</label>
                    <select
                        id="vehicleType"
                        value={vehicleType}
                        onChange={(e) => setVehicleType(e.target.value)}
                    >
                        <option value="">Select Vehicle Type</option>
                        <option value="car">Car</option>
                        <option value="bike">Bike</option>
                        <option value="bicycle">Bicycle</option>
                        <option value="truck">Truck</option>
                        <option value="autorickshaw">Autorickshaw</option>
                    </select>
                    {errors.vehicleType && <span className="error">{errors.vehicleType}</span>}
                </div>
                <div className="form-item">
                    <label htmlFor="purchaseDate">Purchase Date:</label>
                    <input
                        type="date"
                        id="purchaseDate"
                        value={purchaseDate}
                        onChange={(e) => setPurchaseDate(e.target.value)}
                    />
                    {errors.purchaseDate && <span className="error">{errors.purchaseDate}</span>}
                </div>
                <div className="form-item">
                    <label htmlFor="imageUrl">Vehicle Image URL:</label>
                    <input
                        type="text"
                        id="imageUrl"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="Enter Image URL"
                    />
                    {errors.imageUrl && <span className="error">{errors.imageUrl}</span>}
                </div>
                <button type="submit" className="submit-button">Update Vehicle</button>
            </form>
        </div>
    );
};

export default UpdateVehicle;
