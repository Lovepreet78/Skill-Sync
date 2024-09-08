document.addEventListener('DOMContentLoaded', async function() {
    console.log('DOM fully loaded and parsed'); // Check if DOM is ready
  
    const queryParams = new URLSearchParams(window.location.search);
    const inviterId = queryParams.get('inviterId');

    
    const userId = inviterId;
    if (userId) {
        await fetchUserProfile(userId);
    } else {
        console.error('No user selected');
    }

  });
  
  
  async function fetchUserProfile(userId) {
    
    const token = sessionStorage.getItem("token");
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
    document.querySelector('#university').innerHTML = "University : "+profile.university;
    document.querySelector('#email').innerHTML = "Email : "+profile.email;
    document.querySelector('#mobile').innerHTML = "Mobile Number : "+profile.phone;
    
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
  
  
  
  
  