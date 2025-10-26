// Nutrition Page JavaScript Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize nutrition page
    initializeNutritionPage();
    loadNutritionData();
    setupEventListeners();
});

// Initialize nutrition page
function initializeNutritionPage() {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    
    if (!isLoggedIn) {
        // Redirect to registration if not logged in
        alert('Please register first to access nutrition tracking.');
        window.location.href = 'index.html#register1';
        return;
    }
    
    // Initialize nutrition goals if not set
    if (!localStorage.getItem('nutritionGoals')) {
        initializeDefaultGoals();
    }
    
    // Initialize meal plan calendar
    initializeMealPlanCalendar();
}

// Initialize default nutrition goals
function initializeDefaultGoals() {
    const defaultGoals = {
        calories: 2000,
        protein: 150,
        water: 8,
        carbs: 250,
        fat: 65
    };
    localStorage.setItem('nutritionGoals', JSON.stringify(defaultGoals));
}

// Load all nutrition data
function loadNutritionData() {
    loadTodayNutrition();
    loadTodaysMeals();
    loadNutritionGoals();
    updateProgressBars();
}

// Load today's nutrition overview
function loadTodayNutrition() {
    const today = new Date().toDateString();
    const meals = JSON.parse(localStorage.getItem('userMeals') || '[]');
    const water = JSON.parse(localStorage.getItem('userWater') || '[]');
    
    // Filter today's meals
    const todaysMeals = meals.filter(meal => 
        new Date(meal.date).toDateString() === today
    );
    
    // Filter today's water intake
    const todaysWater = water.filter(entry => 
        new Date(entry.date).toDateString() === today
    );
    
    // Calculate totals
    const totalCalories = todaysMeals.reduce((sum, meal) => sum + (meal.calories || 0), 0);
    const totalProtein = todaysMeals.reduce((sum, meal) => sum + (meal.protein || 0), 0);
    const totalWater = todaysWater.reduce((sum, entry) => sum + (entry.amount || 0), 0);
    
    // Update display
    document.getElementById('caloriesConsumed').textContent = totalCalories;
    document.getElementById('proteinConsumed').textContent = totalProtein + 'g';
    document.getElementById('waterConsumed').textContent = totalWater;
    
    // Update progress bars
    updateProgressBars();
}

// Update progress bars
function updateProgressBars() {
    const goals = JSON.parse(localStorage.getItem('nutritionGoals') || '{}');
    const today = new Date().toDateString();
    const meals = JSON.parse(localStorage.getItem('userMeals') || '[]');
    const water = JSON.parse(localStorage.getItem('userWater') || '[]');
    
    const todaysMeals = meals.filter(meal => 
        new Date(meal.date).toDateString() === today
    );
    const todaysWater = water.filter(entry => 
        new Date(entry.date).toDateString() === today
    );
    
    const totalCalories = todaysMeals.reduce((sum, meal) => sum + (meal.calories || 0), 0);
    const totalProtein = todaysMeals.reduce((sum, meal) => sum + (meal.protein || 0), 0);
    const totalWater = todaysWater.reduce((sum, entry) => sum + (entry.amount || 0), 0);
    
    // Update progress bars
    const caloriesProgress = Math.min((totalCalories / (goals.calories || 2000)) * 100, 100);
    const proteinProgress = Math.min((totalProtein / (goals.protein || 150)) * 100, 100);
    const waterProgress = Math.min((totalWater / (goals.water || 8)) * 100, 100);
    
    document.getElementById('caloriesProgress').style.width = caloriesProgress + '%';
    document.getElementById('proteinProgress').style.width = proteinProgress + '%';
    document.getElementById('waterProgress').style.width = waterProgress + '%';
}

// Load today's meals
function loadTodaysMeals() {
    const today = new Date().toDateString();
    const meals = JSON.parse(localStorage.getItem('userMeals') || '[]');
    const todaysMeals = meals.filter(meal => 
        new Date(meal.date).toDateString() === today
    );
    
    const mealsList = document.getElementById('mealsList');
    
    if (todaysMeals.length === 0) {
        mealsList.innerHTML = `
            <div class="no-meals">
                <i class="fas fa-info-circle"></i>
                <p>No meals logged today. Start tracking your nutrition!</p>
            </div>
        `;
        return;
    }
    
    mealsList.innerHTML = todaysMeals.map(meal => `
        <div class="meal-item">
            <div class="meal-icon">
                <i class="fas fa-utensils"></i>
            </div>
            <div class="meal-info">
                <h4>${meal.foodItem}</h4>
                <p>${meal.type.charAt(0).toUpperCase() + meal.type.slice(1)} • ${meal.calories} cal</p>
                <p>Protein: ${meal.protein || 0}g • Carbs: ${meal.carbs || 0}g • Fat: ${meal.fat || 0}g</p>
            </div>
            <div class="meal-calories">${meal.calories} cal</div>
        </div>
    `).join('');
}

// Load nutrition goals
function loadNutritionGoals() {
    const goals = JSON.parse(localStorage.getItem('nutritionGoals') || '{}');
    const goalsList = document.getElementById('nutritionGoals');
    
    if (Object.keys(goals).length === 0) {
        goalsList.innerHTML = `
            <div class="no-goals">
                <i class="fas fa-bullseye"></i>
                <p>Set your nutrition goals to get started!</p>
            </div>
        `;
        return;
    }
    
    goalsList.innerHTML = Object.entries(goals).map(([key, value]) => `
        <div class="goal-item">
            <div class="goal-icon">
                <i class="fas fa-target"></i>
            </div>
            <div class="goal-info">
                <h4>${key.charAt(0).toUpperCase() + key.slice(1)} Goal</h4>
                <p>Target: ${value} ${key === 'water' ? 'glasses' : key === 'calories' ? 'cal' : 'g'}</p>
            </div>
        </div>
    `).join('');
}

// Initialize meal plan calendar
function initializeMealPlanCalendar() {
    const today = new Date();
    const currentWeek = getWeekDates(today);
    
    document.getElementById('currentWeek').textContent = 
        `Week of ${currentWeek[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    
    const calendarGrid = document.getElementById('calendarGrid');
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    calendarGrid.innerHTML = currentWeek.map((date, index) => {
        const dayName = days[date.getDay()];
        const dayNumber = date.getDate();
        const isToday = date.toDateString() === today.toDateString();
        
        return `
            <div class="calendar-day ${isToday ? 'today' : ''}">
                <h5>${dayName}</h5>
                <p>${dayNumber}</p>
                <div class="day-meals">
                    <!-- Meals will be populated by JavaScript -->
                </div>
            </div>
        `;
    }).join('');
}

// Get week dates for a given date
function getWeekDates(date) {
    const week = [];
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    
    for (let i = 0; i < 7; i++) {
        const day = new Date(startOfWeek);
        day.setDate(startOfWeek.getDate() + i);
        week.push(day);
    }
    
    return week;
}

// Setup event listeners
function setupEventListeners() {
    // Meal form submission
    document.getElementById('mealForm').addEventListener('submit', function(e) {
        e.preventDefault();
        logMeal();
    });
    
    // Water form submission
    document.getElementById('waterForm').addEventListener('submit', function(e) {
        e.preventDefault();
        logWater();
    });
}

// Modal functions
function openMealLogger() {
    document.getElementById('mealModal').style.display = 'block';
}

function closeMealLogger() {
    document.getElementById('mealModal').style.display = 'none';
    document.getElementById('mealForm').reset();
}

function openWaterTracker() {
    document.getElementById('waterModal').style.display = 'block';
    // Set current time
    const now = new Date();
    const timeString = now.toTimeString().slice(0, 5);
    document.getElementById('waterTime').value = timeString;
}

function closeWaterTracker() {
    document.getElementById('waterModal').style.display = 'none';
    document.getElementById('waterForm').reset();
}

function openMealPlanner() {
    document.getElementById('plannerModal').style.display = 'block';
    initializePlannerCalendar();
}

function closeMealPlanner() {
    document.getElementById('plannerModal').style.display = 'none';
}

function openRecipeFinder() {
    document.getElementById('recipeModal').style.display = 'block';
}

function closeRecipeFinder() {
    document.getElementById('recipeModal').style.display = 'none';
}

// Log meal
function logMeal() {
    const mealData = {
        id: Date.now(),
        type: document.getElementById('mealType').value,
        foodItem: document.getElementById('foodItem').value,
        calories: parseInt(document.getElementById('mealCalories').value),
        protein: parseFloat(document.getElementById('mealProtein').value) || 0,
        carbs: parseFloat(document.getElementById('mealCarbs').value) || 0,
        fat: parseFloat(document.getElementById('mealFat').value) || 0,
        notes: document.getElementById('mealNotes').value,
        date: new Date().toISOString()
    };
    
    const meals = JSON.parse(localStorage.getItem('userMeals') || '[]');
    meals.push(mealData);
    localStorage.setItem('userMeals', JSON.stringify(meals));
    
    showSuccessNotification('Meal logged successfully!');
    closeMealLogger();
    loadNutritionData(); // Refresh data
}

// Log water
function logWater() {
    const waterData = {
        id: Date.now(),
        amount: parseInt(document.getElementById('waterAmount').value),
        time: document.getElementById('waterTime').value,
        notes: document.getElementById('waterNotes').value,
        date: new Date().toISOString()
    };
    
    const water = JSON.parse(localStorage.getItem('userWater') || '[]');
    water.push(waterData);
    localStorage.setItem('userWater', JSON.stringify(water));
    
    showSuccessNotification('Water intake logged successfully!');
    closeWaterTracker();
    loadNutritionData(); // Refresh data
}

// Initialize planner calendar
function initializePlannerCalendar() {
    const today = new Date();
    const currentWeek = getWeekDates(today);
    const plannerCalendar = document.getElementById('plannerCalendar');
    
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    plannerCalendar.innerHTML = currentWeek.map((date, index) => {
        const dayName = days[date.getDay()];
        const dayNumber = date.getDate();
        const isToday = date.toDateString() === today.toDateString();
        
        return `
            <div class="calendar-day ${isToday ? 'today' : ''}" data-date="${date.toISOString().split('T')[0]}">
                <h5>${dayName}</h5>
                <p>${dayNumber}</p>
                <div class="day-meals">
                    <div class="meal-slot" data-meal="breakfast">
                        <small>Breakfast</small>
                        <div class="planned-meal"></div>
                    </div>
                    <div class="meal-slot" data-meal="lunch">
                        <small>Lunch</small>
                        <div class="planned-meal"></div>
                    </div>
                    <div class="meal-slot" data-meal="dinner">
                        <small>Dinner</small>
                        <div class="planned-meal"></div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Add recipe to meal plan
function addRecipeToPlan(mealType, recipeName, calories) {
    // This would integrate with the meal planning system
    showSuccessNotification(`${recipeName} added to ${mealType} plan!`);
}

// Search recipes
function searchRecipes() {
    const dietType = document.getElementById('dietType').value;
    const maxCalories = document.getElementById('maxCalories').value;
    
    // Simulate recipe search
    const recipes = [
        {
            name: 'Greek Yogurt Parfait',
            description: 'High protein breakfast with berries',
            calories: 250,
            time: '10 min',
            protein: '20g',
            image: './images/2.jpg'
        },
        {
            name: 'Quinoa Power Bowl',
            description: 'Nutritious lunch with vegetables',
            calories: 450,
            time: '25 min',
            protein: '15g',
            image: './images/3.jpg'
        },
        {
            name: 'Grilled Salmon',
            description: 'Omega-3 rich dinner option',
            calories: 320,
            time: '20 min',
            protein: '35g',
            image: './images/4.jpg'
        }
    ];
    
    let filteredRecipes = recipes;
    
    if (maxCalories) {
        filteredRecipes = filteredRecipes.filter(recipe => recipe.calories <= parseInt(maxCalories));
    }
    
    displayRecipeResults(filteredRecipes);
}

// Display recipe results
function displayRecipeResults(recipes) {
    const resultsContainer = document.getElementById('recipeResults');
    
    resultsContainer.innerHTML = recipes.map(recipe => `
        <div class="recipe-card">
            <img src="${recipe.image}" alt="${recipe.name}">
            <div class="recipe-details">
                <h4>${recipe.name}</h4>
                <p>${recipe.description}</p>
                <div class="recipe-meta">
                    <span><i class="fas fa-clock"></i> ${recipe.time}</span>
                    <span><i class="fas fa-fire"></i> ${recipe.calories} cal</span>
                    <span><i class="fas fa-drumstick-bite"></i> ${recipe.protein}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Navigation functions for calendar
function previousWeek() {
    // Implement previous week navigation
    showSuccessNotification('Previous week loaded!');
}

function nextWeek() {
    // Implement next week navigation
    showSuccessNotification('Next week loaded!');
}

// Show success notification
function showSuccessNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 1rem 2rem;
        border-radius: 0.5rem;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10001;
        font-size: 1.2rem;
        animation: slideIn 0.3s ease;
    `;
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i> 
        ${message}
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Close modals when clicking outside
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    .calendar-day.today {
        border-color: yellowgreen !important;
        background: #f0f8e0;
    }
    .meal-slot {
        margin: 0.3rem 0;
        padding: 0.3rem;
        background: white;
        border-radius: 0.3rem;
        border: 1px solid #eee;
    }
    .planned-meal {
        font-size: 0.7rem;
        color: #666;
        margin-top: 0.2rem;
    }
`;
document.head.appendChild(style);

