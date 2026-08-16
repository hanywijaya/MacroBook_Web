import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "../styles/History.css";

function History() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [meals, setMeals] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchHistory = async () => {
        try {
            const {
                data: { session },
            } = await supabase.auth.getSession();

            if (!session) {
                navigate("/login");
                return;
            }

            const userResponse = await fetch(
                "/api/users/me",
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${session.access_token}`,
                    },
                }
            );

            if (!userResponse.ok) {
                throw new Error("Failed to fetch user");
            }

            const userData = await userResponse.json();
            setUser(userData);

            const mealsResponse = await fetch(
                "/api/meals/",
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${session.access_token}`,
                    },
                }
            );

            if (!mealsResponse.ok) {
                throw new Error("Failed to fetch meals");
            }

            const mealsData = await mealsResponse.json();

            console.log("History meals:", mealsData);

            setMeals(mealsData);

        } catch (error) {
            console.error("Error fetching history:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    if (loading) {
        return (
            <div className="history-loading">
                <p>Loading history...</p>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    // Group meals by date
    const groupedMeals = meals.reduce((groups, meal) => {
        if (!meal.time) {
            return groups;
        }

        const date = new Date(meal.time);

        const dateKey = `${date.getFullYear()}-${String(
            date.getMonth() + 1
        ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

        if (!groups[dateKey]) {
            groups[dateKey] = [];
        }

        groups[dateKey].push(meal);

        return groups;
    }, {});

    // Sort newest date first
    const sortedDates = Object.keys(groupedMeals).sort(
        (a, b) => new Date(b) - new Date(a)
    );

    const formatDate = (dateString) => {
        const date = new Date(`${dateString}T00:00:00`);

        return date.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
        });
    };

    const formatTime = (time) => {
        return new Date(time).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
        });
    };

    const getDailyTotals = (dayMeals) => {
        return dayMeals.reduce(
            (totals, meal) => {
                totals.calories += Number(meal.calories) || 0;
                totals.carbs += Number(meal.carbs) || 0;
                totals.protein += Number(meal.protein) || 0;
                totals.fat += Number(meal.fat) || 0;

                return totals;
            },
            {
                calories: 0,
                carbs: 0,
                protein: 0,
                fat: 0,
            }
        );
    };

    return (
        <div className="history-page">

            <div className="history-container">

                {/* Header */}
                <header className="history-header">

                    <div className="history-header-left">
                        <p className="history-eyebrow">
                            MacroBook
                        </p>

                        <h1>History</h1>

                        <p className="history-subtitle">
                            Look back at your meals and nutrition over time.
                        </p>
                    </div>

                    <button
                        className="back-button"
                        onClick={() => navigate("/")}
                    >
                        ← Back to Home
                    </button>

                </header>


                {/* Empty State */}
                {sortedDates.length === 0 && (
                    <section className="history-empty">

                        <div className="history-empty-icon">
                            🍽️
                        </div>

                        <h2>No history yet</h2>

                        <p>
                            Your logged meals will appear here.
                        </p>

                        <button
                            className="history-primary-button"
                            onClick={() => navigate("/add-meal")}
                        >
                            Add a meal
                        </button>

                    </section>
                )}


                {/* History */}
                <div className="history-list">

                    {sortedDates.map((date) => {
                        const dayMeals = groupedMeals[date];
                        const totals = getDailyTotals(dayMeals);

                        const calorieDifference =
                            Number(user.maintenance) - totals.calories;

                        return (
                            <section
                                className="history-day"
                                key={date}
                            >

                                {/* Date */}
                                <div className="history-day-header">

                                    <div>
                                        <h2>
                                            {formatDate(date)}
                                        </h2>

                                        <span>
                                            {dayMeals.length}{" "}
                                            {dayMeals.length === 1
                                                ? "meal"
                                                : "meals"}
                                        </span>
                                    </div>

                                    <div className="daily-calories">
                                        <strong>
                                            {Math.round(totals.calories)}
                                        </strong>

                                        <span>
                                            / {Math.round(user.maintenance)} kcal
                                        </span>
                                    </div>

                                </div>


                                {/* Daily Macro Summary */}
                                <div className="history-summary">

                                    <div className="history-summary-item">
                                        <span>Carbs</span>
                                        <strong>
                                            {Math.round(totals.carbs)}g
                                        </strong>
                                    </div>

                                    <div className="history-summary-item">
                                        <span>Protein</span>
                                        <strong>
                                            {Math.round(totals.protein)}g
                                        </strong>
                                    </div>

                                    <div className="history-summary-item">
                                        <span>Fat</span>
                                        <strong>
                                            {Math.round(totals.fat)}g
                                        </strong>
                                    </div>

                                    <div className="history-summary-item">
                                        <span>
                                            {calorieDifference >= 0
                                                ? "Deficit"
                                                : "Over"}
                                        </span>

                                        <strong>
                                            {Math.abs(
                                                Math.round(calorieDifference)
                                            )}{" "}
                                            kcal
                                        </strong>
                                    </div>

                                </div>


                                {/* Meals */}
                                <div className="history-meals">

                                    {dayMeals
                                        .sort(
                                            (a, b) =>
                                                new Date(b.time) -
                                                new Date(a.time)
                                        )
                                        .map((meal) => (
                                            <div
                                                className="history-meal"
                                                key={meal.id}
                                            >

                                                <div className="meal-info">

                                                    <h3>
                                                        {meal.title}
                                                    </h3>

                                                    <span>
                                                        {formatTime(
                                                            meal.time
                                                        )}
                                                    </span>

                                                </div>

                                                <div className="meal-macros">

                                                    <div>
                                                        <strong>
                                                            {Math.round(
                                                                Number(
                                                                    meal.calories
                                                                )
                                                            )}
                                                        </strong>
                                                        <span>kcal</span>
                                                    </div>

                                                    <div>
                                                        <strong>
                                                            {Math.round(
                                                                Number(
                                                                    meal.carbs
                                                                )
                                                            )}
                                                            g
                                                        </strong>
                                                        <span>carbs</span>
                                                    </div>

                                                    <div>
                                                        <strong>
                                                            {Math.round(
                                                                Number(
                                                                    meal.protein
                                                                )
                                                            )}
                                                            g
                                                        </strong>
                                                        <span>protein</span>
                                                    </div>

                                                    <div>
                                                        <strong>
                                                            {Math.round(
                                                                Number(
                                                                    meal.fat
                                                                )
                                                            )}
                                                            g
                                                        </strong>
                                                        <span>fat</span>
                                                    </div>

                                                </div>

                                            </div>
                                        ))}

                                </div>

                            </section>
                        );
                    })}

                </div>

            </div>

        </div>
    );
}

export default History;