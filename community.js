// Community Page JavaScript Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize community page
    initializeCommunityPage();
    loadCommunityData();
    setupEventListeners();
});

// Initialize community page
function initializeCommunityPage() {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    
    if (!isLoggedIn) {
        // Redirect to registration if not logged in
        showToast.warning('Login Required', 'Please register first to access the community features.');
        setTimeout(() => {
            window.location.href = 'index.html#register1';
        }, 2000);
        return;
    }
    
    // Initialize community data if not set
    if (!localStorage.getItem('communityPosts')) {
        initializeSampleData();
    }
    
    // Initialize tabs
    initializeTabs();
    
    // Load initial content
    loadFeed();
    loadChallenges();
    loadBuddies();
    loadFriends();
}

// Initialize sample data for demo
function initializeSampleData() {
    const samplePosts = [
        {
            id: 1,
            userId: 'sarah_j',
            userName: 'Sarah Johnson',
            userAvatar: './images/trainer1.jpg',
            content: 'Just completed an amazing HIIT session! Feeling energized and ready to tackle the day 💪',
            type: 'text',
            likes: 12,
            comments: 3,
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            liked: false
        },
        {
            id: 2,
            userId: 'mike_c',
            userName: 'Mike Chen',
            userAvatar: './images/trainer2.jpg',
            content: 'Progress update: Lost 5 pounds this month! Consistency is key 🔥',
            type: 'text',
            likes: 18,
            comments: 7,
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
            liked: true
        },
        {
            id: 3,
            userId: 'lisa_r',
            userName: 'Lisa Rodriguez',
            userAvatar: './images/trainer3.jpg',
            content: 'Morning yoga session complete! Starting the day with mindfulness and flexibility 🧘‍♀️',
            type: 'text',
            likes: 8,
            comments: 2,
            timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
            liked: false
        }
    ];
    
    const sampleBuddies = [
        {
            id: 1,
            name: 'Alex Thompson',
            avatar: './images/trainer1.jpg',
            fitnessLevel: 'Intermediate',
            preferredTime: 'Morning',
            workoutsThisWeek: 4,
            streak: 12,
            goals: ['Weight Loss', 'Cardio']
        },
        {
            id: 2,
            name: 'Emma Wilson',
            avatar: './images/trainer2.jpg',
            fitnessLevel: 'Advanced',
            preferredTime: 'Evening',
            workoutsThisWeek: 6,
            streak: 25,
            goals: ['Muscle Gain', 'Strength Training']
        },
        {
            id: 3,
            name: 'David Park',
            avatar: './images/trainer3.jpg',
            fitnessLevel: 'Beginner',
            preferredTime: 'Weekend',
            workoutsThisWeek: 2,
            streak: 5,
            goals: ['General Fitness', 'Flexibility']
        }
    ];
    
    const sampleFriends = [
        {
            id: 1,
            name: 'Jessica Lee',
            avatar: './images/trainer1.jpg',
            status: 'online',
            lastWorkout: '2 hours ago',
            mutualFriends: 3
        },
        {
            id: 2,
            name: 'Ryan Martinez',
            avatar: './images/trainer2.jpg',
            status: 'offline',
            lastWorkout: 'Yesterday',
            mutualFriends: 1
        }
    ];
    
    localStorage.setItem('communityPosts', JSON.stringify(samplePosts));
    localStorage.setItem('communityBuddies', JSON.stringify(sampleBuddies));
    localStorage.setItem('communityFriends', JSON.stringify(sampleFriends));
    localStorage.setItem('friendRequests', JSON.stringify([]));
}

// Initialize tabs functionality
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all tabs and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            this.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
}

// Load all community data
function loadCommunityData() {
    updateCommunityStats();
}

// Update community statistics
function updateCommunityStats() {
    const posts = JSON.parse(localStorage.getItem('communityPosts') || '[]');
    const buddies = JSON.parse(localStorage.getItem('communityBuddies') || '[]');
    const friends = JSON.parse(localStorage.getItem('communityFriends') || '[]');
    
    // Simulate dynamic stats with data-target for animation
    const membersElement = document.getElementById('totalMembers');
    const workoutsElement = document.getElementById('workoutsToday');
    const challengesElement = document.getElementById('challengesActive');
    
    if (membersElement) {
        membersElement.setAttribute('data-target', '1247');
        membersElement.textContent = '0';
    }
    if (workoutsElement) {
        workoutsElement.setAttribute('data-target', '89');
        workoutsElement.textContent = '0';
    }
    if (challengesElement) {
        challengesElement.setAttribute('data-target', '3');
        challengesElement.textContent = '0';
    }
    
    // Trigger animated counters
    setTimeout(() => {
        if (typeof window.initAnimatedCounters === 'function') {
            window.initAnimatedCounters();
        }
    }, 300);
}

// Load community feed
function loadFeed() {
    const posts = JSON.parse(localStorage.getItem('communityPosts') || '[]');
    const postsContainer = document.getElementById('postsContainer');
    
    if (posts.length === 0) {
        postsContainer.innerHTML = `
            <div class="no-posts">
                <i class="fas fa-info-circle"></i>
                <p>No posts yet. Be the first to share your fitness journey!</p>
            </div>
        `;
        return;
    }
    
    // Sort posts by timestamp (newest first)
    const sortedPosts = posts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    postsContainer.innerHTML = sortedPosts.map(post => `
        <div class="post-card" data-post-id="${post.id}">
            <div class="post-header">
                <div class="post-avatar">
                    <img src="${post.userAvatar}" alt="${post.userName}">
                </div>
                <div class="post-user-info">
                    <h4>${post.userName}</h4>
                    <p>${formatTimestamp(post.timestamp)}</p>
                </div>
            </div>
            <div class="post-content">
                <p>${post.content}</p>
                ${post.image ? `<div class="post-image"><img src="${post.image}" alt="Post image"></div>` : ''}
            </div>
            <div class="post-actions">
                <button class="post-action ${post.liked ? 'liked' : ''}" onclick="toggleLike(${post.id})">
                    <i class="fas fa-heart"></i>
                    <span>${post.likes}</span>
                </button>
                <button class="post-action" onclick="showComments(${post.id})">
                    <i class="fas fa-comment"></i>
                    <span>${post.comments}</span>
                </button>
                <button class="post-action" onclick="sharePost(${post.id})">
                    <i class="fas fa-share"></i>
                    <span>Share</span>
                </button>
            </div>
        </div>
    `).join('');
}

// Load challenges
function loadChallenges() {
    // Challenges are static for now, but could be loaded from localStorage
    const challengesContainer = document.querySelector('.challenges-container');
    
    // Add event listeners to join challenge buttons
    const joinButtons = challengesContainer.querySelectorAll('.join-challenge');
    joinButtons.forEach(button => {
        button.addEventListener('click', function() {
            const challengeCard = this.closest('.challenge-card');
            const challengeName = challengeCard.querySelector('h3').textContent;
            
            if (this.textContent === 'Join Challenge') {
                this.textContent = 'Joined!';
                this.style.backgroundColor = '#28a745';
                this.style.borderColor = '#28a745';
                showSuccessNotification(`Joined "${challengeName}" challenge!`);
            } else {
                this.textContent = 'Join Challenge';
                this.style.backgroundColor = 'transparent';
                this.style.borderColor = 'yellowgreen';
                showSuccessNotification(`Left "${challengeName}" challenge.`);
            }
        });
    });
}

// Load workout buddies
function loadBuddies() {
    const buddies = JSON.parse(localStorage.getItem('communityBuddies') || '[]');
    const buddiesGrid = document.getElementById('buddiesGrid');
    
    if (buddies.length === 0) {
        buddiesGrid.innerHTML = `
            <div class="no-buddies">
                <i class="fas fa-users"></i>
                <p>No workout buddies found. Try adjusting your search criteria!</p>
            </div>
        `;
        return;
    }
    
    buddiesGrid.innerHTML = buddies.map(buddy => `
        <div class="buddy-card" data-buddy-id="${buddy.id}">
            <div class="buddy-avatar">
                <img src="${buddy.avatar}" alt="${buddy.name}">
            </div>
            <div class="buddy-info">
                <h4>${buddy.name}</h4>
                <p>${buddy.fitnessLevel} • ${buddy.preferredTime} workouts</p>
            </div>
            <div class="buddy-stats">
                <div class="buddy-stat">
                    <span class="stat-number">${buddy.workoutsThisWeek}</span>
                    <span class="stat-label">This Week</span>
                </div>
                <div class="buddy-stat">
                    <span class="stat-number">${buddy.streak}</span>
                    <span class="stat-label">Day Streak</span>
                </div>
            </div>
            <div class="buddy-actions">
                <button class="btn buddy-btn primary" onclick="sendBuddyRequest(${buddy.id})">
                    <i class="fas fa-user-plus"></i> Connect
                </button>
                <button class="btn buddy-btn secondary" onclick="viewBuddyProfile(${buddy.id})">
                    <i class="fas fa-eye"></i> View
                </button>
            </div>
        </div>
    `).join('');
}

// Load friends
function loadFriends() {
    const friends = JSON.parse(localStorage.getItem('communityFriends') || '[]');
    const requests = JSON.parse(localStorage.getItem('friendRequests') || '[]');
    
    const friendsList = document.getElementById('friendsList');
    const requestsList = document.getElementById('requestsList');
    
    // Load friends list
    if (friends.length === 0) {
        friendsList.innerHTML = `
            <div class="no-friends">
                <i class="fas fa-user-friends"></i>
                <p>No friends yet. Start connecting with fellow fitness enthusiasts!</p>
            </div>
        `;
    } else {
        friendsList.innerHTML = friends.map(friend => `
            <div class="friend-card" data-friend-id="${friend.id}">
                <div class="friend-avatar">
                    <img src="${friend.avatar}" alt="${friend.name}">
                </div>
                <div class="friend-info">
                    <h4>${friend.name}</h4>
                    <p>Last workout: ${friend.lastWorkout}</p>
                </div>
                <div class="friend-status ${friend.status}">
                    ${friend.status === 'online' ? 'Online' : 'Offline'}
                </div>
                <div class="friend-actions">
                    <button class="btn friend-action" onclick="messageFriend(${friend.id})">
                        <i class="fas fa-comment"></i> Message
                    </button>
                    <button class="btn friend-action" onclick="workoutWithFriend(${friend.id})">
                        <i class="fas fa-dumbbell"></i> Workout
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    // Load friend requests
    if (requests.length === 0) {
        requestsList.innerHTML = `
            <div class="no-requests">
                <i class="fas fa-inbox"></i>
                <p>No pending friend requests.</p>
            </div>
        `;
    } else {
        requestsList.innerHTML = requests.map(request => `
            <div class="request-item" data-request-id="${request.id}">
                <div class="request-avatar">
                    <img src="${request.avatar}" alt="${request.name}">
                </div>
                <div class="request-info">
                    <h5>${request.name}</h5>
                    <p>${request.message || 'Wants to be friends'}</p>
                </div>
                <div class="request-actions">
                    <button class="btn request-btn accept" onclick="acceptFriendRequest(${request.id})">
                        <i class="fas fa-check"></i> Accept
                    </button>
                    <button class="btn request-btn decline" onclick="declineFriendRequest(${request.id})">
                        <i class="fas fa-times"></i> Decline
                    </button>
                </div>
            </div>
        `).join('');
    }
}

// Setup event listeners
function setupEventListeners() {
    // Buddy search functionality
    const buddySearch = document.getElementById('buddySearch');
    if (buddySearch) {
        buddySearch.addEventListener('input', function() {
            filterBuddies(this.value);
        });
    }
    
    // Buddy filters
    const buddyFilters = document.querySelectorAll('.buddy-filters .filter-btn');
    buddyFilters.forEach(filter => {
        filter.addEventListener('click', function() {
            buddyFilters.forEach(f => f.classList.remove('active'));
            this.classList.add('active');
            filterBuddiesByTime(this.getAttribute('data-filter'));
        });
    });
    
    // Photo form submission
    const photoForm = document.getElementById('photoForm');
    if (photoForm) {
        photoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            sharePhoto();
        });
    }
    
    // Workout share form submission
    const workoutShareForm = document.getElementById('workoutShareForm');
    if (workoutShareForm) {
        workoutShareForm.addEventListener('submit', function(e) {
            e.preventDefault();
            shareWorkout();
        });
    }
    
    // Add friend form submission
    const addFriendForm = document.getElementById('addFriendForm');
    if (addFriendForm) {
        addFriendForm.addEventListener('submit', function(e) {
            e.preventDefault();
            sendFriendRequest();
        });
    }
}

// Create a new post
function createPost() {
    const content = document.getElementById('postContent').value.trim();
    
    if (!content) {
        showToast.warning('Content Required', 'Please enter some content for your post.');
        return;
    }
    
    const memberName = localStorage.getItem('memberName') || 'Member';
    const newPost = {
        id: Date.now(),
        userId: 'current_user',
        userName: memberName,
        userAvatar: './images/trainer1.jpg',
        content: content,
        type: 'text',
        likes: 0,
        comments: 0,
        timestamp: new Date().toISOString(),
        liked: false
    };
    
    const posts = JSON.parse(localStorage.getItem('communityPosts') || '[]');
    posts.unshift(newPost);
    localStorage.setItem('communityPosts', JSON.stringify(posts));
    
    document.getElementById('postContent').value = '';
    loadFeed();
    showSuccessNotification('Post shared successfully!');
}

// Toggle like on a post
function toggleLike(postId) {
    const posts = JSON.parse(localStorage.getItem('communityPosts') || '[]');
    const post = posts.find(p => p.id === postId);
    
    if (post) {
        if (post.liked) {
            post.likes--;
            post.liked = false;
        } else {
            post.likes++;
            post.liked = true;
        }
        
        localStorage.setItem('communityPosts', JSON.stringify(posts));
        loadFeed();
    }
}

// Show comments (placeholder)
function showComments(postId) {
    showToast.info('Coming Soon', 'Comments feature coming soon!');
}

// Share post (placeholder)
function sharePost(postId) {
    showToast.info('Coming Soon', 'Share feature coming soon!');
}

// Send buddy request
function sendBuddyRequest(buddyId) {
    const buddies = JSON.parse(localStorage.getItem('communityBuddies') || '[]');
    const buddy = buddies.find(b => b.id === buddyId);
    
    if (buddy) {
        showSuccessNotification(`Buddy request sent to ${buddy.name}!`);
    }
}

// View buddy profile
function viewBuddyProfile(buddyId) {
    showToast.info('Coming Soon', 'Buddy profile view coming soon!');
}

// Filter buddies by search term
function filterBuddies(searchTerm) {
    const buddies = JSON.parse(localStorage.getItem('communityBuddies') || '[]');
    const filteredBuddies = buddies.filter(buddy => 
        buddy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        buddy.fitnessLevel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        buddy.goals.some(goal => goal.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    const buddiesGrid = document.getElementById('buddiesGrid');
    
    if (filteredBuddies.length === 0) {
        buddiesGrid.innerHTML = `
            <div class="no-buddies">
                <i class="fas fa-search"></i>
                <p>No buddies found matching "${searchTerm}"</p>
            </div>
        `;
    } else {
        buddiesGrid.innerHTML = filteredBuddies.map(buddy => `
            <div class="buddy-card" data-buddy-id="${buddy.id}">
                <div class="buddy-avatar">
                    <img src="${buddy.avatar}" alt="${buddy.name}">
                </div>
                <div class="buddy-info">
                    <h4>${buddy.name}</h4>
                    <p>${buddy.fitnessLevel} • ${buddy.preferredTime} workouts</p>
                </div>
                <div class="buddy-stats">
                    <div class="buddy-stat">
                        <span class="stat-number">${buddy.workoutsThisWeek}</span>
                        <span class="stat-label">This Week</span>
                    </div>
                    <div class="buddy-stat">
                        <span class="stat-number">${buddy.streak}</span>
                        <span class="stat-label">Day Streak</span>
                    </div>
                </div>
                <div class="buddy-actions">
                    <button class="btn buddy-btn primary" onclick="sendBuddyRequest(${buddy.id})">
                        <i class="fas fa-user-plus"></i> Connect
                    </button>
                    <button class="btn buddy-btn secondary" onclick="viewBuddyProfile(${buddy.id})">
                        <i class="fas fa-eye"></i> View
                    </button>
                </div>
            </div>
        `).join('');
    }
}

// Filter buddies by time preference
function filterBuddiesByTime(timeFilter) {
    if (timeFilter === 'all') {
        loadBuddies();
        return;
    }
    
    const buddies = JSON.parse(localStorage.getItem('communityBuddies') || '[]');
    const filteredBuddies = buddies.filter(buddy => 
        buddy.preferredTime.toLowerCase() === timeFilter.toLowerCase()
    );
    
    const buddiesGrid = document.getElementById('buddiesGrid');
    
    if (filteredBuddies.length === 0) {
        buddiesGrid.innerHTML = `
            <div class="no-buddies">
                <i class="fas fa-clock"></i>
                <p>No buddies found for ${timeFilter} workouts</p>
            </div>
        `;
    } else {
        buddiesGrid.innerHTML = filteredBuddies.map(buddy => `
            <div class="buddy-card" data-buddy-id="${buddy.id}">
                <div class="buddy-avatar">
                    <img src="${buddy.avatar}" alt="${buddy.name}">
                </div>
                <div class="buddy-info">
                    <h4>${buddy.name}</h4>
                    <p>${buddy.fitnessLevel} • ${buddy.preferredTime} workouts</p>
                </div>
                <div class="buddy-stats">
                    <div class="buddy-stat">
                        <span class="stat-number">${buddy.workoutsThisWeek}</span>
                        <span class="stat-label">This Week</span>
                    </div>
                    <div class="buddy-stat">
                        <span class="stat-number">${buddy.streak}</span>
                        <span class="stat-label">Day Streak</span>
                    </div>
                </div>
                <div class="buddy-actions">
                    <button class="btn buddy-btn primary" onclick="sendBuddyRequest(${buddy.id})">
                        <i class="fas fa-user-plus"></i> Connect
                    </button>
                    <button class="btn buddy-btn secondary" onclick="viewBuddyProfile(${buddy.id})">
                        <i class="fas fa-eye"></i> View
                    </button>
                </div>
            </div>
        `).join('');
    }
}

// Accept friend request
function acceptFriendRequest(requestId) {
    const requests = JSON.parse(localStorage.getItem('friendRequests') || '[]');
    const friends = JSON.parse(localStorage.getItem('communityFriends') || '[]');
    
    const request = requests.find(r => r.id === requestId);
    if (request) {
        // Add to friends list
        friends.push({
            id: Date.now(),
            name: request.name,
            avatar: request.avatar,
            status: 'offline',
            lastWorkout: 'Unknown',
            mutualFriends: 0
        });
        
        // Remove from requests
        const updatedRequests = requests.filter(r => r.id !== requestId);
        
        localStorage.setItem('communityFriends', JSON.stringify(friends));
        localStorage.setItem('friendRequests', JSON.stringify(updatedRequests));
        
        loadFriends();
        showSuccessNotification(`You are now friends with ${request.name}!`);
    }
}

// Decline friend request
function declineFriendRequest(requestId) {
    const requests = JSON.parse(localStorage.getItem('friendRequests') || '[]');
    const updatedRequests = requests.filter(r => r.id !== requestId);
    
    localStorage.setItem('friendRequests', JSON.stringify(updatedRequests));
    loadFriends();
    showSuccessNotification('Friend request declined.');
}

// Message friend (placeholder)
function messageFriend(friendId) {
    showToast.info('Coming Soon', 'Messaging feature coming soon!');
}

// Workout with friend (placeholder)
function workoutWithFriend(friendId) {
    showToast.info('Coming Soon', 'Workout coordination feature coming soon!');
}

// Send friend request
function sendFriendRequest() {
    const searchTerm = document.getElementById('friendSearch').value.trim();
    const message = document.getElementById('friendMessage').value.trim();
    
    if (!searchTerm) {
        showToast.warning('Search Required', 'Please enter a username or email.');
        return;
    }
    
    // Simulate sending friend request
    showSuccessNotification(`Friend request sent to ${searchTerm}!`);
    closeAddFriendModal();
}

// Share photo
function sharePhoto() {
    const caption = document.getElementById('photoCaption').value.trim();
    const privacy = document.getElementById('photoPrivacy').value;
    
    const memberName = localStorage.getItem('memberName') || 'Member';
    const newPost = {
        id: Date.now(),
        userId: 'current_user',
        userName: memberName,
        userAvatar: './images/trainer1.jpg',
        content: caption || 'Shared a progress photo!',
        type: 'photo',
        image: './images/trainer1.jpg', // In real app, this would be the uploaded image
        likes: 0,
        comments: 0,
        timestamp: new Date().toISOString(),
        liked: false,
        privacy: privacy
    };
    
    const posts = JSON.parse(localStorage.getItem('communityPosts') || '[]');
    posts.unshift(newPost);
    localStorage.setItem('communityPosts', JSON.stringify(posts));
    
    closePhotoUpload();
    loadFeed();
    showSuccessNotification('Photo shared successfully!');
}

// Share workout
function shareWorkout() {
    const workoutId = document.getElementById('workoutSelect').value;
    const message = document.getElementById('workoutMessage').value.trim();
    const privacy = document.getElementById('workoutPrivacy').value;
    
    if (!workoutId) {
        showToast.warning('Workout Required', 'Please select a workout to share.');
        return;
    }
    
    const workouts = JSON.parse(localStorage.getItem('userWorkouts') || '[]');
    const workout = workouts.find(w => w.id == workoutId);
    
    if (workout) {
        const memberName = localStorage.getItem('memberName') || 'Member';
        const newPost = {
            id: Date.now(),
            userId: 'current_user',
            userName: memberName,
            userAvatar: './images/trainer1.jpg',
            content: message || `Just completed a ${workout.type} workout for ${workout.duration} minutes!`,
            type: 'workout',
            workoutData: workout,
            likes: 0,
            comments: 0,
            timestamp: new Date().toISOString(),
            liked: false,
            privacy: privacy
        };
        
        const posts = JSON.parse(localStorage.getItem('communityPosts') || '[]');
        posts.unshift(newPost);
        localStorage.setItem('communityPosts', JSON.stringify(posts));
        
        closeWorkoutShare();
        loadFeed();
        showSuccessNotification('Workout shared successfully!');
    }
}

// Modal functions
function openPhotoUpload() {
    document.getElementById('photoModal').style.display = 'block';
}

function closePhotoUpload() {
    document.getElementById('photoModal').style.display = 'none';
    document.getElementById('photoForm').reset();
}

function openWorkoutShare() {
    // Load user's recent workouts
    const workouts = JSON.parse(localStorage.getItem('userWorkouts') || '[]');
    const workoutSelect = document.getElementById('workoutSelect');
    
    workoutSelect.innerHTML = '<option value="">Choose a workout...</option>';
    workouts.slice(0, 5).forEach(workout => {
        const option = document.createElement('option');
        option.value = workout.id;
        option.textContent = `${workout.type} - ${workout.duration} min (${new Date(workout.date).toLocaleDateString()})`;
        workoutSelect.appendChild(option);
    });
    
    document.getElementById('workoutModal').style.display = 'block';
}

function closeWorkoutShare() {
    document.getElementById('workoutModal').style.display = 'none';
    document.getElementById('workoutShareForm').reset();
}

function openAddFriendModal() {
    document.getElementById('addFriendModal').style.display = 'block';
}

function closeAddFriendModal() {
    document.getElementById('addFriendModal').style.display = 'none';
    document.getElementById('addFriendForm').reset();
}

// Utility functions
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
    .no-posts, .no-buddies, .no-friends, .no-requests {
        text-align: center;
        padding: 3rem;
        color: #666;
    }
    .no-posts i, .no-buddies i, .no-friends i, .no-requests i {
        font-size: 3rem;
        color: #ddd;
        margin-bottom: 1rem;
        display: block;
    }
`;
document.head.appendChild(style);

