import { BASE_URL } from '../../constant.js';
document.addEventListener('DOMContentLoaded', async function() {
    await fetchUserProfiles();

    const token = sessionStorage.getItem("token");
    const currentUserId = sessionStorage.getItem('userid');

    document.getElementById('close-btn').addEventListener('click', function() {
        document.getElementById('invite-popup').style.display = 'none';
    });

    // Send invite when the "Send" button is clicked
    document.getElementById('send-invite-btn').addEventListener('click', async function() {
        const message = document.getElementById('invite-message').value;
        const senderId = currentUserId; 
        const sendInviteBtn = document.getElementById('send-invite-btn');
        const receiverId = sendInviteBtn.getAttribute('data-receiver-id'); // Get receiverId from button

        if (message.trim() === "") {
            // alert("Please enter a message.");
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
        console.log(inviteData)
        try {
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
                sendInviteBtn.removeAttribute('data-receiver-id');
            } else {
                // alert('Failed to send invite.');
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
        }
    });
});

// async function fetchUserProfiles() {
//     try {
//         const response = await fetch('http://localhost:8080/api/user-profiles/all', {
//             method: 'GET',
//             credentials: 'include',
//             headers: {
//                 'Content-Type': 'application/json'
//             }
//         });

//         if (response.ok) {
//             const data = await response.json();
//             const currentUserId = sessionStorage.getItem('userid');
//             const filteredProfiles = data.filter(profile => profile.id !== parseInt(currentUserId, 10));
//             displayData(filteredProfiles);
//         } else {
//             console.error('Server returned an error:', response.statusText);
//         }
//     } catch (err) {
//         console.error('Error fetching profiles:', err);
//     }
// }
async function fetchUserProfiles() {
    
    const token = sessionStorage.getItem("token");
    try {
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

        // Check response content type
        const contentType = response.headers.get('Content-Type');
        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            const currentUserId = sessionStorage.getItem('userid');
            const filteredProfiles = data.filter(profile => profile.id !== parseInt(currentUserId, 10));
            displayData(filteredProfiles);
        } else {
            const text = await response.text(); // Read response as text
            console.error('Expected JSON, but received:', text);
        }
    } catch (err) {
        console.error('Error fetching profiles:', err);
    }
}

function displayData(profiles) {
    const container = document.getElementById('profiles-container');
    container.innerHTML = ''; 

    profiles.forEach(profile => {
        const card = document.createElement('div');
        card.className = 'card-container';

        card.innerHTML = `
            <img class="round" src="https://randomuser.me/api/portraits/women/79.jpg" alt="user" />
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
