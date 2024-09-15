import { BASE_URL } from '../../constant.js';
const signinButton = document.getElementById('signinButton');
signinButton.onclick = goToSignInPage;
function goToSignInPage(){
    window.location.href = '../Auth/signup/signup.html';
}
async function fetchCurrentUser(userid) {
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
            return response.json()
        } else{
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
        return;
    }
}


document.addEventListener('DOMContentLoaded',async function(){
    const signinButton = document.getElementById('signinButton');
    const userProfile = document.getElementById('userProfile');
    const logoutButton = document.getElementById('logoutButton');
    logoutButton.addEventListener('click',()=>{
        sessionStorage.removeItem('username');
        sessionStorage.removeItem('userid');
        sessionStorage.removeItem('token');
        sessionStorage.clear();
        window.location.href = '../Auth/signup/signup.html';
    })
    
    

    
    const username = sessionStorage.getItem('username');
    const userid = sessionStorage.getItem('userid');
    console.log(username,userid)
    if(username && userid){
        logoutButton.classList.remove('hidden')
        signinButton.classList.add('hidden'); 
        userProfile.classList.remove('hidden'); 
    }
    const currentUser  = await fetchCurrentUser(userid)
    if(currentUser){
        console.log(currentUser)
        if(currentUser.imageUrl)
        {
            userProfile.src  = currentUser.imageUrl
        }
    }

    const introImageFindTeammatesButton = document.getElementById('introImageFindTeammatesButton');
    introImageFindTeammatesButton.onclick = goToListAllUsers;
    function goToListAllUsers(){
        window.location.href = '../student Listing/list.html'
    }
    
    document.getElementById('invitesButton').addEventListener('click',()=>{
            window.location.href = '../InviteNotification/inviteNotification.html'
    })
    userProfile.addEventListener('click',function () {
        window.location.href = '../UserProfile/userprofile.html'
    })
}
);

