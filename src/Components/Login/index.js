import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import "./index.css"; 

const Login = () => {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [emptyName, setEmptyName] = useState(false);
    const [emptyPassword, setEmptyPassword] = useState(false);
    const [emailInvalid, setEmailInvalid] = useState(false);
    const [passwordInvalid, setPasswordInvalid] = useState(false);
    const [code, setCode] = useState(200);
    const navigate = useNavigate();

    const onChangeUsername = (e) => {
        setUserName(e.target.value);
    };

    const onChangePassword = (e) => {
        setPassword(e.target.value);
    };

    const validateEmail = (email) => {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regex.test(email);
    };

    const validatePassword = (password) => {
        const regex = /(?=.*[0-9])/;
        return regex.test(password);
    };

    const onSubmitLoginForm = async (e) => {
        e.preventDefault();

        if (!validateEmail(userName)) {
            setEmailInvalid(true);
        } else {
            setEmailInvalid(false);
        }

        if (!validatePassword(password)) {
            setPasswordInvalid(true);
        } else {
            setPasswordInvalid(false);
        }

        if (userName === "" && password === "") {
            setEmptyName(true);
            setEmptyPassword(true);
        } else if (userName === "") {
            setEmptyName(true);
        } else if (password === "") {
            setEmptyPassword(true);
        } else if (validateEmail(userName) && validatePassword(password)) {
            const user = { userName, password };
            const options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user),
            };
            const response = await fetch("/login", options);
            const data = await response.json();

            if (response.ok) {
                Cookies.set('token', data.token, { expires: 7 });
                alert('Login successful!');
            } else {
                alert('Login failed: ' + data.message);
            }

            navigate("/");

            setUserName("");
            setPassword("");
            setEmptyName(false);
            setEmptyPassword(false);
            setCode(response.status);
        }
    };

    return (
        <div className="box">
            <div className="login-div">
                <h3 className="heading-login">Login</h3>
                <form onSubmit={onSubmitLoginForm}>
                    <label htmlFor="username">UserName (Email)</label>
                    <input 
                        value={userName} 
                        onChange={onChangeUsername} 
                        className="input" 
                        id="username" 
                        type="text"  placeholder="Please enter your Email-ID"
                    />
                    {emptyName && <p className="error">*Enter username</p>}
                    {emailInvalid && <p className="error">*Invalid email format</p>}

                    <label htmlFor="password">Password</label>
                    <input 
                        value={password} 
                        onChange={onChangePassword} 
                        className="input" 
                        id="password" 
                        type="password" placeholder="Please enter your Password"
                    />
                    {emptyPassword && <p className="error">*Enter password</p>}
                    {passwordInvalid && <p className="error">*Please enter your Password only </p>}

                    <button className="login-button" type="submit">Login</button>
                    {code !== 200 && <p className="error-2">*Incorrect user details</p>}
                </form>
                <div style={{ textAlign: "center" }}>
                    <button 
                        onClick={() => navigate("/register")}
                        className="signup-button"
                    >
                        Sign Up
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
