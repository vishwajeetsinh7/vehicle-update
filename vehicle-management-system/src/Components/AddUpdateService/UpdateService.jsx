import React, { useState } from 'react';

const UpdateService = ({ vehicleRegistrations }) => {
    const [maintenanceType, setMaintenanceType] = useState('');
    const [dateOfMaintenance, setDateOfMaintenance] = useState('');
    const [costOfMaintenance, setCostOfMaintenance] = useState('');
    const [registrationNumber, setRegistrationNumber] = useState('');
    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};
        const costRegex = /^\d+(\.\d{1,2})?$/; // Regex for valid cost format

        if (!maintenanceType) newErrors.maintenanceType = 'Maintenance Type is required';
        if (!dateOfMaintenance) newErrors.dateOfMaintenance = 'Date of Maintenance is required';
        if (!costOfMaintenance) newErrors.costOfMaintenance = 'Cost of Maintenance is required';
        else if (!costRegex.test(costOfMaintenance)) newErrors.costOfMaintenance = 'Invalid cost format';
        if (!registrationNumber) newErrors.registrationNumber = 'Vehicle Registration Number is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            

        }
    };

    return (
        <div className="form-container">
            <h2>Service Registration</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-item">
                    <label htmlFor="maintenanceType">Maintenance Type:</label>
                    <input
                        type="text"
                        id="maintenanceType"
                        value={maintenanceType}
                        onChange={(e) => setMaintenanceType(e.target.value)}
                    />
                    {errors.maintenanceType && <span className="error">{errors.maintenanceType}</span>}
                </div>
                <div className="form-item">
                    <label htmlFor="dateOfMaintenance">Date of Maintenance:</label>
                    <input
                        type="date"
                        id="dateOfMaintenance"
                        value={dateOfMaintenance}
                        onChange={(e) => setDateOfMaintenance(e.target.value)}
                    />
                    {errors.dateOfMaintenance && <span className="error">{errors.dateOfMaintenance}</span>}
                </div>
                <div className="form-item">
                    <label htmlFor="costOfMaintenance">Cost of Maintenance:</label>
                    <input
                        type="number"
                        id="costOfMaintenance"
                        value={costOfMaintenance}
                        onChange={(e) => setCostOfMaintenance(e.target.value)}
                    />
                    {errors.costOfMaintenance && <span className="error">{errors.costOfMaintenance}</span>}
                </div>
                <div className="form-item">
                    <label htmlFor="registrationNumber">Vehicle Registration Number:</label>
                    <select
                        id="registrationNumber"
                        value={registrationNumber}
                        onChange={(e) => setRegistrationNumber(e.target.value)}
                    >
                        <option value="">Select Vehicle Registration Number</option>
                        {vehicleRegistrations.map((reg) => (
                            <option key={reg} value={reg}>
                                {reg}
                            </option>
                        ))}
                    </select>
                    {errors.registrationNumber && <span className="error">{errors.registrationNumber}</span>}
                </div>
                <button type="submit" className="submit-button">Register Service</button>
            </form>
        </div>
    );
};

export default UpdateService;
