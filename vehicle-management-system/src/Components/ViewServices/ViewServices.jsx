import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ViewServices.css';
import { useNavigate } from 'react-router-dom';

const ViewServices = () => {
    const [email, setEmail] = useState(sessionStorage.getItem('email'));
    const [errors, setErrors] = useState({});
    const [registrationNumbers, setRegistrationNumbers] = useState([]);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Fetch vehicle registrations from the backend
    useEffect(() => {
        axios.get('http://localhost:3004/viewRegisteredVehicles', {
            params: { email }
        })
            .then(res => {
                if (res.data === "Email is required") {
                    alert("Email is required");
                } else if (res.data === "Server Error") {
                    alert("Server Error");
                } else if (res.data !== "Error retrieving vehicles") {
                    setRegistrationNumbers(res.data);
                } else {
                    setErrors({ ...errors, vehicleRegistrations: "Error fetching vehicle registrations" });
                }
            })
            .catch(err => {
                console.log(err);
                setErrors({ ...errors, vehicleRegistrations: "Error fetching vehicle registrations" });
            });
    }, [email]);

    // Fetch maintenance records for each registration number one at a time
    useEffect(() => {
        const fetchServicesForNumber = async (number) => {
            try {
                const res = await axios.get("http://localhost:3004/viewServiceByNumber", {
                    params: { number },
                });

                if (res.data === "Error retrieving services") {
                    setError("Error fetching services for " + number);
                } else {
                    // Append new services to the existing list
                    setServices(prevServices => [...prevServices, ...res.data]);
                }
            } catch (err) {
                console.log(err);
                setError("Error fetching services for " + number);
            }
        };

        // Call the API for each registration number
        if (registrationNumbers.length > 0) {
            setLoading(true);
            registrationNumbers.forEach((number) => fetchServicesForNumber(number));
            setLoading(false);
        }
    }, [registrationNumbers]);

    const handleadd = ()=>{
      navigate(`/addService`)
  }
    

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (services.length === 0) return <div>No maintenance records found.</div>;

    return (
        <div className="services-container">
            <h2>Maintenance Records</h2>
            <br />
            <button onClick={() => handleadd()}>Add Service</button>

            <br />
            <br />
            {registrationNumbers.map((number) => (
                <div key={number} className="services-table">
                    <h3>Vehicle Registration Number: {number}</h3>
                    <table>
                        <thead>
                            <tr >
                                <th>Maintenance Type</th>
                                <th>Maintenance Date</th>
                                <th>Maintenance Cost</th>
                                
                            </tr>
                        </thead>
                        <tbody>
                            {services
                                .filter((service) => service.number === number)
                                .map((service) => (
                                    <tr key={service.id}>
                                        <td>{service.mtype}</td>
                                        <td>{service.mdate}</td>
                                        <td>{service.mcost}</td>
                                        
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            ))}
        </div>
    );
};

export default ViewServices;
