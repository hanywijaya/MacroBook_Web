import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "../styles/Home.css";

function Home() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [meals, setMeals] = useState([]);
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
                "http://127.0.0.1:8000/api/meals/",
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


    const todayCalories = todaysMeals.reduce(
        (total, meal) => total + Number(meal.calories),
        0
    );

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

                <section className="calorie-card">

                    <div className="card-title">
                        <span>Today's Calories</span>
                    </div>

                    <div className="calorie-content">

                        <div className="calorie-number">
                            <strong>
                                {Math.round(todayCalories)}
                            </strong>

                            <span>
                                {" "}
                                / {user.maintenance} kcal
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
                                calorieGoal - todayCalories,
                                0
                            ).toFixed(0)}{" "}
                            kcal remaining

                        </p>

                    </div>

                </section>


                <section className="macro-section">

                    <div className="section-header">
                        <h2>Today's Macros</h2>
                    </div>

                    <div className="macro-grid">

                        <div className="macro-card">

                            <div className="macro-card-header">
                                <span>Carbs</span>

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

                        <div className="macro-card">

                            <div className="macro-card-header">
                                <span>Protein</span>

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

                        <div className="macro-card">

                            <div className="macro-card-header">
                                <span>Fat</span>

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

                <section className="meals-section">

                    <div className="section-header">

                        <h2>Today's Meals</h2>

                        <button
                            className="history-button"
                            onClick={() => navigate("/history")}
                        >
                            History
                        </button>

                        <button
                            className="add-meal-button"
                            onClick={() =>
                                navigate("/add-meal")
                            }
                        >
                            + Add Meal
                        </button>

                    </div>

                    {todaysMeals.length === 0 ? (

                        <div className="empty-meals">

                            <div className="empty-icon">
                                🍽️
                            </div>

                            <h3>
                                No meals logged yet
                            </h3>

                            <p>
                                Start tracking what you eat today.
                            </p>

                            <button
                                className="primary-button"
                                onClick={() =>
                                    navigate("/add-meal")
                                }
                            >
                                Add your first meal
                            </button>

                        </div>

                    ) : (

                        <div className="meal-list">

                            {todaysMeals.map((meal) => (

                                <div
                                    className="meal-card"
                                    key={meal.id}
                                >

                                    <div className="meal-info">

                                        <h3>
                                            {meal.title}
                                        </h3>

                                        <p>
                                            {new Date(
                                                meal.time
                                            ).toLocaleTimeString(
                                                [],
                                                {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                }
                                            )}
                                        </p>

                                    </div>


                                    <div className="meal-nutrition">

                                        <div>
                                            <strong>
                                                {Math.round(
                                                    meal.calories
                                                )}
                                            </strong>

                                            <span>
                                                kcal
                                            </span>
                                        </div>

                                        <div>
                                            <strong>
                                                {Math.round(
                                                    meal.carbs
                                                )}g
                                            </strong>

                                            <span>
                                                carbs
                                            </span>
                                        </div>

                                        <div>
                                            <strong>
                                                {Math.round(
                                                    meal.protein
                                                )}g
                                            </strong>

                                            <span>
                                                protein
                                            </span>
                                        </div>

                                        <div>
                                            <strong>
                                                {Math.round(
                                                    meal.fat
                                                )}g
                                            </strong>

                                            <span>
                                                fat
                                            </span>
                                        </div>

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

                </section>

            </div>

        </div>
    );
}

export default Home;