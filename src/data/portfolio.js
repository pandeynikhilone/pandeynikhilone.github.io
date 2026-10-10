export const profile = {
  name: "Nikhil Pandey",
  initials: "NP",
  location: "Lucknow, India",
  email: "pandeynikhilone@gmail.com",
  phone: "+91 96764 55712",
  linkedin: "https://www.linkedin.com/in/pandeynikhilone/",
  github: "https://github.com/pandeynikhilone"
};

export const highlights = [
  { value: "8,000+", label: "students supported through techfest registration" },
  { value: "200+", label: "contributions on GitHub" },
  { value: "3", label: "hands-on roles across internship, volunteering, and projects" }
];

export const experience = [
  {
    period: "Dec 2025 to Jan 2026",
    company: "Techqueto Pvt Ltd.",
    role: "Frontend Developer Intern",
    tools: "TypeScript, React.js, Google Charts",
    points: [
      "Built dynamic line, bar, area, and pie charts using React and Google Charts.",
      "Moved chart values and configuration into JSON-driven data instead of keeping them hardcoded.",
      "Created reusable chart utilities in common.ts and integrated asynchronous data loading with useEffect.",
      "Debugged TypeScript, data-shape, and rendering issues across different chart types."
    ]
  },
  {
    period: "Dec 2024 to Feb 2025",
    company: "National Post Graduate College",
    role: "Frontend Developer Volunteer",
    tools: "HTML5, CSS3, JavaScript, Bootstrap",
    points: [
      "Built a responsive registration frontend for the college techfest as an alternative to traditional form-based registration.",
      "Tested and refined form behavior for different inputs under event deadlines.",
      "Supported the live event registration process for more than 8,000 students."
    ]
  }
];

export const skillGroups = [
  { number: "01", title: "Programming and markup", description: "JavaScript ES6+, TypeScript, HTML5, CSS3" },
  { number: "02", title: "Frontend", description: "React.js, Next.js, React Native, Tailwind CSS, Bootstrap, SCSS" },
  { number: "03", title: "Backend and data", description: "Node.js, Express.js, REST APIs, MongoDB" },
  { number: "04", title: "Tools and platforms", description: "Git, GitHub, Insomnia, Render, Vercel, Google Charts" },
  { number: "05", title: "Development practices", description: "Responsive design, component-based architecture, API integration, version control workflows" },
  { number: "06", title: "Team workflow", description: "Exposure to agile development and iterative debugging" }
];

export const education = [
  {
    label: "Currently pursuing",
    degree: "Master of Computer Applications",
    institution: "Amity University, Lucknow Campus",
    period: "2026 to 2028",
    current: true
  },
  {
    label: "Undergraduate study",
    degree: "Bachelor of Computer Applications",
    institution: "National Post Graduate College",
    detail: "University of Lucknow affiliated",
    period: "May 2023 to June 2026",
    current: false
  }
];
