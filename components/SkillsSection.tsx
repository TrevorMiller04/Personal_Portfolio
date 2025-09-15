'use client'

import { useState } from 'react'
import skillsData from '../data/skills.json'

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
    <section id="skills" className="mb-20">
      <h3 className="text-3xl font-bold text-gray-900 mb-10 text-center">Skills</h3>
      <div className="space-y-8">
        {Object.entries(skills).map(([categoryName, categorySkills]) => (
          <div key={categoryName} className="space-y-4">
            <h4 className="text-xl font-semibold text-gray-800">{categoryName}</h4>
            <div className="flex flex-wrap gap-3">
              {categorySkills.map((skill) => (
                <button
                  key={skill.name}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 border ${
                    selectedSkill === skill.name
                      ? 'bg-syracuse-blue text-white border-syracuse-blue'
                      : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-syracuse-blue hover:text-white hover:border-syracuse-blue'
                  }`}
                  onClick={() => handleSkillClick(skill.name)}
                >
                  {skill.name}
                </button>
              ))}
            </div>
            {selectedSkill && categorySkills.some(s => s.name === selectedSkill) && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h5 className="text-lg font-semibold text-gray-800 mb-3">{selectedSkill}</h5>
                <ul className="space-y-2">
                  {findSkillDetails(selectedSkill).map((experience, index) => (
                    <li key={index} className="text-gray-700 flex items-start">
                      <span className="text-syracuse-blue mr-2 mt-1">•</span>
                      {experience}
                    </li>
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