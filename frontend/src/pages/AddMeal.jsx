import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "../styles/AddMeal.css";

function AddMeal() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        calories: "",
        carbs: "",
        protein: "",
        fat: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError("");

        try {
            const {
                data: { session },
            } = await supabase.auth.getSession();

            if (!session) {
                navigate("/login");
                return;
            }

            const response = await fetch(
                "http://127.0.0.1:8000/api/meals/",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session.access_token}`,
                    },

                    body: JSON.stringify({
                        title: formData.title,
                        calories: Number(formData.calories),
                        carbs: Number(formData.carbs),
                        protein: Number(formData.protein),
                        fat: Number(formData.fat),
                        consumed_at: new Date().toISOString(),
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                console.error("FastAPI error:", data);

                setError(
                    data.detail ||
                        "Something went wrong while adding your meal."
                );

                return;
            }

            console.log("Meal created:", data);
            navigate("/");

        } catch (error) {
            console.error("Error adding meal:", error);

            setError(
                "Unable to connect to the server. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-meal-page">

            <div className="add-meal-card">

                <div className="add-meal-header">

                    <button
                        className="back-button"
                        onClick={() => navigate("/")}
                        type="button"
                    >
                        ← Back
                    </button>

                    <div className="add-meal-title">
                        <h1>Add a Meal</h1>

                        <p>
                            Log what you ate and keep track of
                            your nutrition.
                        </p>
                    </div>

                </div>

                {error && (
                    <div className="meal-error">
                        {error}
                    </div>
                )}

                <form
                    className="add-meal-form"
                    onSubmit={handleSubmit}
                >

                    <div className="form-group">

                        <label htmlFor="title">
                            Meal Title
                        </label>

                        <input
                            id="title"
                            name="title"
                            type="text"
                            placeholder="e.g. Chicken Rice"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <div className="form-group">

                        <label htmlFor="calories">
                            Calories
                        </label>

                        <div className="input-with-unit">

                            <input
                                id="calories"
                                name="calories"
                                type="number"
                                placeholder="500"
                                value={formData.calories}
                                onChange={handleChange}
                                min="0"
                                step="1"
                                required
                            />

                            <span>kcal</span>

                        </div>

                    </div>

                    <div className="macro-input-section">

                        <h2>Nutrition</h2>

                        <p>
                            Enter the nutritional values for
                            this meal.
                        </p>

                        <div className="macro-input-grid">

                            <div className="form-group">

                                <label htmlFor="carbs">
                                    Carbs
                                </label>

                                <div className="input-with-unit">

                                    <input
                                        id="carbs"
                                        name="carbs"
                                        type="number"
                                        placeholder="60"
                                        value={formData.carbs}
                                        onChange={handleChange}
                                        min="0"
                                        step="0.1"
                                        required
                                    />

                                    <span>g</span>

                                </div>

                            </div>

                            <div className="form-group">

                                <label htmlFor="protein">
                                    Protein
                                </label>

                                <div className="input-with-unit">

                                    <input
                                        id="protein"
                                        name="protein"
                                        type="number"
                                        placeholder="35"
                                        value={formData.protein}
                                        onChange={handleChange}
                                        min="0"
                                        step="0.1"
                                        required
                                    />

                                    <span>g</span>

                                </div>

                            </div>

                            <div className="form-group">

                                <label htmlFor="fat">
                                    Fat
                                </label>

                                <div className="input-with-unit">

                                    <input
                                        id="fat"
                                        name="fat"
                                        type="number"
                                        placeholder="15"
                                        value={formData.fat}
                                        onChange={handleChange}
                                        min="0"
                                        step="0.1"
                                        required
                                    />

                                    <span>g</span>

                                </div>

                            </div>

                        </div>

                    </div>

                    <div className="add-meal-actions">

                        <button
                            type="button"
                            className="cancel-button"
                            onClick={() => navigate("/")}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="add-meal-submit"
                            disabled={loading}
                        >
                            {loading
                                ? "Adding..."
                                : "Add Meal"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default AddMeal;