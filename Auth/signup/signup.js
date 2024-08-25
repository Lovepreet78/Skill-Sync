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
    loginTeller.innerText ="";

}
async function profileAlreadyCreated(username,userid){
    try{

        const response = await fetch(
            `http://localhost:8080/api/user-profiles/${userid}`,{
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                    
                }
            }

        );
        if(response.ok){
            return "Exist"
        }
        else if(response.status = 404){
            return "Not";   
        }
        else{
            return "Error"
        }
    }
    catch(error){
        alert("Something went wrong");
        return
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
            credentials:'include',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams(loginData).toString()
        });
        
        if (response.ok) {
            const data = await response.json();
            if (data && data.username && data.id) {
                const result = await profileAlreadyCreated(data.username, data.id);
                
                if(result === 'Exist'){
                    sessionStorage.setItem("username", data.username);
                    sessionStorage.setItem("userid", data.id);
                    // Redirect to homepage or profile page
                    window.location.href = '../../index.html'; // Redirect to the homepage after successful login
                } else if(result === 'Not'){
                    sessionStorage.setItem("username", data.username);
                    sessionStorage.setItem("userid", data.id);
                    // Redirect to profile registration page
                    window.location.href = 'ProfileReg/profilereg.html'; // Redirect to profile registration page
                } else {
                    alert("Something went wrong.");
                }
            } else {
                alert('Login failed: Invalid response format.');
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
        // alert('Passwords do not match.');
        signupTeller.innerText = ""
        signupTeller.innerText = "Passwords do not match."
        signupTeller.style.color = 'red'
        return;
    }
    
    const signupData = { username, password };
    
    try {
        const response = await fetch('http://localhost:8080/register', {
            method: 'POST',
            credentials:'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: toJson(signupData)
        });
        
        if (response.ok) {
            const data = await response.text(); 
            alert(`Signup successful! ${data} Now Login`);
            switchForm('login');
        } else {
            const data = await response.text(); 
            signupTeller.innerText = ""
            signupTeller.innerText =  data;
            signupTeller.style.color = 'red'
            // alert('Signup failed with status ' + data);
        }
    } catch (error) {
        console.error('Error during signup:', error);
        alert('An error occurred during signup. Please try again.');
    }
});