import { BASE_URL } from '../../constant.js';

document.addEventListener('DOMContentLoaded', async function() {
    
    await fetchUserProfiles();

    const token = sessionStorage.getItem("token");
    const currentUserId = sessionStorage.getItem('userid');

    // Close the popup when the close button is clicked
    document.getElementById('close-btn').addEventListener('click', function() {
        document.getElementById('invite-popup').style.display = 'none';
    });

    // Send invite when the "Send" button is clicked
    document.getElementById('send-invite-btn').addEventListener('click', async function() {
        const message = document.getElementById('invite-message').value;
        const senderId = currentUserId; 
        const receiverId = this.getAttribute('data-receiver-id'); // Get receiverId from button

        if (message.trim() === "") {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Please enter a message."
            });
            return;
        }

        if (!receiverId) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong!"
            });
            return;
        }
    
        const inviteData = {
            senderId: senderId,
            receiverId: receiverId,
            status: "Pending",
            sentDate: new Date().toISOString(),
            message: message
        };

        try {
            showProgressBar(); // Show progress bar when sending invite
            const response = await fetch(`${BASE_URL}/api/invites/save`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(inviteData)
            });
    
            if (response.ok) {
                Swal.fire({
                    title: 'Done',
                    text: 'Invite sent successfully!',
                    icon: 'success',
                    confirmButtonText: 'Great',
                });
                document.getElementById('invite-popup').style.display = 'none'; // Close the popup
                
                // Remove the receiverId attribute for security
                document.getElementById('send-invite-btn').removeAttribute('data-receiver-id');
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Failed to send invite."
                });
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong!"
            });
        } finally {
            hideProgressBar(); // Hide progress bar when done
        }
    });

    // Add event listener for search functionality
    document.getElementById('search-btn').addEventListener('click', function() {
        const searchTerm = document.getElementById('search-input').value.toLowerCase();
        searchProfiles(searchTerm);
    });

    document.getElementById('search-input').addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            const searchTerm = event.target.value.toLowerCase();
            searchProfiles(searchTerm);
        }
    });
});

async function fetchUserProfiles() {
    const token = sessionStorage.getItem("token");
    try {
        showProgressBar(); // Show progress bar when fetching profiles
        const response = await fetch(`${BASE_URL}/api/user-profiles/all`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            console.error('Server returned an error:', response.statusText);
            return;
        }

        const contentType = response.headers.get('Content-Type');
        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            const currentUserId = sessionStorage.getItem('userid');
            const filteredProfiles = data.filter(profile => profile.id !== parseInt(currentUserId, 10));
            displayData(filteredProfiles);
            sessionStorage.setItem('allProfiles', JSON.stringify(filteredProfiles)); // Store profiles for search
        } else {
            const text = await response.text();
            console.error('Expected JSON, but received:', text);
        }
    } catch (err) {
        console.error('Error fetching profiles:', err);
    } finally {
        hideProgressBar(); // Hide progress bar when done
    }
}

// Function to display profiles
function displayData(profiles) {
    const container = document.getElementById('profiles-container');
    container.innerHTML = '';

    profiles.forEach(profile => {
        const card = document.createElement('div');
        card.className = 'card-container';

        card.innerHTML = `
            <img class="round" src="../others/images/profile.png" alt="user" />
            <h3>${profile.name}</h3>
            <h6>${profile.university}</h6>
            <p>${profile.profession}</p>
            <div class="buttons">
                <button class="primary invite-btn" data-receiver-id="${profile.id}">
                    Invite
                </button>
            </div>
            <div class="skills">
                <h6>Skills</h6>
                <ul>
                    ${profile.skills.map(skill => `<li>${skill}</li>`).join('')}
                </ul>
            </div>
        `;

        container.appendChild(card);

        // Attach click event to the "Invite" button for each profile
        const inviteBtn = card.querySelector('.invite-btn');
        inviteBtn.addEventListener('click', function(event) {
            event.stopPropagation(); // Prevent card click event from firing
            const receiverId = profile.id;

            // Store the receiverId in the "Send" button's data attribute
            document.getElementById('send-invite-btn').setAttribute('data-receiver-id', receiverId);
            
            // Show the invite popup
            document.getElementById('invite-popup').style.display = 'block';
        });

        card.addEventListener('click', () => {
            sessionStorage.setItem('selectedUserId', profile.id);
            window.location.href = '../PartnerProfile/PtProfile.html'; 
        });
    });
}

// Search function to filter profiles by name or skills
function searchProfiles(searchTerm) {
    showProgressBar(); // Show progress bar when searching profiles
    const allProfiles = JSON.parse(sessionStorage.getItem('allProfiles')) || [];
    const filteredProfiles = allProfiles.filter(profile => {
        const nameMatch = profile.name.toLowerCase().includes(searchTerm);
        const skillMatch = profile.skills.some(skill => skill.toLowerCase().includes(searchTerm));
        return nameMatch || skillMatch;
    });

    displayData(filteredProfiles);
    hideProgressBar(); // Hide progress bar when search is complete
}

function showProgressBar() {
    const progressBarContainer = document.getElementById('circularProgressBarContainer');
    progressBarContainer.style.display = 'flex'; // Show circular progress bar
}

function hideProgressBar() {
    const progressBarContainer = document.getElementById('circularProgressBarContainer');
    progressBarContainer.style.display = 'none'; // Hide circular progress bar
}
