document.addEventListener('DOMContentLoaded', async function() {
  console.log('DOM fully loaded and parsed'); // Check if DOM is ready
  
  const token = localStorage.getItem("token");

  const userId = sessionStorage.getItem('selectedUserId');
  if (userId) {
      await fetchUserProfile(userId);
  } else {
      console.error('No user selected');
  }
  document.getElementById('inviteButton').addEventListener('click',()=>{
    document.getElementById('invite-popup').style.display = 'block';
  })

  const currentLoginedUserId = sessionStorage.getItem('userid');

    document.getElementById('close-btn').addEventListener('click', function() {
        document.getElementById('invite-popup').style.display = 'none';
    });

    // Send invite when the "Send" button is clicked
    document.getElementById('send-invite-btn').addEventListener('click', async function() {
        const message = document.getElementById('invite-message').value;
        const senderId = currentLoginedUserId; 
        const sendInviteBtn = document.getElementById('send-invite-btn');
        const receiverId = userId;

        if (message.trim() === "") {
            alert("Please enter a message.");
            return;
        }

        if (!receiverId) {
            alert("Receiver ID is missing.");
            return;
        }
    
        const inviteData = {
            senderId: senderId,
            receiverId: receiverId,
            status: "Pending",
            sentDate: new Date().toISOString(),
            message: message
        };
    
        try {
            const response = await fetch('http://localhost:8080/api/invites/save', {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(inviteData)
            });
    
            if (response.ok) {
                alert('Invite sent successfully!');
                document.getElementById('invite-popup').style.display = 'none'; // Close the popup
                
                // Remove the receiverId attribute for security
                sendInviteBtn.removeAttribute('data-receiver-id');
            } else {
                alert('Failed to send invite.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    });
});


async function fetchUserProfile(userId) {
  
  const token = localStorage.getItem("token");
  try {
      const response = await fetch(`http://localhost:8080/api/user-profiles/${userId}`, {
          method: 'GET',
          
          headers: {
            'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
          }
      });

      console.log('Response:', response); // Log full response for debugging
      if (response.ok) {
          const profile = await response.json();
          console.log(profile); // Log profile data
          displayProfile(profile);
      } else {
          console.error('Error fetching profile:', response.status, response.statusText);
      }
  } catch (err) {
      console.error('Fetch error:', err);
  }
}


function displayProfile(profile) {

  document.querySelector('#name').innerHTML = profile.name+` (${profile.gender})`;
  document.querySelector('#university').innerHTML = profile.university;
  
  document.querySelector('#email').innerHTML = profile.email;
  document.querySelector('#profession').innerHTML = profile.profession;
  document.querySelector('#major').innerHTML = profile.major;
  document.querySelector('#bio').innerHTML = profile.bio;

  const skillsList = document.querySelector('.skill__list ul');
  skillsList.innerHTML = profile.skills.map(skill => `<li>${skill}</li>`).join('');
}







(() => {

    'use-strict'
  
    const themeSwiter = {
  
      init: function() {
        this.wrapper = document.getElementById('theme-switcher-wrapper')
        this.button = document.getElementById('theme-switcher-button')
        this.theme = this.wrapper.querySelectorAll('[data-theme]')
        this.themes = ['theme-orange', 'theme-purple', 'theme-green', 'theme-blue']
        this.events()
        this.start()
      },
      
      events: function() {
        this.button.addEventListener('click', this.displayed.bind(this), false)
        this.theme.forEach(theme => theme.addEventListener('click', this.themed.bind(this), false))
      },
  
      start: function() {
        let theme = this.themes[Math.floor(Math.random() * this.themes.length)]
        document.body.classList.add(theme)
      },
  
      displayed: function() {
        (this.wrapper.classList.contains('is-open'))
          ? this.wrapper.classList.remove('is-open')
          : this.wrapper.classList.add('is-open')
      },
  
      themed: function(e) {
        this.themes.forEach(theme => {
          if(document.body.classList.contains(theme))
            document.body.classList.remove(theme)
        })
        return document.body.classList.add(`theme-${e.currentTarget.dataset.theme}`)
      }
  
    }
  
    themeSwiter.init()
  
  })()




