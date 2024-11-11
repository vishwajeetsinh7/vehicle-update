import '../LoginRegister/LoginRegister.css';
import React, { useState } from 'react'; 
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();


    const validate = () => {
        const newErrors = {};
        if (!email) newErrors.email = 'Email is required';
        if (!password) newErrors.password = 'Password is required';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            // Handle successful login (e.g., API call)
            let values = {email,password};

            axios.post("http://localhost:3004/login",values)
            .then(res=> {
                if(res.data ==="Success"){
                    sessionStorage.setItem('email',email);
                    if(sessionStorage.getItem('email')){

                        navigate("/home");
                    }
                }
                else{
                    alert("No Record Exist.")
                }
            })
            .catch(err => console.log(err));
        }
    };

    return (
        <div className="form-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
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
                <button type="submit" className='submit-button'>Login</button>

                <p>Don't have an account? <Link to='/register'>Create Account</Link></p>
            </form>
        </div>
    );
};

export default Login;
