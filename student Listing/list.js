document.addEventListener('DOMContentLoaded', async function() {
    await fetchUserProfiles();

    const userCard = document.getElementsByClassName('card-container');
    userCard.on
});

async function fetchUserProfiles() {
    try {
        const response = await fetch('http://localhost:8080/api/user-profiles/all', {
            method: 'GET',
            credentials:'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            const currentUserId = sessionStorage.getItem('userid')
            const filteredProfiles = data.filter(profile => profile.id !== parseInt(currentUserId, 10));
            displayData(filteredProfiles);
        } else {
            console.error('Server returned an error:', response.statusText);
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
                <button class="primary">
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

        // Add click event to navigate to the detailed profile page
        card.addEventListener('click', () => {
            // Store the clicked user's ID in sessionStorage or pass via URL
            sessionStorage.setItem('selectedUserId', profile.id);
            window.location.href = '../PartnerProfile/PtProfile.html'; // Replace with your detailed profile page
        });

        container.appendChild(card);
    });
}

