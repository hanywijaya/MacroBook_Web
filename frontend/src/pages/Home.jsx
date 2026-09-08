import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "../styles/Home.css";

function Home() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [meals, setMeals] = useState([]);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const {
                data: { session },
            } = await supabase.auth.getSession();

            if (!session) {
                navigate("/login");
                return;
            }

            const headers = {
                Authorization: `Bearer ${session.access_token}`,
            };

            const userResponse = await fetch(
                "/api/users/me",
                {
                    method: "GET",
                    headers,
                }
            );

            if (userResponse.status === 404) {
                navigate("/add-user");
                return;
            }

            if (!userResponse.ok) {
                throw new Error("Failed to fetch user");
            }

            const userData = await userResponse.json();

            console.log("User:", userData);

            setUser(userData);

            const mealsResponse = await fetch(
                "/api/meals/",
                {
                    method: "GET",
                    headers,
                }
            );

            if (!mealsResponse.ok) {
                throw new Error("Failed to fetch meals");
            }

            const mealsData = await mealsResponse.json();

            console.log("Meals:", mealsData);

            setMeals(mealsData);

            const activitiesResponse = await fetch(
                "/api/activities/",
                {
                    method: "GET",
                    headers,
                }
            );

            if (!activitiesResponse.ok) {
                throw new Error("Failed to fetch activities");
            }

            const activitiesData = await activitiesResponse.json();

            console.log("Activities:", activitiesData);

            setActivities(activitiesData);

        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();

        navigate("/login");
    };

    useEffect(() => {
        fetchData();
    }, []);

    const today = new Date();

    const todaysMeals = meals.filter((meal) => {
        const mealDate = new Date(meal.time);

        return (
            mealDate.getFullYear() === today.getFullYear() &&
            mealDate.getMonth() === today.getMonth() &&
            mealDate.getDate() === today.getDate()
        );
    });

    const todaysActivities = activities.filter((activity) => {
        const activityDate = new Date(activity.time);

        return (
            activityDate.getFullYear() === today.getFullYear() &&
            activityDate.getMonth() === today.getMonth() &&
            activityDate.getDate() === today.getDate()
        );
    });

    const todaysLogs = [
        ...todaysMeals.map((meal) => ({
            ...meal,
            type: "meal",
            timestamp: meal.time,
        })),

        ...todaysActivities.map((activity) => ({
            ...activity,
            type: "activity",
            timestamp: activity.time,
        })),
    ].sort(
        (a, b) =>
            new Date(a.timestamp) - new Date(b.timestamp)
    );

    const todayCalories = todaysMeals.reduce(
        (total, meal) => total + Number(meal.calories),
        0
    );

    const todayCaloriesBurned = todaysActivities.reduce(
        (total, activity) =>
            total + Number(activity.calories_burned),
        0
    );

    const netCalories = todayCalories - todayCaloriesBurned;

    const todayCarbs = todaysMeals.reduce(
        (total, meal) => total + Number(meal.carbs),
        0
    );

    const todayProtein = todaysMeals.reduce(
        (total, meal) => total + Number(meal.protein),
        0
    );

    const todayFat = todaysMeals.reduce(
        (total, meal) => total + Number(meal.fat),
        0
    );

    if (loading) {
        return (
            <div className="home-loading">
                <p>Loading MacroBook...</p>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    const calorieGoal = Number(user.maintenance);

    const caloriePercentage =
        calorieGoal > 0
            ? Math.min(
                  (todayCalories / calorieGoal) * 100,
                  100
              )
            : 0;

    const carbsPercentage =
        user.target_carbs > 0
            ? Math.min(
                  (todayCarbs / user.target_carbs) * 100,
                  100
              )
            : 0;

    const proteinPercentage =
        user.target_protein > 0
            ? Math.min(
                  (todayProtein / user.target_protein) * 100,
                  100
              )
            : 0;

    const fatPercentage =
        user.target_fat > 0
            ? Math.min(
                  (todayFat / user.target_fat) * 100,
                  100
              )
            : 0;

    return (
        <div className="home-page">

            <div className="home-container">

                {/* Header */}

                <header className="home-header">

                    <div>
                        <p className="home-greeting">
                            Good morning,
                        </p>

                        <h1>
                            {user.name} 👋
                        </h1>
                    </div>

                    <button
                        className="logout-button"
                        onClick={handleLogout}
                    >
                        Log out
                    </button>

                </header>


                {/* Quick Actions */}

                <div className="quick-actions">

                    <button
                        className="quick-action add-meal-button"
                        onClick={() => navigate("/add-meal")}
                    >
                        <span className="quick-action-icon">
                            ＋
                        </span>

                        Add Meal
                    </button>

                    <button
                        className="quick-action add-activity-button"
                        onClick={() => navigate("/add-activity")}
                    >
                        <span className="quick-action-icon">
                            ＋
                        </span>

                        Add Activity
                    </button>

                </div>


                {/* Calories */}

                <section className="calorie-card">

                    <div className="card-title">
                        Net calories today
                    </div>

                    <div className="calorie-content">

                        <div className="calorie-number">

                            <strong>
                                {Math.round(netCalories)}
                            </strong>

                            <span>
                                kcal
                            </span>

                        </div>


                        <div className="progress-bar">

                            <div
                                className="progress-fill"
                                style={{
                                    width: `${caloriePercentage}%`,
                                }}
                            />

                        </div>


                        <p className="remaining-calories">

                            {Math.max(
                                calorieGoal - netCalories,
                                0
                            ).toFixed(0)}{" "}
                            kcal remaining

                        </p>


                        <div className="calorie-summary">

                            <div className="calorie-summary-item">
                                <strong>
                                    {Math.round(todayCalories)}
                                </strong>

                                <span>
                                    kcal intake
                                </span>
                            </div>

                            <div className="calorie-summary-item">
                                <strong>
                                    {Math.round(todayCaloriesBurned)}
                                </strong>

                                <span>
                                    kcal burned
                                </span>
                            </div>

                        </div>

                    </div>

                </section>


                {/* Macros */}

                <section className="macro-section">

                    <div className="section-header">

                        <h2>
                            Today's Macros
                        </h2>

                    </div>


                    <div className="macro-grid">

                        {/* Carbs */}

                        <div className="macro-card">

                            <div className="macro-card-header">

                                <span>
                                    Carbs
                                </span>

                                <span>
                                    {Math.round(todayCarbs)}g
                                </span>

                            </div>

                            <div className="macro-progress">

                                <div
                                    style={{
                                        width: `${carbsPercentage}%`,
                                    }}
                                />

                            </div>

                            <p>
                                Goal: {user.target_carbs}g
                            </p>

                        </div>


                        {/* Protein */}

                        <div className="macro-card">

                            <div className="macro-card-header">

                                <span>
                                    Protein
                                </span>

                                <span>
                                    {Math.round(todayProtein)}g
                                </span>

                            </div>

                            <div className="macro-progress">

                                <div
                                    style={{
                                        width: `${proteinPercentage}%`,
                                    }}
                                />

                            </div>

                            <p>
                                Goal: {user.target_protein}g
                            </p>

                        </div>


                        {/* Fat */}

                        <div className="macro-card">

                            <div className="macro-card-header">

                                <span>
                                    Fat
                                </span>

                                <span>
                                    {Math.round(todayFat)}g
                                </span>

                            </div>

                            <div className="macro-progress">

                                <div
                                    style={{
                                        width: `${fatPercentage}%`,
                                    }}
                                />

                            </div>

                            <p>
                                Goal: {user.target_fat}g
                            </p>

                        </div>

                    </div>

                </section>


                {/* Today's Logs */}

                <section className="logs-section">

                    <div className="logs-header">

                        <h2>
                            Today's Logs
                        </h2>

                        <button
                            className="history-button"
                            onClick={() => navigate("/history")}
                        >
                            View History →
                        </button>

                    </div>


                    {todaysLogs.length === 0 ? (

                        <div className="empty-logs">

                            <div className="empty-icon">
                                📝
                            </div>

                            <h3>
                                No logs yet
                            </h3>

                            <p>
                                Start tracking your meals and
                                activities today.
                            </p>

                        </div>

                    ) : (

                        <div className="log-list">

                            {todaysLogs.map((log) => {

                                const isMeal =
                                    log.type === "meal";

                                return (
                                    <div
                                        className={`log-card ${log.type}`}
                                        key={`${log.type}-${log.id}`}
                                    >

                                        {/* Icon */}

                                        <div className="log-icon">

                                            {isMeal
                                                ? "🍴"
                                                : "🏃"}

                                        </div>


                                        {/* Log Information */}

                                        <div className="log-info">

                                            <p className="log-time">

                                                {new Date(
                                                    log.timestamp
                                                ).toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}

                                            </p>


                                            <h3>
                                                {log.title}
                                            </h3>


                                            <div className="log-type">

                                                {isMeal
                                                    ? "Intake"
                                                    : "Activity Burn"}

                                            </div>


                                            {/* Meal macros */}

                                            {isMeal && (

                                                <div className="log-macros">

                                                    <div className="log-macro">

                                                        <strong>
                                                            {Math.round(
                                                                Number(
                                                                    log.carbs
                                                                )
                                                            )}g
                                                        </strong>

                                                        <span>
                                                            Carbs
                                                        </span>

                                                    </div>


                                                    <div className="log-macro">

                                                        <strong>
                                                            {Math.round(
                                                                Number(
                                                                    log.protein
                                                                )
                                                            )}g
                                                        </strong>

                                                        <span>
                                                            Protein
                                                        </span>

                                                    </div>


                                                    <div className="log-macro">

                                                        <strong>
                                                            {Math.round(
                                                                Number(
                                                                    log.fat
                                                                )
                                                            )}g
                                                        </strong>

                                                        <span>
                                                            Fat
                                                        </span>

                                                    </div>

                                                </div>

                                            )}


                                            {log.note && (

                                                <span className="log-note">
                                                    {log.note}
                                                </span>

                                            )}

                                        </div>


                                        {/* Calories */}

                                        <div className="log-calories">

                                            <strong>

                                                {isMeal
                                                    ? "+"
                                                    : "−"}

                                                {Math.round(
                                                    isMeal
                                                        ? Number(
                                                              log.calories
                                                          )
                                                        : Number(
                                                              log.calories_burned
                                                          )
                                                )}

                                            </strong>

                                            <span>
                                                kcal
                                            </span>

                                        </div>

                                    </div>
                                );
                            })}

                        </div>

                    )}

                </section>

            </div>

        </div>
    );
}

export default Home;