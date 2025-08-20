// ---------- Helpers ----------
async function loadJSON(path) {
  try {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading JSON:', path, error);
    return null;
  }
}

// ---------- Social Links ----------
function setSocialLinks(social) {
  if (!social) return;
  
  const linkedin = document.getElementById('cta-linkedin');
  const github = document.getElementById('cta-github');
  
  if (linkedin && social.linkedin) linkedin.href = social.linkedin;
  if (github && social.github) github.href = social.github;
}

// ---------- Build project card ----------
function createProjectCard(project) {
  const card = document.createElement('div');
  card.className = 'card';
  
  // Use first image or fallback
  const imageSrc = (project.images && project.images[0] && project.images[0].src) || 
                   project.imageOrVideo || 
                   './public/projects/placeholder.jpg';
  
  card.innerHTML = `
    <img src="${imageSrc}" alt="" aria-hidden="true" style="width:100%;height:160px;object-fit:cover;border-radius:12px;border:1px solid var(--line);margin-bottom:.6rem"/>
    <h3>${project.title || 'Untitled Project'}</h3>
    <p>${project.description || 'No description available'}</p>
    <p><strong>Tech:</strong> ${Array.isArray(project.tech) ? project.tech.join(', ') : (project.tech || 'Not specified')}</p>
    <div style="display:flex;gap:.5rem;flex-wrap:wrap">
      <a class="btn" href="${project.repoURL || '#'}" target="_blank" rel="noopener">View Repo</a>
    </div>
  `;
  
  return card;
}

// ---------- Load and display content ----------
async function loadContent() {
  try {
    // Load social links
    const social = await loadJSON('./data/social.json');
    setSocialLinks(social);

    // Load and display projects
    const projects = await loadJSON('./data/projects.json');
    const projectGrid = document.getElementById('project-grid');
    
    if (projects && projects.length > 0) {
      // Clear loading message
      projectGrid.innerHTML = '';
      
      // Display up to 3 projects
      projects.slice(0, 3).forEach(project => {
        const card = createProjectCard(project);
        projectGrid.appendChild(card);
      });
    } else {
      projectGrid.innerHTML = '<div class="card"><h3>No Projects</h3><p>Projects will be added soon.</p></div>';
    }

    // Load and display skills
    const skills = await loadJSON('./data/skills.json');
    const skillsContainer = document.getElementById('skills-chips');
    
    if (skills) {
      // Clear loading message
      skillsContainer.innerHTML = '';
      
      const categories = ['Languages', 'Frameworks', 'Tools/Cloud', 'Coursework'];
      categories.forEach(category => {
        const skillList = skills[category] || [];
        
        if (skillList.length > 0) {
          const categoryDiv = document.createElement('div');
          categoryDiv.className = 'skill-category';
          categoryDiv.innerHTML = `<h3>${category}</h3>`;
          
          const chipsDiv = document.createElement('div');
          chipsDiv.className = 'skill-chips';
          
          skillList.forEach(skill => {
            const chip = document.createElement('span');
            chip.className = 'btn skill-chip';
            chip.textContent = skill;
            chipsDiv.appendChild(chip);
          });
          
          categoryDiv.appendChild(chipsDiv);
          skillsContainer.appendChild(categoryDiv);
        }
      });
    } else {
      skillsContainer.innerHTML = '<div class="skill-category"><h3>Skills</h3><div class="skill-chips"><span class="btn skill-chip">Loading failed</span></div></div>';
    }

  } catch (error) {
    console.error('Error loading content:', error);
  }
}

// ---------- Initialize when page loads ----------
document.addEventListener('DOMContentLoaded', loadContent);