import { useState } from "react";
import "../styles/AddUser.css";

function AddUser() {
    const [formData, setFormData] = useState({
        name: "",
        age: "",
        gender: "",
        weight: "",
        height: "",
        maintenance: "",
        targetCarbs: "",
        targetProtein: "",
        targetFat: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userData = {
            name: formData.name,
            age: Number(formData.age),
            gender: formData.gender,
            height: Number(formData.height),
            weight: Number(formData.weight),
            maintenance: Number(formData.maintenance),
            targetCarbs: Number(formData.targetCarbs),
            targetProtein: Number(formData.targetProtein),
            targetFat: Number(formData.targetFat),
        };

        try {
            const response = await fetch("/api/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userData)
            });

            console.log(response)

            if(!response.ok) {
                throw new Error("Failed to create new user!");
            }

            const data = await response.json();

            console.log("User created: ", data);

        } catch(error) {
            console.error("Error creating user", error);
        }
    }

    return (
        <div className="add-user-page">
            <div className="add-user-card">
                <div className="add-user-header">
                <h1>Welcome to MacroBook</h1>
                <p>Let's get to know you so we can personalize your goals.</p>
                </div>

                <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="age">Age</label>
                        <input
                            id="age"
                            name="age"
                            type="number"
                            placeholder="Age"
                            value={formData.age}
                            onChange={handleChange}
                            min="1"
                            required
                        />
                    </div>

                    <div className="form-group">
                    <label>Gender</label>

                    <div className="gender-options">
                        <label className="radio-option">
                        <input
                            type="radio"
                            name="gender"
                            value="female"
                            checked={formData.gender === "female"}
                            onChange={handleChange}
                        />
                        <span>Female</span>
                        </label>

                        <label className="radio-option">
                        <input
                            type="radio"
                            name="gender"
                            value="male"
                            checked={formData.gender === "male"}
                            onChange={handleChange}
                        />
                        <span>Male</span>
                        </label>
                    </div>
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                    <label htmlFor="height">Height</label>

                    <div className="input-with-unit">
                        <input
                        id="height"
                        name="height"
                        type="number"
                        placeholder="163"
                        value={formData.height}
                        onChange={handleChange}
                        min="1"
                        required
                        />
                        <span>cm</span>
                    </div>
                    </div>

                    <div className="form-group">
                    <label htmlFor="weight">Weight</label>

                    <div className="input-with-unit">
                        <input
                        id="weight"
                        name="weight"
                        type="number"
                        placeholder="50"
                        value={formData.weight}
                        onChange={handleChange}
                        min="1"
                        step="0.1"
                        required
                        />
                        <span>kg</span>
                    </div>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="maintenance">
                        Maintenance Calories
                    </label>

                    <div className="input-with-unit">
                        <input
                            id="maintenance"
                            name="maintenance"
                            type="number"
                            placeholder="2000"
                            value={formData.maintenance}
                            onChange={handleChange}
                            min="1"
                            required
                        />
                        <span>kcal</span>
                    </div>
                    </div>

                    <div className="form-group">
                    <label>Daily Macro Targets</label>

                    <div className="macro-inputs">
                        <div className="input-with-unit">
                            <input
                                id="targetCarbs"
                                name="targetCarbs"
                                type="number"
                                placeholder="250"
                                value={formData.targetCarbs}
                                onChange={handleChange}
                                min="0"
                                step="0.1"
                                required
                            />
                            <span>g</span>
                        </div>

                        <div className="input-with-unit">
                            <input
                                id="targetProtein"
                                name="targetProtein"
                                type="number"
                                placeholder="120"
                                value={formData.targetProtein}
                                onChange={handleChange}
                                min="0"
                                step="0.1"
                                required
                            />
                            <span>g</span>
                        </div>

                        <div className="input-with-unit">
                            <input
                                id="targetFat"
                                name="targetFat"
                                type="number"
                                placeholder="60"
                                value={formData.targetFat}
                                onChange={handleChange}
                                min="0"
                                step="0.1"
                                required
                            />
                            <span>g</span>
                        </div>
                    </div>

                    <div className="macro-labels">
                        <span>Carbs</span>
                        <span>Protein</span>
                        <span>Fat</span>
                    </div>
                </div>

                <button type="submit" className="submit-button">
                    Continue
                </button>
                </form>
            </div>
        </div>
    );
}

export default AddUser;