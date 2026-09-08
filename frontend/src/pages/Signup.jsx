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

        // Remove error once user starts correcting the form
        if (error) {
            setError("");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        // -------------------------
        // Client-side validation
        // -------------------------

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (formData.password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }

        if (!formData.gender) {
            setError("Please select your gender.");
            return;
        }

        if (Number(formData.age) <= 0) {
            setError("Please enter a valid age.");
            return;
        }

        if (Number(formData.height) <= 0) {
            setError("Please enter a valid height.");
            return;
        }

        if (Number(formData.weight) <= 0) {
            setError("Please enter a valid weight.");
            return;
        }

        if (Number(formData.maintenance) <= 0) {
            setError("Please enter your maintenance calories.");
            return;
        }

        setLoading(true);

        try {
            // -------------------------
            // Create Supabase account
            // -------------------------

            const { data: authData, error: authError } =
                await supabase.auth.signUp({
                    email: formData.email,
                    password: formData.password,
                });

            if (authError) {
                switch (authError.message) {
                    case "User already registered":
                        setError(
                            "An account with this email already exists."
                        );
                        break;

                    case "Password should be at least 8 characters":
                        setError(
                            "Password must be at least 8 characters."
                        );
                        break;

                    case "Unable to validate email address: invalid format":
                        setError(
                            "Please enter a valid email address."
                        );
                        break;

                    default:
                        setError(
                            "Unable to create your account. Please check your details and try again."
                        );
                }

                return;
            }

            // -------------------------
            // Email confirmation
            // -------------------------

            if (!authData.session) {
                setError(
                    "Your account was created! Please check your email to confirm your account."
                );

                return;
            }

            // -------------------------
            // Create user profile
            // -------------------------

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

                setError(
                    "Your account was created, but we couldn't finish setting up your profile. Please try again."
                );

                return;
            }

            navigate("/");

        } catch (error) {
            console.error("Signup error:", error);

            setError(
                "Something went wrong while creating your account. Please try again."
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signup-page">

            <div className="signup-container">

                {/* =========================
                    Left Introduction
                ========================= */}

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

                        <span>
                            Already have an account?
                        </span>

                        <button
                            type="button"
                            onClick={() => navigate("/login")}
                        >
                            Log in
                        </button>

                    </div>

                </div>


                {/* =========================
                    Signup Form
                ========================= */}

                <div className="signup-form-container">

                    <div className="signup-form-header">

                        <span className="step-label">
                            GET STARTED
                        </span>

                        <h2>
                            Create your MacroBook
                        </h2>

                        <p>
                            A few details will help us
                            personalize your daily goals.
                        </p>

                    </div>


                    <form
                        className="signup-form"
                        onSubmit={handleSubmit}
                    >

                        {/* =========================
                            Account
                        ========================= */}

                        <div className="form-section">

                            <div className="section-heading">

                                <span className="section-number">
                                    01
                                </span>

                                <div>
                                    <h3>
                                        Account
                                    </h3>

                                    <p>
                                        Create your login details
                                    </p>
                                </div>

                            </div>


                            <div className="form-group">

                                <label htmlFor="email">
                                    Email
                                </label>

                                <input
                                    id="email"
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

                                    <label htmlFor="password">
                                        Password
                                    </label>

                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        placeholder="At least 6 characters"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>


                                <div className="form-group">

                                    <label htmlFor="confirmPassword">
                                        Confirm password
                                    </label>

                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        placeholder="Repeat your password"
                                        value={
                                            formData.confirmPassword
                                        }
                                        onChange={handleChange}
                                        required
                                    />

                                </div>

                            </div>

                        </div>


                        {/* =========================
                            About You
                        ========================= */}

                        <div className="form-section">

                            <div className="section-heading">

                                <span className="section-number">
                                    02
                                </span>

                                <div>
                                    <h3>
                                        About You
                                    </h3>

                                    <p>
                                        Tell us a little about yourself
                                    </p>
                                </div>

                            </div>


                            <div className="form-group">

                                <label htmlFor="name">
                                    Name
                                </label>

                                <input
                                    id="name"
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

                                    <label htmlFor="age">
                                        Age
                                    </label>

                                    <input
                                        id="age"
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

                                    <label>
                                        Gender
                                    </label>

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

                                            <span>
                                                Female
                                            </span>

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

                                            <span>
                                                Male
                                            </span>

                                        </label>

                                    </div>

                                </div>

                            </div>


                            <div className="form-row">

                                <div className="form-group">

                                    <label htmlFor="height">
                                        Height
                                    </label>

                                    <div className="unit-input">

                                        <input
                                            id="height"
                                            name="height"
                                            type="number"
                                            placeholder="163"
                                            min="1"
                                            value={formData.height}
                                            onChange={handleChange}
                                            required
                                        />

                                        <span>
                                            cm
                                        </span>

                                    </div>

                                </div>


                                <div className="form-group">

                                    <label htmlFor="weight">
                                        Weight
                                    </label>

                                    <div className="unit-input">

                                        <input
                                            id="weight"
                                            name="weight"
                                            type="number"
                                            placeholder="50"
                                            min="1"
                                            step="0.1"
                                            value={formData.weight}
                                            onChange={handleChange}
                                            required
                                        />

                                        <span>
                                            kg
                                        </span>

                                    </div>

                                </div>

                            </div>

                        </div>


                        {/* =========================
                            Nutrition Goals
                        ========================= */}

                        <div className="form-section">

                            <div className="section-heading">

                                <span className="section-number">
                                    03
                                </span>

                                <div>
                                    <h3>
                                        Nutrition Goals
                                    </h3>

                                    <p>
                                        Set your daily targets
                                    </p>
                                </div>

                            </div>


                            <div className="form-group">

                                <label htmlFor="maintenance">
                                    Maintenance calories
                                </label>

                                <div className="unit-input">

                                    <input
                                        id="maintenance"
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

                                    <span>
                                        kcal
                                    </span>

                                </div>

                                <small className="input-hint">
                                    Your estimated daily calorie
                                    maintenance.
                                </small>

                            </div>


                            <div className="macro-inputs">

                                <div className="form-group">

                                    <label htmlFor="target_carbs">
                                        Carbs
                                    </label>

                                    <div className="unit-input">

                                        <input
                                            id="target_carbs"
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

                                        <span>
                                            g
                                        </span>

                                    </div>

                                </div>


                                <div className="form-group">

                                    <label htmlFor="target_protein">
                                        Protein
                                    </label>

                                    <div className="unit-input">

                                        <input
                                            id="target_protein"
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

                                        <span>
                                            g
                                        </span>

                                    </div>

                                </div>


                                <div className="form-group">

                                    <label htmlFor="target_fat">
                                        Fat
                                    </label>

                                    <div className="unit-input">

                                        <input
                                            id="target_fat"
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

                                        <span>
                                            g
                                        </span>

                                    </div>

                                </div>

                            </div>

                        </div>


                        {/* =========================
                            Error + Submit
                        ========================= */}

                        {error && (
                            <div
                                className="signup-error"
                                role="alert"
                            >
                                <span className="error-icon">
                                    !
                                </span>

                                <span>
                                    {error}
                                </span>
                            </div>
                        )}


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