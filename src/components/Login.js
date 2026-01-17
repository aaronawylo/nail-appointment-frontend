import React from 'react';
import { login } from '../auth';

const Login = () => {
    return (
        <div className="container">
            <h1>💅 Nail Appointment</h1>
            <p>Please log in to book an appointment</p>
            <button onClick={login}>Login</button>
        </div>
    );
};

export default Login;
