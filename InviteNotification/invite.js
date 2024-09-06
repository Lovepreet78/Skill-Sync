async function fetchSentRequests(userId) {
    try {
        const response = await fetch(`http://localhost:8080/api/invites/sent?userId=${userId}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const sentRequests = await response.json();
        
        // Fetch all profiles once
        const profiles = await fetchAllProfiles();
        
        // Merge sent requests with their receiver profiles
        const requestsWithProfiles = sentRequests.map(request => {
            const receiverProfile = profiles.find(profile => profile.id === request.receiverId);
            
            // Log to check if the profile was found
            if (!receiverProfile) {
                console.error(`Profile not found for receiverId: ${request.receiverId}`);
            }

            return { ...request, receiverProfile };
        });

        console.log("Mapped sent requests with profiles:", requestsWithProfiles); // For debugging
        displaySentRequests(requestsWithProfiles);
    } catch (error) {
        console.error("Error fetching sent requests:", error);
    }
}

// Function to fetch received requests
async function fetchReceivedRequests(userId) {
    try {
        const response = await fetch(`http://localhost:8080/api/invites/received?userId=${userId}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const receivedRequests = await response.json();
        
        // Fetch all profiles once
        const profiles = await fetchAllProfiles();
        
        // Merge received requests with their sender profiles
        const requestsWithProfiles = receivedRequests.map(request => {
            const senderProfile = profiles.find(profile => profile.id === request.senderId);
            
            // Log to check if the profile was found
            if (!senderProfile) {
                console.error(`Profile not found for senderId: ${request.senderId}`);
            }

            return { ...request, senderProfile };
        });

        console.log("Mapped received requests with profiles:", requestsWithProfiles); // For debugging
        displayReceivedRequests(requestsWithProfiles);
    } catch (error) {
        console.error("Error fetching received requests:", error);
    }
}
// Helper function to fetch all profiles using the /all endpoint
async function fetchAllProfiles() {
    try {
        const response = await fetch(`http://localhost:8080/api/user-profiles/all`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        return await response.json();
    } catch (error) {
        console.error("Error fetching all profiles:", error);
        return [];
    }
}

// Function to display sent requests with profile information
function displaySentRequests(sentRequests) {
    const sentContainer = document.getElementById("sent-requests-container");
    sentContainer.innerHTML = ""; // Clear the container
    console.log(sentRequests)
    sentRequests.forEach(request => {
        const card = document.createElement("div");
        card.classList.add("sent-request-card");
        card.addEventListener('click', () => {
            if(request.status.toLowerCase()==='accepted')
            {
             window.location.href = `../showInviter/inviter.html?inviterId=${request.receiverProfile.id}`;
            }
            
        });
        card.innerHTML = `
            <div class="sent-request">
                <div class="profile">
                    <img src="../others/images/dummyProfilePic.png" alt="Profile Picture" class="profile-pic">
                </div>
                <span>${request.receiverProfile.name}</span>
                
                <div class="message-box">
                    <div class="message-box-title">Message:</div>
                    <div>"${request.message}"</div>
                </div>
                <span class="status ${request.status.toLowerCase()}">${request.status}</span>
            </div>
        `;
        sentContainer.appendChild(card);
    });
}

function displayReceivedRequests(receivedRequests) {
    const receivedContainer = document.getElementById("received-requests-container");
    receivedContainer.innerHTML = ""; // Clear the container
    console.log(receivedRequests);

    receivedRequests.forEach(request => {
        const card = document.createElement("div");
        card.classList.add("request-card");
        card.addEventListener('click', () => {
            if(request.status.toLowerCase()==='accepted')
                {
                 
                 window.location.href = `../showInviter/inviter.html?inviterId=${request.senderProfile.id}`;
                }
        });
        

        card.innerHTML = `
            <div class="request">
                <div class="request-info">
                    <div class="profile">
                        <img src="../others/images/dummyProfilePic.png" alt="Profile Picture" class="profile-pic">
                    </div>
                    <span><strong>${request.senderProfile.name}</strong> wants to connect.</span>
                    <div class="message-box">
                        <div class="message-box-title">Message:</div>
                        <div>"${request.message}"</div>
                    </div>
                </div>
                ${request.status === 'Pending' ? `
                    <div>
                        <button class="btn accept" data-id="${request.userId}">Accept</button>
                        <button class="btn reject" data-id="${request.userId}">Reject</button>
                    </div>
                ` : `
                    <div class="status ${request.status.toLowerCase()}">${request.status}</div>
                `}
            </div>
        `;
        receivedContainer.appendChild(card);
    });

    // Add click event listeners to Accept and Reject buttons
    const acceptButtons = document.querySelectorAll('.btn.accept');
    const rejectButtons = document.querySelectorAll('.btn.reject');

    acceptButtons.forEach(button => {
        button.addEventListener('click', () => {
            const requestId = button.getAttribute('data-id');
            updateInviteStatus(requestId, 'Accepted');
        });
    });

    rejectButtons.forEach(button => {
        button.addEventListener('click', () => {
            const requestId = button.getAttribute('data-id');
            updateInviteStatus(requestId, 'Rejected');
        });
    });
}








// Function to send update request to Spring backend for invite status
// Function to send update request to Spring backend for invite status
async function updateInviteStatus(requestId, status) {
    try {
        console.log(status+" "+requestId)
        const response = await fetch(`http://localhost:8080/api/invites/update`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: requestId, // Correct property name as per backend API
                status: status
            })
        });

        if (response.ok) {
            console.log(`Invite request ${requestId} has been ${status}`);
            // Optionally refresh the request lists to reflect changes
            const userId = sessionStorage.getItem('userid');
            fetchReceivedRequests(userId);
        } else {
            console.error("Error updating invite status:", response.status);
        }
    } catch (error) {
        console.error("Error updating invite status:", error);
    }
}


// Fetch both sent and received requests on page load
const userId = sessionStorage.getItem('userid');
fetchSentRequests(userId);
fetchReceivedRequests(userId);
















































