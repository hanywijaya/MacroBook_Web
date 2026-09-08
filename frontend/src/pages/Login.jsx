import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "../styles/Auth.css"

function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        setError("");
    
        if (!formData.email.trim()) {
            setError("Please enter your email.");
            return;
        }
    
        if (!formData.password) {
            setError("Please enter your password.");
            return;
        }
    
        setLoading(true);
    
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password,
            });
    
            if (error) {
                if (error.message === "Invalid login credentials") {
                    setError("Incorrect email or password.");
                } else if (error.message === "Email not confirmed") {
                    setError("Please verify your email before logging in.");
                } else {
                    setError("Unable to log in. Please try again.");
                }
    
                return;
            }
    
            navigate("/");
    
        } catch (error) {
            console.error("Login error:", error);
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">

                <div className="auth-header">
                    <div className="logo">MacroBook</div>

                    <h1>Welcome back</h1>

                    <p>
                        Log in to continue tracking your macros.
                    </p>
                </div>

                <form
                    className="auth-form"
                    onSubmit={handleSubmit}
                >

                    {error && (
                        <div className="auth-error">
                            {error}
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="email">
                            Email
                        </label>

                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">

                        <div className="password-label">
                            <label htmlFor="password">
                                Password
                            </label>

                            <button
                                type="button"
                                className="forgot-password"
                            >
                                Forgot password?
                            </button>
                        </div>

                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <button
                        type="submit"
                        className="auth-button"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Log In"}
                    </button>

                </form>

                <div className="auth-footer">
                    <span>Don't have an account?</span>

                    <a href="/signup">
                        Sign up
                    </a>
                </div>

            </div>
        </div>
    );
}

export default Login;