import { BASE_URL } from '../../constant.js';
console.log(BASE_URL)

document.getElementById("signupform").addEventListener("click",function(){
    switchForm('signup')
})
document.getElementById("loginform").addEventListener("click",function(){
    switchForm('login')
})
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

function showProgressBar() {
    const progressBarContainer = document.getElementById('circularProgressBarContainer');
    progressBarContainer.style.display = 'flex'; // Show circular progress bar
}

function hideProgressBar() {
    const progressBarContainer = document.getElementById('circularProgressBarContainer');
    progressBarContainer.style.display = 'none'; // Hide circular progress bar
}




async function profileAlreadyCreated(username, userid) {
    const token = sessionStorage.getItem("token");
    
    try {
        const response = await fetch(`${BASE_URL}/api/user-profiles/${userid}`, {
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
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!"
          });
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
    showProgressBar()
    try {
        const response = await fetch(`${BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: toJson(loginData)
        });
        
        if (response.ok) {
            const data = await response.json();
            if (data && data.token && data.username) {
                sessionStorage.setItem('token', data.token);
                // Corrected: Pass username as a query parameter, not in the body
                const idResponse = await fetch(`${BASE_URL}/api/userIdByUsername?username=${data.username}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${data.token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (idResponse.ok) {
                    const id = await idResponse.json();

                    if (id == null) {
                        hideProgressBar()
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: "Something went wrong!"
                          });
                        return;
                    }

                    const result = await profileAlreadyCreated(data.username, id);
                    console.log(result);

                    if (result === 'Exist') {
                        sessionStorage.setItem("username", data.username);
                        sessionStorage.setItem("userid", id);

                        window.location.href = '../../index.html';
                        console.log(data.username,data.token,id)
                    } else if (result === 'Not') {
                        sessionStorage.setItem("username", data.username);
                        sessionStorage.setItem("userid", id);
                        window.location.href = '../../ProfileReg/profilereg.html';  // Redirect to profile registration page
                    } else {
                        hideProgressBar()
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: "Something went wrong!"
                          });
                    }

                } else {
                    hideProgressBar()
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Something went wrong!"
                      });
                }

            }
            
        } else {
            hideProgressBar()
            loginTeller.innerText = "Wrong Credential, Try Again.";
            loginTeller.style.color = 'red';
        }
    } catch (error) {
        hideProgressBar()
        console.error('Error during login:', error);
        // alert('An error occurred during login. Please try again.');
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "An error occurred during login. Please try again."
          });
    }
    finally {
        hideProgressBar(); // Hide progress bar after completion
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
        hideProgressBar()
        return;
    }
    
    const signupData = { username, password };
    
    showProgressBar()    
    try {
        const response = await fetch(`${BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: toJson(signupData)
        });
        
        if (response.ok) {
            const data = await response.text(); 
            // alert(`Signup successful! ${data}. Now Login`);
            // Example usage:
            Swal.fire({
                title: 'Signup Successful! , Now Login',
                text: 'Your Account has been created successfully!',
                icon: 'success',
                confirmButtonText: 'Great',
            });
  
            switchForm('login');
        } else {
            const data = await response.text(); 
            signupTeller.innerText = data;
            signupTeller.style.color = 'red';
        }
        hideProgressBar()
    } catch (error) {
        hideProgressBar()
        // console.error('Error during signup:', error);
        // alert('An error occurred during signup. Please try again.');
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "An error occurred during login. Please try again."
          });
        
    }
});
