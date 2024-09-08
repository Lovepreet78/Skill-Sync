import { BASE_URL } from '../../constant.js';
document.addEventListener('DOMContentLoaded', function () {


    const username = sessionStorage.getItem('username');
    const userid = sessionStorage.getItem('userid');


    const token = sessionStorage.getItem("token");

    const profileForm = document.getElementById('profileForm');
    const skillsInput = document.getElementById('skillsInput');
    const skillsContainer = document.getElementById('skillsContainer');
    const skillsHiddenInput = document.getElementById('skills');
    let skillsArray = [];

    // Form sections and navigation buttons
    const formSections = document.querySelectorAll('.form-section');
    const nextButtons = document.querySelectorAll('.btn-next');
    const prevButtons = document.querySelectorAll('.btn-prev');
    let currentSection = 0;

    // Prevent form submission when pressing Enter in the skills input field
    skillsInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent form submission

            const skill = skillsInput.value.trim();
            if (skill) {
                // Add the skill to the list and display it
                skillsArray.push(skill);
                updateSkillsDisplay();
                skillsInput.value = ''; // Clear the input field
            }
        }
    });

    // Function to update the displayed skills and hidden input value
    function updateSkillsDisplay() {
        // Update hidden input for form submission
        skillsHiddenInput.value = skillsArray.join(',');

        // Clear and rebuild skills container display
        skillsContainer.innerHTML = '';
        skillsArray.forEach((skill, index) => {
            const skillTag = document.createElement('span');
            skillTag.className = 'skill-tag';
            skillTag.textContent = skill;

            // Add remove button for each skill
            const removeBtn = document.createElement('span');
            removeBtn.className = 'remove-skill';
            removeBtn.textContent = 'x';
            removeBtn.addEventListener('click', () => removeSkill(index));

            skillTag.appendChild(removeBtn);
            skillsContainer.appendChild(skillTag);
        });
    }

    // Function to remove a skill from the list
    function removeSkill(index) {
        skillsArray.splice(index, 1); // Remove the skill at the given index
        updateSkillsDisplay(); // Update the displayed skills
    }

    // Handle navigation between form sections
    function showSection(index) {
        formSections.forEach((section, i) => {
            section.classList.toggle('form-section-active', i === index);
        });
    }

    nextButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            if (currentSection < formSections.length - 1) {
                currentSection++;
                showSection(currentSection);
            }
        });
    });

    prevButtons.forEach((button) => {
        button.addEventListener('click', () => {
            if (currentSection > 0) {
                currentSection--;
                showSection(currentSection);
            }
        });
    });


    showSection(currentSection);


    profileForm.addEventListener('submit', function (e) {
        e.preventDefault(); 


        const formData = new FormData();
        formData.append('name', document.getElementById('name').value);
        formData.append('email', document.getElementById('email').value);
        formData.append('phone', document.getElementById('phone').value);
        formData.append('username', username);
        formData.append('major', document.getElementById('major').value);
        formData.append('profession', document.getElementById('profession').value);
        formData.append('university', document.getElementById('university').value);
        formData.append('bio', document.getElementById('bio').value);
        formData.append('skills', JSON.stringify(skillsArray)); 
        formData.append('isAvailableToJoin', document.getElementById('availability').value === 'true'); 
        formData.append('gender', document.getElementById('gender').value);
        
        
        const profilePicInput = document.getElementById('profilePic');
        if (profilePicInput.files.length > 0) {
            formData.append('profilePic', profilePicInput.files[0]);
        }
        let isAvailableToJoinSend ;
        if(document.getElementById('availability').value === 'true') isAvailableToJoinSend = true
        else isAvailableToJoinSend = false


        const data = {};
        data['id'] = 23;
        formData.forEach((value, key) => {
            data[key] = value;
        });
        console.log('FormData:', data);

        
        fetch(`${BASE_URL}/api/user-profiles/save`, { 
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: userid,
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                username: username,
                major: document.getElementById('major').value,
                profession: document.getElementById('profession').value,
                university: document.getElementById('university').value,
                bio: document.getElementById('bio').value,
                skills: skillsArray, // Directly using the array
                isAvailableToJoin:isAvailableToJoinSend, // Convert to boolean
                gender: document.getElementById('gender').value
            })
        })
        .then(response => {
            if (response.ok) {
                window.location.href = "../index.html"
                return response.json();
            }
            throw new Error('Something went wrong.');
        })
        .then(data => {
            console.log('Success:', data);
            // alert("Profile submitted successfully!");
        })
        .catch((error) => {
            console.error('Error:', error);
            alert("There was an error submitting your profile.");
        });
    });
});
