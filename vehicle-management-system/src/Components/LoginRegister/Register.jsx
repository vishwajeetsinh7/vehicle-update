import '../LoginRegister/LoginRegister.css';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email regex
        const nameRegex = /^[a-zA-Z\s]+$/; // Name can only contain letters and spaces

        if (!name) newErrors.name = 'Name is required';
        else if (!nameRegex.test(name)) newErrors.name = 'Name can only contain letters and spaces';

        if (!email) newErrors.email = 'Email is required';
        else if (!emailRegex.test(email)) newErrors.email = 'Invalid email format';

        if (!password) newErrors.password = 'Password is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const resetData= ()=>{
        setEmail("");

    }
    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            let values = {name,email,password};

            axios.post("http://localhost:3004/register",values)
            .then(res=> {
                resetData();
                if(res.data==="Email already exists"){
                    
                    alert("Email already exists");
                }
                else if(res.data==="Database error"){
                    
                    alert("Database error");
                }
                else{
                    navigate("/");
                }
            })
            .catch(err => console.log(err));
        }
    };

    return (
        <div className="form-container">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-item">
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    {errors.name && <span className="error">{errors.name}</span>}
                </div>
                <div className="form-item">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {errors.email && <span className="error">{errors.email}</span>}
                </div>
                <div className="form-item">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {errors.password && <span className="error">{errors.password}</span>}
                </div>
                <button type="submit" className="submit-button">Register</button>

                <p>Already have an account? <Link to='/'>Log In</Link></p>

            </form>
        </div>
    );
};

export default Register;
