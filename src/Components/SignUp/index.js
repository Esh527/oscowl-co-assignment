import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css"; 
const Register = () => {
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
        const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{5,})/; 
        return regex.test(password);
    };

    const onSubmitRegisterForm = async (e) => {
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
            const data = { userName, password };
            const options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            };
            const response = await fetch("/register", options);

            if (response.ok) {
                navigate("/login");
            }

            const { status } = response;
            setCode(status);

            setUserName("");
            setPassword("");
            setEmptyName(false);
            setEmptyPassword(false);
        }
    };

    const navigateToLogin =()=>{
        navigate("/login")
    }
    return (
        <div className="box">
            <div className="login-div">
                <h3 className="heading-login">Register</h3>
                <form onSubmit={onSubmitRegisterForm}>
                    <label htmlFor="username">UserName (Email)</label>
                    <input 
                        value={userName} 
                        onChange={onChangeUsername} 
                        className="input" 
                        id="username" 
                        type="text" placeholder="Please enter your Email-ID"
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
                    {passwordInvalid && <p className="error">*Password must be at least 5 characters, one number, and one special character</p>}

                    <button className="login-button" type="submit">Sign Up</button>
                    {code !== 200 && <p className="error-2">*This user already exists</p>}
                    <p>Already have an account? <span>Please <a onClick={navigateToLogin} className="click-here">Click Here</a></span></p>
                </form>
            </div>
        </div>
    );
};

export default Register;
