const signinButton = document.getElementById('signinButton');
signinButton.onclick = goToSignInPage;
function goToSignInPage(){
    window.location.href = '../Auth/signup/signup.html';
}

document.addEventListener('DOMContentLoaded',function(){
    const signinButton = document.getElementById('signinButton');
    const userProfile = document.getElementById('userProfile');


    const username = sessionStorage.getItem('username');
    const userid = sessionStorage.getItem('userid');
    if(username && userid){
        signinButton.classList.add('hidden'); 
        userProfile.classList.remove('hidden'); 
    }

    const introImageFindTeammatesButton = document.getElementById('introImageFindTeammatesButton');
    introImageFindTeammatesButton.onclick = goToListAllUsers;
    function goToListAllUsers(){
        window.location.href = '../student Listing/list.html'
    }
}
);

