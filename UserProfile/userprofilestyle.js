import { BASE_URL } from '../../constant.js';

function showProgressBar() {
    const progressBarContainer = document.getElementById('circularProgressBarContainer');
    progressBarContainer.style.display = 'flex'; // Show circular progress bar
}

function hideProgressBar() {
    const progressBarContainer = document.getElementById('circularProgressBarContainer');
    progressBarContainer.style.display = 'none'; // Hide circular progress bar
}

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
        showProgressBar()
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
            console.log(profile);
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
    finally{
        hideProgressBar()
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
    document.getElementById('profile-pic').src = profile.imageUrl || '../others/images/dummyProfilePic.png'; // Assuming profilePic is a URL
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
        document.querySelector('.ppic').classList.remove('hidden')
    } else {
        
        document.querySelector('.ppic').classList.add('hidden')
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
        const formData = new FormData();

        // Append user profile data to the FormData
        formData.append('userProfile', new Blob([JSON.stringify({
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
        })], { type: 'application/json' }));
        const profilePicInput = document.getElementById('profilePic');
        if (profilePicInput.files.length > 0) {
            formData.append('profileImage', profilePicInput.files[0]); // Attach image
        }
        try {
            showProgressBar()
            const token = sessionStorage.getItem('token');
            const response = await fetch(`${BASE_URL}/api/user-profiles/save`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    // 'Content-Type': 'application/json'
                },
                body: formData
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
        finally{
            hideProgressBar()
        }
    }
}


document.addEventListener('DOMContentLoaded', () => {
    fetchUserProfile();
    document.querySelector('.edit-button').addEventListener('click', toggleEditMode);
});



// async function toggleEditMode() {
//     const fields = document.querySelectorAll('.profile-field input, .profile-field textarea, .profile-field select');
//     const editButton = document.querySelector('.edit-button');

//     if (editButton.innerText === 'Edit') {
//         fields.forEach(field => {
//             field.removeAttribute('readonly');
//             if (field.tagName === 'SELECT') {
//                 field.removeAttribute('disabled'); // Enable select elements
//             }
//         });
//         editButton.innerText = 'Save';
//         document.querySelector('.change-pic-button').classList.remove('hidden');
//     } else {
//         const updatedProfile = {
//             id: sessionStorage.getItem('userid'),
//             name: document.getElementById('profile-name').value,
//             email: document.getElementById('profile-email').value,
//             phone: document.getElementById('profile-phone').value,
//             major: document.getElementById('profile-major').value,
//             profession: document.getElementById('profile-profession').value,
//             university: document.getElementById('profile-university').value,
//             bio: document.getElementById('profile-bio').value,
//             isAvailableToJoin: document.getElementById('profile-availability').value === 'true',
//             skills: document.getElementById('profile-skills').value.split(',').map(skill => skill.trim()),
//             gender: document.getElementById('profile-gender').value
//         };

//         try {
//             showProgressBar()
//             const token = sessionStorage.getItem('token');
//             const response = await fetch(`${BASE_URL}/api/user-profiles/save`, {
//                 method: 'POST',
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify(updatedProfile)
//             });

//             if (response.ok) {
//                 Swal.fire({
//                     title: 'Done',
//                     text: 'Profile updated successfully!',
//                     icon: 'success',
//                     confirmButtonText: 'Great',
//                 });
//                 fields.forEach(field => {
//                     field.setAttribute('readonly', true);
//                     if (field.tagName === 'SELECT') {
//                         field.setAttribute('disabled', true); // Disable select elements
//                     }
//                 });
//                 editButton.innerText = 'Edit';
//             } else {
//                 Swal.fire({
//                     icon: "error",
//                     title: "Oops...",
//                     text: "Something went wrong!"
//                   });
//             }
//         } catch (error) {
//             console.error('Error during profile update:', error);
//             // alert('An error occurred while updating the profile. Please try again.');
//             Swal.fire({
//                 icon: "error",
//                 title: "Oops...",
//                 text: "An error occurred while updating the profile. Please try again."
//               });
//         }
//         finally{
//             hideProgressBar()
//         }
//     }
// }