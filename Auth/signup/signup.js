function switchForm(formType) {
    const loginForm = document.querySelector('.login-form');
    const signupForm = document.querySelector('.signup-form');
    
    if (formType === 'signup') {
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
    } else {
        signupForm.style.display = 'none';
        loginForm.style.display = 'block';
    }
    const loginTeller = document.getElementById('login-teller');
    loginTeller.innerText = "";
}

async function profileAlreadyCreated(username, userid) {
    const token = localStorage.getItem("token");
    
    try {
        const response = await fetch(`http://localhost:8080/api/user-profiles/${userid}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            return "Exist";
        } else if (response.status === 401) {
            return "Error";
        } else if (response.status === 404) {
            return "Not";
        }
        
    } catch (error) {
        alert("Something went wrong");
        return;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    switchForm('login');
});

function toJson(obj) {
    return JSON.stringify(obj);
}

document.getElementById('login-form').addEventListener('submit', async function(event) {
    event.preventDefault(); 
    
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    const loginTeller = document.getElementById('login-teller');
    
    const loginData = { username, password };
    
    try {
        const response = await fetch('http://localhost:8080/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: toJson(loginData)
        });
        
        if (response.ok) {
            const data = await response.json();
            if (data && data.token && data.username) {
                localStorage.setItem('token', data.token);
                // Corrected: Pass username as a query parameter, not in the body
                const idResponse = await fetch(`http://localhost:8080/api/userIdByUsername?username=${data.username}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${data.token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (idResponse.ok) {
                    const id = await idResponse.json();

                    if (id == null) {
                        alert("User not found");
                        return;
                    }

                    const result = await profileAlreadyCreated(data.username, id);
                    console.log(result);
                    
                    if (result === 'Exist') {
                        localStorage.setItem('token', data.token);  // Corrected: store the actual token
                        localStorage.setItem("username", data.username);
                        sessionStorage.setItem("userid", id);

                        window.location.href = '../../index.html';
                    } else if (result === 'Not') {
                        sessionStorage.setItem("username", data.username);
                        sessionStorage.setItem("userid", id);
                        window.location.href = '../../ProfileReg/profilereg.html';  // Redirect to profile registration page
                    } else {
                        alert("Something went wrong.");
                    }

                } else {
                    alert("Failed to retrieve user ID.");
                }

            }
            
        } else {
            loginTeller.innerText = "Wrong Credential, Try Again.";
            loginTeller.style.color = 'red';
        }
    } catch (error) {
        console.error('Error during login:', error);
        alert('An error occurred during login. Please try again.');
    }
});

document.getElementById('signup-form').addEventListener('submit', async function(event) {
    event.preventDefault(); 
    
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;
    
    const signupTeller = document.getElementById('signup-teller');    
    
    if (password !== confirmPassword) {
        signupTeller.innerText = "Passwords do not match.";
        signupTeller.style.color = 'red';
        return;
    }
    
    const signupData = { username, password };
    
    try {
        const response = await fetch('http://localhost:8080/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: toJson(signupData)
        });
        
        if (response.ok) {
            const data = await response.text(); 
            alert(`Signup successful! ${data}. Now Login`);
            switchForm('login');
        } else {
            const data = await response.text(); 
            signupTeller.innerText = data;
            signupTeller.style.color = 'red';
        }
    } catch (error) {
        console.error('Error during signup:', error);
        alert('An error occurred during signup. Please try again.');
    }
});
