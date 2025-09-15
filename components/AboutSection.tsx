export function AboutSection() {
  return (
    <section id="about" className="mb-20">
      <h3 className="text-3xl font-bold text-gray-900 mb-10 text-center">About</h3>
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <p className="text-lg text-gray-700 leading-relaxed">
            I'm a junior at Syracuse University studying <strong>Computer Science</strong> with minors in <strong>Statistics</strong> and <strong>Management</strong>, graduating December 2026. With a <strong>3.74 GPA (3.92 in core CS)</strong>, I've built strong skills in <strong>data structures, algorithms, probability, and statistics</strong>, and I'm currently deepening my focus through an <strong>AI engineering course</strong>.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            I'm passionate about applying math and programming to real-world problems, especially in <strong>data science and AI/ML</strong>, while also remaining interested in software engineering and project management. Outside the classroom, I bring <strong>seven years of professional experience at Market Basket</strong>, where I developed leadership and organizational skills, along with campus roles as <strong>Academic Excellence Chair and Governance Chair</strong> of Delta Upsilon fraternity. Through <strong>STEM Explorers</strong>, I've also worked to make engineering accessible and engaging for local students.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            I see myself as an <strong>aspiring AI engineer</strong> who thrives in collaborative environments, steps up as a leader when needed, and is motivated by solving meaningful problems.
          </p>
        </div>
        <div className="flex justify-center">
          <div className="relative">
            <img
              src="/headshot2.png"
              alt="Trevor Miller"
              className="rounded-lg shadow-lg max-w-sm w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}