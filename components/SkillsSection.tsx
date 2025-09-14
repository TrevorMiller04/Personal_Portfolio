'use client'

import { useState } from 'react'
import skillsData from '@/data/skills.json'

interface Skill {
  name: string;
  experience: string[];
}

interface SkillCategory {
  [key: string]: Skill[];
}

export function SkillsSection() {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null)
  const skills = skillsData as SkillCategory

  const handleSkillClick = (skillName: string) => {
    setSelectedSkill(selectedSkill === skillName ? null : skillName)
  }

  const findSkillDetails = (skillName: string): string[] => {
    for (const category of Object.values(skills)) {
      const skill = category.find(s => s.name === skillName)
      if (skill) return skill.experience
    }
    return []
  }

  return (
    <section id="skills" className="section">
      <h2>Skills</h2>
      <div id="skills-chips">
        {Object.entries(skills).map(([categoryName, categorySkills]) => (
          <div key={categoryName} className="skill-category">
            <h3>{categoryName}</h3>
            <div className="skill-chips">
              {categorySkills.map((skill) => (
                <button
                  key={skill.name}
                  className="btn skill-chip"
                  onClick={() => handleSkillClick(skill.name)}
                  style={{
                    backgroundColor: selectedSkill === skill.name ? 'var(--brand1)' : 'var(--muted)',
                    color: selectedSkill === skill.name ? 'white' : 'var(--brand2)',
                    borderColor: selectedSkill === skill.name ? 'var(--brand1)' : 'var(--line)'
                  }}
                >
                  {skill.name}
                </button>
              ))}
            </div>
            {selectedSkill && categorySkills.some(s => s.name === selectedSkill) && (
              <div className="skill-details">
                <h4>{selectedSkill}</h4>
                <ul>
                  {findSkillDetails(selectedSkill).map((experience, index) => (
                    <li key={index}>{experience}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}