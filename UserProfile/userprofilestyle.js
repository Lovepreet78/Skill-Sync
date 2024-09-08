import { BASE_URL } from '../../constant.js';

async function fetchUserProfile() {
    const userId = sessionStorage.getItem('userid'); // Assuming user ID is stored in sessionStorage
    if (!userId) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!"
          });
        return;
    }

    try {
        const token = sessionStorage.getItem('token');
        const response = await fetch(`${BASE_URL}/api/user-profiles/${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const profile = await response.json();
            populateProfileFields(profile);
        } else {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong!"
              });
        }
    } catch (error) {
        
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!"
          });
    }
}

function populateProfileFields(profile) {
    document.getElementById('profile-name').value = profile.name || '';
    document.getElementById('profile-email').value = profile.email || '';
    document.getElementById('profile-phone').value = profile.phone || '';
    document.getElementById('profile-major').value = profile.major || '';
    document.getElementById('profile-profession').value = profile.profession || '';
    document.getElementById('profile-university').value = profile.university || '';
    document.getElementById('profile-bio').value = profile.bio || '';
    document.getElementById('profile-availability').value = profile.isAvailableToJoin ? 'true' : 'false';
    document.getElementById('profile-skills').value = profile.skills.join(', ') || '';
    document.getElementById('profile-gender').value = profile.gender || '';
    document.getElementById('profile-pic').src = profile.profilePic || '../others/images/dummyProfilePic.png'; // Assuming profilePic is a URL
}

async function toggleEditMode() {
    const fields = document.querySelectorAll('.profile-field input, .profile-field textarea, .profile-field select');
    const editButton = document.querySelector('.edit-button');

    if (editButton.innerText === 'Edit') {
        fields.forEach(field => {
            field.removeAttribute('readonly');
            if (field.tagName === 'SELECT') {
                field.removeAttribute('disabled'); // Enable select elements
            }
        });
        editButton.innerText = 'Save';
    } else {
        const updatedProfile = {
            id: sessionStorage.getItem('userid'),
            name: document.getElementById('profile-name').value,
            email: document.getElementById('profile-email').value,
            phone: document.getElementById('profile-phone').value,
            major: document.getElementById('profile-major').value,
            profession: document.getElementById('profile-profession').value,
            university: document.getElementById('profile-university').value,
            bio: document.getElementById('profile-bio').value,
            isAvailableToJoin: document.getElementById('profile-availability').value === 'true',
            skills: document.getElementById('profile-skills').value.split(',').map(skill => skill.trim()),
            gender: document.getElementById('profile-gender').value
        };

        try {
            const token = sessionStorage.getItem('token');
            const response = await fetch(`${BASE_URL}/api/user-profiles/save`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedProfile)
            });

            if (response.ok) {
                Swal.fire({
                    title: 'Done',
                    text: 'Profile updated successfully!',
                    icon: 'success',
                    confirmButtonText: 'Great',
                });
                fields.forEach(field => {
                    field.setAttribute('readonly', true);
                    if (field.tagName === 'SELECT') {
                        field.setAttribute('disabled', true); // Disable select elements
                    }
                });
                editButton.innerText = 'Edit';
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Something went wrong!"
                  });
            }
        } catch (error) {
            console.error('Error during profile update:', error);
            // alert('An error occurred while updating the profile. Please try again.');
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "An error occurred while updating the profile. Please try again."
              });
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetchUserProfile();
    document.querySelector('.edit-button').addEventListener('click', toggleEditMode);
});
