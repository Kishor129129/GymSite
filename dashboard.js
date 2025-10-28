// Dashboard JavaScript Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize dashboard
    initializeDashboard();
    loadDashboardData();
    setupEventListeners();
});

// Initialize dashboard components
function initializeDashboard() {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    
    if (!isLoggedIn) {
        // Redirect to registration if not logged in
        showToast.warning('Login Required', 'Please register first to access your dashboard.');
        setTimeout(() => {
            window.location.href = 'index.html#register1';
        }, 2000);
        return;
    }
    
    // Set member name
    const memberName = localStorage.getItem('memberName') || 'Member';
    document.getElementById('memberName').textContent = memberName;
}

// Load all dashboard data
function loadDashboardData() {
    loadMemberStats();
    loadRecentActivity();
    loadUpcomingClasses();
    loadProgressOverview();
    loadAchievements();
    loadCommunityActivity();
    loadSocialStats();
}

// Load member statistics
function loadMemberStats() {
    const workouts = JSON.parse(localStorage.getItem('userWorkouts') || '[]');
    const bookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
    
    // Calculate current streak
    const currentStreak = calculateCurrentStreak(workouts);
    document.getElementById('currentStreak').textContent = currentStreak;
    
    // Calculate workouts this week
    const workoutsThisWeek = calculateWorkoutsThisWeek(workouts);
    document.getElementById('workoutsThisWeek').textContent = workoutsThisWeek;
    
    // Calculate classes booked
    const classesBooked = bookings.length;
    document.getElementById('classesBooked').textContent = classesBooked;
}

// Calculate current workout streak
function calculateCurrentStreak(workouts) {
    if (workouts.length === 0) return 0;
    
    const today = new Date();
    let streak = 0;
    let currentDate = new Date(today);
    
    // Sort workouts by date (newest first)
    const sortedWorkouts = workouts.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    for (let workout of sortedWorkouts) {
        const workoutDate = new Date(workout.date);
        const daysDiff = Math.floor((currentDate - workoutDate) / (1000 * 60 * 60 * 24));
        
        if (daysDiff <= 1) {
            streak++;
            currentDate = workoutDate;
        } else {
            break;
        }
    }
    
    return streak;
}

// Calculate workouts this week
function calculateWorkoutsThisWeek(workouts) {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    
    return workouts.filter(workout => {
        const workoutDate = new Date(workout.date);
        return workoutDate >= startOfWeek;
    }).length;
}

// Load recent activity
function loadRecentActivity() {
    const workouts = JSON.parse(localStorage.getItem('userWorkouts') || '[]');
    const bookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
    
    // Combine and sort activities
    const activities = [];
    
    workouts.forEach(workout => {
        activities.push({
            type: 'workout',
            title: `${workout.type} Workout`,
            description: `${workout.duration} minutes - ${workout.intensity} intensity`,
            date: workout.date,
            icon: getWorkoutIcon(workout.type)
        });
    });
    
    bookings.forEach(booking => {
        activities.push({
            type: 'booking',
            title: `Booked ${booking.className}`,
            description: `${booking.day} at ${booking.time}`,
            date: booking.bookingDate,
            icon: 'fas fa-calendar-check'
        });
    });
    
    // Sort by date (newest first) and take last 5
    const recentActivities = activities
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);
    
    displayRecentActivity(recentActivities);
}

// Display recent activity
function displayRecentActivity(activities) {
    const container = document.getElementById('recentActivity');
    
    if (activities.length === 0) {
        container.innerHTML = `
            <div class="no-activity">
                <i class="fas fa-info-circle"></i>
                <p>No recent activity. Start your fitness journey!</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon">
                <i class="${activity.icon}"></i>
            </div>
            <div class="activity-info">
                <h4>${activity.title}</h4>
                <p>${activity.description}</p>
                <p><small>${new Date(activity.date).toLocaleDateString()}</small></p>
            </div>
        </div>
    `).join('');
}

// Get workout icon based on type
function getWorkoutIcon(type) {
    const icons = {
        'cardio': 'fas fa-heartbeat',
        'strength': 'fas fa-dumbbell',
        'yoga': 'fas fa-leaf',
        'boxing': 'fas fa-fist-raised',
        'pilates': 'fas fa-spa',
        'other': 'fas fa-running'
    };
    return icons[type] || 'fas fa-running';
}

// Load upcoming classes
function loadUpcomingClasses() {
    const bookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
    
    // Filter upcoming classes (simplified - in real app, you'd check actual dates)
    const upcomingClasses = bookings.slice(0, 3); // Show next 3 classes
    
    displayUpcomingClasses(upcomingClasses);
}

// Display upcoming classes
function displayUpcomingClasses(classes) {
    const container = document.getElementById('upcomingClasses');
    
    if (classes.length === 0) {
        container.innerHTML = `
            <div class="no-classes">
                <i class="fas fa-calendar-times"></i>
                <p>No upcoming classes. Book your first class!</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = classes.map(booking => `
        <div class="class-item">
            <div class="class-icon">
                <i class="fas fa-calendar-check"></i>
            </div>
            <div class="class-info">
                <h4>${booking.className}</h4>
                <p>${booking.day} at ${booking.time}</p>
                <p><small>Trainer: ${booking.trainer}</small></p>
            </div>
        </div>
    `).join('');
}

// Load progress overview
function loadProgressOverview() {
    const goals = JSON.parse(localStorage.getItem('userGoals') || '[]');
    const workouts = JSON.parse(localStorage.getItem('userWorkouts') || '[]');
    
    // Weight goal progress
    const weightGoal = goals.find(goal => goal.type === 'weight-loss' || goal.type === 'muscle-gain');
    if (weightGoal) {
        const progress = calculateWeightProgress(weightGoal);
        document.getElementById('weightProgress').style.width = `${progress}%`;
        document.getElementById('weightProgressText').textContent = `${progress}% Complete`;
    }
    
    // Workout consistency progress
    const consistencyProgress = calculateConsistencyProgress(workouts);
    document.getElementById('consistencyProgress').style.width = `${consistencyProgress}%`;
    document.getElementById('consistencyProgressText').textContent = `${consistencyProgress}% Complete`;
}

// Calculate weight progress
function calculateWeightProgress(goal) {
    if (!goal.current || !goal.target) return 0;
    
    const current = parseFloat(goal.current);
    const target = parseFloat(goal.target);
    
    if (goal.type === 'weight-loss') {
        // For weight loss, progress is based on how much weight lost
        const startWeight = current + (target - current);
        const progress = ((startWeight - current) / (startWeight - target)) * 100;
        return Math.min(Math.max(progress, 0), 100);
    } else {
        // For muscle gain, progress is based on how much weight gained
        const progress = ((current - goal.current) / (target - goal.current)) * 100;
        return Math.min(Math.max(progress, 0), 100);
    }
}

// Calculate consistency progress
function calculateConsistencyProgress(workouts) {
    if (workouts.length === 0) return 0;
    
    const last30Days = workouts.filter(workout => {
        const workoutDate = new Date(workout.date);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return workoutDate >= thirtyDaysAgo;
    });
    
    // Assume goal is 3 workouts per week (12 per month)
    const targetWorkouts = 12;
    const actualWorkouts = last30Days.length;
    
    return Math.min((actualWorkouts / targetWorkouts) * 100, 100);
}

// Load achievements
function loadAchievements() {
    const workouts = JSON.parse(localStorage.getItem('userWorkouts') || '[]');
    const bookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
    
    const achievements = [
        {
            id: 'first-workout',
            title: 'First Workout',
            icon: 'fas fa-fire',
            unlocked: workouts.length >= 1
        },
        {
            id: 'five-classes',
            title: '5 Classes',
            icon: 'fas fa-calendar-check',
            unlocked: bookings.length >= 5
        },
        {
            id: 'ten-workouts',
            title: '10 Workouts',
            icon: 'fas fa-dumbbell',
            unlocked: workouts.length >= 10
        },
        {
            id: 'thirty-streak',
            title: '30 Day Streak',
            icon: 'fas fa-star',
            unlocked: calculateCurrentStreak(workouts) >= 30
        }
    ];
    
    displayAchievements(achievements);
}

// Display achievements
function displayAchievements(achievements) {
    const container = document.getElementById('achievementsGrid');
    
    container.innerHTML = achievements.map(achievement => `
        <div class="achievement-item ${achievement.unlocked ? 'unlocked' : 'locked'}" 
             title="${achievement.unlocked ? 'Unlocked!' : 'Locked'}"
             onclick="showAchievementDetails('${achievement.id}')">
            <i class="${achievement.icon}"></i>
            <span>${achievement.title}</span>
        </div>
    `).join('');
}

// Show achievement details
function showAchievementDetails(achievementId) {
    const achievements = {
        'first-workout': 'Complete your first workout to unlock this achievement!',
        'five-classes': 'Book and attend 5 classes to unlock this achievement!',
        'ten-workouts': 'Complete 10 workouts to unlock this achievement!',
        'thirty-streak': 'Maintain a 30-day workout streak to unlock this achievement!'
    };
    
    showToast.info('Achievement Details', achievements[achievementId] || 'Achievement details not found.');
}

// Setup event listeners
function setupEventListeners() {
    // Workout form submission
    document.getElementById('workoutForm').addEventListener('submit', function(e) {
        e.preventDefault();
        logWorkout();
    });
    
    // Photo form submission
    document.getElementById('photoForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveProgressPhoto();
    });
    
    // Goal form submission
    document.getElementById('goalForm').addEventListener('submit', function(e) {
        e.preventDefault();
        setGoal();
    });
}

// Modal functions
function openWorkoutLogger() {
    document.getElementById('workoutModal').style.display = 'block';
}

function closeWorkoutLogger() {
    document.getElementById('workoutModal').style.display = 'none';
    document.getElementById('workoutForm').reset();
}

function openProgressPhotos() {
    document.getElementById('photoModal').style.display = 'block';
}

function closeProgressPhotos() {
    document.getElementById('photoModal').style.display = 'none';
    document.getElementById('photoForm').reset();
}

function openGoalSetter() {
    document.getElementById('goalModal').style.display = 'block';
}

function closeGoalSetter() {
    document.getElementById('goalModal').style.display = 'none';
    document.getElementById('goalForm').reset();
}

// Log workout
function logWorkout() {
    const workoutData = {
        id: Date.now(),
        type: document.getElementById('workoutType').value,
        duration: parseInt(document.getElementById('workoutDuration').value),
        intensity: document.getElementById('workoutIntensity').value,
        notes: document.getElementById('workoutNotes').value,
        date: new Date().toISOString()
    };
    
    const workouts = JSON.parse(localStorage.getItem('userWorkouts') || '[]');
    workouts.push(workoutData);
    localStorage.setItem('userWorkouts', JSON.stringify(workouts));
    
    showSuccessNotification('Workout logged successfully!');
    closeWorkoutLogger();
    loadDashboardData(); // Refresh dashboard
}

// Save progress photo
function saveProgressPhoto() {
    const photoData = {
        id: Date.now(),
        type: document.getElementById('photoType').value,
        weight: parseFloat(document.getElementById('photoWeight').value) || null,
        notes: document.getElementById('photoNotes').value,
        date: new Date().toISOString()
    };
    
    const photos = JSON.parse(localStorage.getItem('userPhotos') || '[]');
    photos.push(photoData);
    localStorage.setItem('userPhotos', JSON.stringify(photos));
    
    showSuccessNotification('Progress photo saved successfully!');
    closeProgressPhotos();
    loadDashboardData(); // Refresh dashboard
}

// Set goal
function setGoal() {
    const goalData = {
        id: Date.now(),
        type: document.getElementById('goalType').value,
        target: parseFloat(document.getElementById('goalTarget').value),
        current: parseFloat(document.getElementById('goalCurrent').value),
        targetDate: document.getElementById('goalDate').value,
        description: document.getElementById('goalDescription').value,
        createdAt: new Date().toISOString()
    };
    
    const goals = JSON.parse(localStorage.getItem('userGoals') || '[]');
    goals.push(goalData);
    localStorage.setItem('userGoals', JSON.stringify(goals));
    
    showSuccessNotification('Goal set successfully!');
    closeGoalSetter();
    loadDashboardData(); // Refresh dashboard
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
`;
document.head.appendChild(style);

// Load community activity
function loadCommunityActivity() {
    const posts = JSON.parse(localStorage.getItem('communityPosts') || '[]');
    const friends = JSON.parse(localStorage.getItem('communityFriends') || '[]');
    
    // Get recent posts from friends and user
    const recentPosts = posts
        .filter(post => post.userId === 'current_user' || friends.some(friend => friend.name === post.userName))
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 3);
    
    const container = document.getElementById('communityActivity');
    
    if (recentPosts.length === 0) {
        container.innerHTML = `
            <div class="no-community-activity">
                <i class="fas fa-info-circle"></i>
                <p>No recent community activity. Join the conversation!</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = recentPosts.map(post => `
        <div class="community-activity-item">
            <div class="activity-avatar">
                <img src="${post.userAvatar}" alt="${post.userName}">
            </div>
            <div class="activity-content">
                <h4>${post.userName}</h4>
                <p>${post.content.length > 50 ? post.content.substring(0, 50) + '...' : post.content}</p>
                <small>${formatTimestamp(post.timestamp)}</small>
            </div>
            <div class="activity-stats">
                <span><i class="fas fa-heart"></i> ${post.likes}</span>
                <span><i class="fas fa-comment"></i> ${post.comments}</span>
            </div>
        </div>
    `).join('');
}

// Load social statistics
function loadSocialStats() {
    const posts = JSON.parse(localStorage.getItem('communityPosts') || '[]');
    const friends = JSON.parse(localStorage.getItem('communityFriends') || '[]');
    
    // Calculate user's social stats
    const userPosts = posts.filter(post => post.userId === 'current_user');
    const totalLikes = userPosts.reduce((sum, post) => sum + post.likes, 0);
    const totalComments = userPosts.reduce((sum, post) => sum + post.comments, 0);
    const totalFriends = friends.length;
    
    document.getElementById('totalLikes').textContent = totalLikes;
    document.getElementById('totalComments').textContent = totalComments;
    document.getElementById('totalFriends').textContent = totalFriends;
}

// Format timestamp for community activity
function formatTimestamp(timestamp) {
    const now = new Date();
    const postTime = new Date(timestamp);
    const diffInHours = Math.floor((now - postTime) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
        return 'Just now';
    } else if (diffInHours < 24) {
        return `${diffInHours}h ago`;
    } else {
        const diffInDays = Math.floor(diffInHours / 24);
        return `${diffInDays}d ago`;
    }
}
