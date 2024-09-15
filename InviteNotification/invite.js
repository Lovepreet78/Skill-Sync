import { BASE_URL } from '../../constant.js';
async function fetchSentRequests(userId) {
    
    const token = sessionStorage.getItem("token");
    try {
        showProgressBar()
        const response = await fetch(`${BASE_URL}/api/invites/sent?userId=${userId}`, {
            method: 'GET',
            
            headers: {
                'Authorization': `Bearer ${token}`,
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
    finally{
        hideProgressBar()
    }
}

// Function to fetch received requests
async function fetchReceivedRequests(userId) {
    
    const token = sessionStorage.getItem("token");
    try {
        showProgressBar()
        const response = await fetch(`${BASE_URL}/api/invites/received?userId=${userId}`, {
            method: 'GET',

            headers: {
                
                'Authorization': `Bearer ${token}`,
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
    finally{
        hideProgressBar()
    }
}
// Helper function to fetch all profiles using the /all endpoint
async function fetchAllProfiles() {
    
    const token = sessionStorage.getItem("token");
    try {
        const response = await fetch(`${BASE_URL}/api/user-profiles/all`, {
            method: 'GET',
            headers: {
                
                'Authorization': `Bearer ${token}`,
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
// function displaySentRequests(sentRequests) {
//     const sentContainer = document.getElementById("sent-requests-container");
//     sentContainer.innerHTML = ""; // Clear the container
//     console.log(sentRequests)
//     sentRequests.forEach(request => {
//         const card = document.createElement("div");
//         card.classList.add("sent-request-card");
//         card.addEventListener('click', () => {
//             if(request.status.toLowerCase()==='accepted')
//             {
//              window.location.href = `../showInviter/inviter.html?inviterId=${request.receiverProfile.id}`;
//             }
            
//         });
//         card.innerHTML = `
//             <div class="sent-request">
//                 <div class="profile">
//                     <img src="../others/images/dummyProfilePic.png" alt="Profile Picture" class="profile-pic">
//                 </div>
//                 <span>${request.receiverProfile.name}</span>
                
//                 <div class="message-box">
//                     <div class="message-box-title">Message:</div>
//                     <div>"${request.message}"</div>
//                 </div>
                
//                 <div class="buttons">
//                     <span class="status ${request.status.toLowerCase()}">${request.status}</span>
//                     <button type="button" class="delete-button">
//                         <i class="fas fa-trash"></i> 
//                       </button>
//                     </div>
//             </div>
//         `;
//         sentContainer.appendChild(card);
//     });
// }
function displaySentRequests(sentRequests) {
    const sentContainer = document.getElementById("sent-requests-container");
    sentContainer.innerHTML = ""; // Clear the container

    sentRequests.forEach(request => {
        const card = document.createElement("div");
        card.classList.add("sent-request-card");
        card.addEventListener('click', () => {
            if(request.status.toLowerCase() === 'accepted') {
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
                
                <div class="buttons">
                    <span class="status ${request.status.toLowerCase()}">${request.status}</span>
                    <button type="button" class="delete-button" data-id="${request.inviteId}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        sentContainer.appendChild(card);
    });

    // Add click event listener to delete buttons
    const deleteButtons = document.querySelectorAll('.delete-button');
    deleteButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent triggering the card click event
            const inviteId = button.getAttribute('data-id');
            Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!"
              }).then((result) => {
                if (result.isConfirmed) {
                    showProgressBar()
                    deleteInvite(inviteId);
                    hideProgressBar()
                    Swal.fire({
                        title: "Deleted!",
                        text: "Your file has been deleted.",
                        icon: "success"
                    });
                }
              });
        });
    });
}


// function displayReceivedRequests(receivedRequests) {
//     const receivedContainer = document.getElementById("received-requests-container");
//     receivedContainer.innerHTML = ""; // Clear the container
//     console.log(receivedRequests);

//     receivedRequests.forEach(request => {
//         const card = document.createElement("div");
//         card.classList.add("request-card");
//         card.addEventListener('click', () => {
//             if(request.status.toLowerCase()==='accepted')
//                 {
                 
//                  window.location.href = `../showInviter/inviter.html?inviterId=${request.senderProfile.id}`;
//                 }
//         });
        

//         card.innerHTML = `
//             <div class="request">
//                 <div class="request-info">
//                     <div class="profile">
//                         <img src="../others/images/dummyProfilePic.png" alt="Profile Picture" class="profile-pic">
//                     </div>
//                     <span><strong>${request.senderProfile.name}</strong> wants to connect.</span>
//                     <div class="message-box">
//                         <div class="message-box-title">Message:</div>
//                         <div>"${request.message}"</div>
                        
//                     </div>
                    

//                 </div>
//                 ${request.status === 'Pending' ? `
                    
//                     <div class="buttons">
//                         <button class="btn accept" data-id="${request.inviteId}">Accept</button>
//                         <button class="btn reject" data-id="${request.inviteId}">Reject</button>
//                         <button type="button" class="delete-button">
//                             <i class="fas fa-trash"></i> 
//                           </button>
                          
//                     </div>
//                 ` : `
//                     <div class="status ${request.status.toLowerCase()}">${request.status}</div>
//                     <div class="buttons">
//                         <button type="button" class="delete-button">
//                             <i class="fas fa-trash"></i> 
//                           </button>
//                     </div>
//                 `}
//             </div>
//         `;
//         receivedContainer.appendChild(card);
//     });

//     // Add click event listeners to Accept and Reject buttons
//     const acceptButtons = document.querySelectorAll('.btn.accept');
//     const rejectButtons = document.querySelectorAll('.btn.reject');

//     acceptButtons.forEach(button => {
//         button.addEventListener('click', () => {
//             const requestId = button.getAttribute('data-id');
//             updateInviteStatus(requestId, 'Accepted');
//         });
//     });

//     rejectButtons.forEach(button => {
//         button.addEventListener('click', () => {
//             const requestId = button.getAttribute('data-id');
//             updateInviteStatus(requestId, 'Rejected');
//         });
//     });
// }
function displayReceivedRequests(receivedRequests) {
    const receivedContainer = document.getElementById("received-requests-container");
    receivedContainer.innerHTML = ""; // Clear the container
    console.log("dasdasdasdasda",receivedRequests)
    receivedRequests.forEach(request => {
        const card = document.createElement("div");
        card.classList.add("request-card");
        card.addEventListener('click', () => {
            if(request.status.toLowerCase() === 'accepted') {
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
                    <div class="buttons">
                        <button class="btn accept" data-id="${request.inviteId}">Accept</button>
                        <button class="btn reject" data-id="${request.inviteId}">Reject</button>
                        <button type="button" class="delete-button" data-id="${request.inviteId}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                ` : `
                    <div class="status ${request.status.toLowerCase()}">${request.status}</div>
                    <div class="buttons">
                        <button type="button" class="delete-button" data-id="${request.inviteId}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `}
            </div>
        `;
        receivedContainer.appendChild(card);
    });

    // Add click event listeners to Accept and Reject buttons
    const acceptButtons = document.querySelectorAll('.btn.accept');
    const rejectButtons = document.querySelectorAll('.btn.reject');
    const deleteButtons = document.querySelectorAll('.delete-button');

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

    deleteButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent triggering the card click event
            const inviteId = button.getAttribute('data-id');
            Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!"
              }).then((result) => {
                if (result.isConfirmed) {
                    deleteInvite(inviteId);
                  Swal.fire({
                    title: "Deleted!",
                    text: "Your file has been deleted.",
                    icon: "success"
                  });
                }
              });
            
        });
    });
}

async function deleteInvite(inviteId) {
    const token = sessionStorage.getItem("token");
    try {
        // showProgressBar()
        const response = await fetch(`${BASE_URL}/api/invites/delete`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ inviteId: inviteId })
        });

        if (response.ok) {
            console.log(`Invite ${inviteId} has been deleted`);
            // Refresh the request lists to reflect changes
            const userId = sessionStorage.getItem('userid');
            fetchSentRequests(userId);
            fetchReceivedRequests(userId);
        } else {
            console.error("Error deleting invite:", response.status);
        }
    } catch (error) {
        console.error("Error deleting invite:", error);
    }
    finally{
        // hideProgressBar()
    }
}


async function updateInviteStatus(requestId, status) {
    
    const token = sessionStorage.getItem("token");
    try {
        console.log(status+" "+requestId)
        const response = await fetch(`${BASE_URL}/api/invites/update`, {
            method: 'PUT',
            headers: {
                
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                inviteId: requestId,
                status: status
            })
        });

        if (response.ok) {
            console.log(`Invite request ${requestId} has been ${status}`);
            const userId = sessionStorage.getItem('userid');
            fetchReceivedRequests(userId);
        } else {
            console.error("Error updating invite status:", response.status);
        }
    } catch (error) {
        console.error("Error updating invite status:", error);
    }
}
function showProgressBar() {
    const progressBarContainer = document.getElementById('circularProgressBarContainer');
    progressBarContainer.style.display = 'flex'; // Show circular progress bar
}

function hideProgressBar() {
    const progressBarContainer = document.getElementById('circularProgressBarContainer');
    progressBarContainer.style.display = 'none'; // Hide circular progress bar
}


// Fetch both sent and received requests on page load
const userId = sessionStorage.getItem('userid');
fetchSentRequests(userId);

fetchReceivedRequests(userId);
















































