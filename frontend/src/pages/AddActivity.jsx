import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "../styles/AddActivity.css";

function AddActivity() {
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [caloriesBurned, setCaloriesBurned] = useState("");
    const [note, setNote] = useState("");
    const [time, setTime] = useState(
        new Date().toISOString().slice(0, 16)
    );

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim()) {
            setError("Please enter an activity.");
            return;
        }

        if (!caloriesBurned || Number(caloriesBurned) < 0) {
            setError("Please enter valid calories burned.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const {
                data: { session },
            } = await supabase.auth.getSession();

            if (!session) {
                navigate("/login");
                return;
            }

            const response = await fetch("/api/activities/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session.access_token}`,
                },
                body: JSON.stringify({
                    title: title.trim(),
                    calories_burned: Number(caloriesBurned),
                    note: note.trim() || null,
                    time: new Date(time).toISOString(),
                }),
            });

            if (!response.ok) {
                const data = await response.json().catch(() => null);
                throw new Error(
                    data?.detail || "Failed to add activity"
                );
            }

            navigate("/");
        } catch (error) {
            console.error("Error adding activity:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-activity-page">
            <div className="add-activity-container">

                <button
                    className="back-button"
                    onClick={() => navigate("/")}
                >
                    ← Back
                </button>

                <div className="add-activity-header">
                    <h1>Add Activity</h1>
                    <p>Track an activity and the calories you burned.</p>
                </div>

                <form
                    className="add-activity-form"
                    onSubmit={handleSubmit}
                >
                    <div className="form-group">
                        <label>Activity</label>
                        <input
                            type="text"
                            placeholder="e.g. Running, Walking, Cycling"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Calories Burned</label>
                        <div className="input-with-unit">
                            <input
                                type="number"
                                min="0"
                                step="1"
                                placeholder="300"
                                value={caloriesBurned}
                                onChange={(e) =>
                                    setCaloriesBurned(e.target.value)
                                }
                            />
                            <span>kcal</span>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Date & Time</label>
                        <input
                            type="datetime-local"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>
                            Note <span>(optional)</span>
                        </label>
                        <textarea
                            placeholder="Add a note about this activity..."
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            rows="4"
                        />
                    </div>

                    {error && (
                        <p className="form-error">{error}</p>
                    )}

                    <button
                        type="submit"
                        className="submit-activity-button"
                        disabled={loading}
                    >
                        {loading ? "Saving..." : "Add Activity"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AddActivity;