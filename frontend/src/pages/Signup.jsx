import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "../styles/Auth.css";

function Signup() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",

        name: "",
        age: "",
        gender: "",
        height: "",
        weight: "",

        maintenance: "",
        target_carbs: "",
        target_protein: "",
        target_fat: "",
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
        setLoading(true);

        try {
            if (formData.password !== formData.confirmPassword) {
                throw new Error("Passwords do not match.");
            }

            if (formData.password.length < 6) {
                throw new Error(
                    "Password must be at least 6 characters."
                );
            }

            const { data: authData, error: authError } =
                await supabase.auth.signUp({
                    email: formData.email,
                    password: formData.password,
                });

            if (authError) {
                throw authError;
            }

            if (!authData.session) {
                setError(
                    "Please check your email to confirm your account."
                );
                return;
            }

            const response = await fetch(
                "/api/users/",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization:
                            `Bearer ${authData.session.access_token}`,
                    },
                    body: JSON.stringify({
                        name: formData.name,
                        age: Number(formData.age),
                        gender: formData.gender,
                        height: Number(formData.height),
                        weight: Number(formData.weight),
                        maintenance:
                            Number(formData.maintenance),
                        target_carbs:
                            Number(formData.target_carbs),
                        target_protein:
                            Number(formData.target_protein),
                        target_fat:
                            Number(formData.target_fat),
                    }),
                }
            );

            if (!response.ok) {
                const data = await response.json();

                console.log(
                    "FastAPI error:",
                    JSON.stringify(data, null, 2)
                );

                throw new Error(
                    data.detail || "Failed to create profile."
                );
            }

            navigate("/");
        } catch (error) {
            console.error(error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signup-page">

            <div className="signup-container">

                <div className="signup-intro">

                    <div className="brand">
                        MacroBook
                    </div>

                    <div className="intro-content">

                        <span className="intro-label">
                            YOUR PERSONAL NUTRITION TRACKER
                        </span>

                        <h1>
                            Eat well.
                            <br />
                            Feel better.
                        </h1>

                        <p>
                            Set your goals and let MacroBook
                            help you stay on track, one meal
                            at a time.
                        </p>

                    </div>

                    <div className="intro-footer">
                        <span>Already have an account?</span>

                        <button
                            onClick={() => navigate("/login")}
                        >
                            Log in
                        </button>
                    </div>

                </div>

                <div className="signup-form-container">

                    <div className="signup-form-header">

                        <span className="step-label">
                            GET STARTED
                        </span>

                        <h2>
                            Create your MacroBook
                        </h2>

                        <p>
                            Tell us a little about yourself
                            so we can personalize your goals.
                        </p>

                    </div>


                    <form
                        className="signup-form"
                        onSubmit={handleSubmit}
                    >

                        {error && (
                            <div className="signup-error">
                                {error}
                            </div>
                        )}

                        <div className="form-section">

                            <div className="section-heading">
                                <span className="section-number">
                                    01
                                </span>

                                <div>
                                    <h3>Account</h3>
                                    <p>
                                        Create your account
                                    </p>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Email</label>

                                <input
                                    name="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-row">

                                <div className="form-group">
                                    <label>Password</label>

                                    <input
                                        name="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Confirm Password</label>

                                    <input
                                        name="confirmPassword"
                                        type="password"
                                        placeholder="••••••••"
                                        value={
                                            formData.confirmPassword
                                        }
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                            </div>

                        </div>

                        <div className="form-section">

                            <div className="section-heading">
                                <span className="section-number">
                                    02
                                </span>

                                <div>
                                    <h3>About You</h3>
                                    <p>
                                        Help us understand your body
                                    </p>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Name</label>

                                <input
                                    name="name"
                                    type="text"
                                    placeholder="Your name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-row">

                                <div className="form-group">
                                    <label>Age</label>

                                    <input
                                        name="age"
                                        type="number"
                                        placeholder="21"
                                        min="1"
                                        value={formData.age}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Gender</label>

                                    <div className="gender-options">

                                        <label className="gender-option">
                                            <input
                                                type="radio"
                                                name="gender"
                                                value="female"
                                                checked={
                                                    formData.gender ===
                                                    "female"
                                                }
                                                onChange={handleChange}
                                            />

                                            <span>Female</span>
                                        </label>

                                        <label className="gender-option">
                                            <input
                                                type="radio"
                                                name="gender"
                                                value="male"
                                                checked={
                                                    formData.gender ===
                                                    "male"
                                                }
                                                onChange={handleChange}
                                            />

                                            <span>Male</span>
                                        </label>

                                    </div>
                                </div>

                            </div>

                            <div className="form-row">

                                <div className="form-group">
                                    <label>Height</label>

                                    <div className="unit-input">
                                        <input
                                            name="height"
                                            type="number"
                                            placeholder="163"
                                            min="1"
                                            value={formData.height}
                                            onChange={handleChange}
                                            required
                                        />

                                        <span>cm</span>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Weight</label>

                                    <div className="unit-input">
                                        <input
                                            name="weight"
                                            type="number"
                                            placeholder="50"
                                            min="1"
                                            step="0.1"
                                            value={formData.weight}
                                            onChange={handleChange}
                                            required
                                        />

                                        <span>kg</span>
                                    </div>
                                </div>

                            </div>

                        </div>

                        <div className="form-section">

                            <div className="section-heading">
                                <span className="section-number">
                                    03
                                </span>

                                <div>
                                    <h3>Nutrition Goals</h3>
                                    <p>
                                        Set your daily targets
                                    </p>
                                </div>
                            </div>

                            <div className="calorie-input">

                                <div className="form-group">
                                    <label>
                                        Maintenance Calories
                                    </label>

                                    <div className="unit-input">
                                        <input
                                            name="maintenance"
                                            type="number"
                                            placeholder="1800"
                                            min="1"
                                            value={
                                                formData.maintenance
                                            }
                                            onChange={handleChange}
                                            required
                                        />

                                        <span>kcal</span>
                                    </div>
                                </div>

                            </div>

                            <div className="macro-inputs">

                                <div className="form-group">
                                    <label>Carbs</label>

                                    <div className="unit-input">
                                        <input
                                            name="target_carbs"
                                            type="number"
                                            placeholder="225"
                                            min="0"
                                            value={
                                                formData.target_carbs
                                            }
                                            onChange={handleChange}
                                            required
                                        />

                                        <span>g</span>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Protein</label>

                                    <div className="unit-input">
                                        <input
                                            name="target_protein"
                                            type="number"
                                            placeholder="120"
                                            min="0"
                                            value={
                                                formData.target_protein
                                            }
                                            onChange={handleChange}
                                            required
                                        />

                                        <span>g</span>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Fat</label>

                                    <div className="unit-input">
                                        <input
                                            name="target_fat"
                                            type="number"
                                            placeholder="60"
                                            min="0"
                                            value={
                                                formData.target_fat
                                            }
                                            onChange={handleChange}
                                            required
                                        />

                                        <span>g</span>
                                    </div>
                                </div>

                            </div>

                        </div>


                        <button
                            type="submit"
                            className="create-account-button"
                            disabled={loading}
                        >
                            {loading
                                ? "Creating your account..."
                                : "Create my account →"}
                        </button>

                        <p className="terms">
                            By creating an account, you agree to
                            MacroBook's terms and privacy policy.
                        </p>

                    </form>

                </div>

            </div>

        </div>
    );
}

export default Signup;