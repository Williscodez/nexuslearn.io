
    function adjustAnimation() {
      const mapElement = document.querySelector('.hero-map');
      if (window.innerWidth < 600) {
        // On smaller screens, make the pulse slower
        mapElement.style.animationDuration = '3s';
      } else {
        // On larger screens, keep the original speed
        mapElement.style.animationDuration = '2s';
      }
    }
  
    // Call the function on initial load and when the window resizes
    adjustAnimation();
    window.addEventListener('resize', adjustAnimation);

   
        const startLearningButton = document.querySelector('.hero .button');
        const modal = document.getElementById('subjectModal');
        const closeButton = document.querySelector('.close-button');
        const gotoSubjectButton = document.getElementById('gotoSubject');
        const subjectDropdown = document.getElementById('subjectDropdown');
      
        startLearningButton.addEventListener('click', () => {
          modal.style.display = 'block';
        });
      
        closeButton.addEventListener('click', () => {
          modal.style.display = 'none';
        });
      
        window.addEventListener('click', (event) => {
          if (event.target === modal) {
            modal.style.display = 'none';
          }
        });
      
        gotoSubjectButton.addEventListener('click', () => {
          const selectedSubject = subjectDropdown.value;
          if (selectedSubject) {
            // Redirect the user to the selected subject page
            window.location.href = `#${selectedSubject}`; // Replace with your actual subject page URLs
            modal.style.display = 'none'; // Close the modal after redirection
          } else {
            alert('Please select a subject.');
          }
        });
      
        // Optional: Functionality for the subject group dropdown to filter subjects
        const subjectGroupDropdown = document.getElementById('subjectGroup');
        const subjectOptions = subjectDropdown.querySelectorAll('optgroup');
        const allSubjectsOption = subjectDropdown.querySelector('option[value=""]');
      
        subjectGroupDropdown.addEventListener('change', (event) => {
          const selectedGroup = event.target.value;
      
          subjectOptions.forEach(group => {
            group.style.display = (selectedGroup === '' || group.label.toLowerCase().includes(selectedGroup.toLowerCase())) ? 'block' : 'none';
          });
          allSubjectsOption.style.display = 'block'; // Always show the "All Subjects" option
          subjectDropdown.value = ''; // Reset the subject selection when the group changes
        });
      
    

    

 