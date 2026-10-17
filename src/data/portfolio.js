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
  { value: "8,000+", label: "registrations supported during a live college techfest" },
  { value: "200+", label: "contributions on GitHub" },
  { value: "2", label: "software development internships" }
];

export const experience = [
  {
    period: "Feb 2026 to Apr 2026",
    company: "We Analyz",
    role: "Jr. Software Developer Intern",
    tools: "JavaScript (ES6+), React.js, Redux.js, Fluent UI, Material UI",
    points: [
      "Implemented role-based access checks and ticket ownership validation to restrict unauthorised status changes on resolved tickets.",
      "Developed pagination and media preview functionality for tickets and opportunities, supporting images, PDFs, audio, and video files.",
      "Built responsive desktop and mobile UI features using React.js and Fluent UI, including loading indicators, calendar updates, and meeting interfaces.",
      "Worked with Redux, Redux Thunk, and application state management to understand and support data flow across the existing codebase.",
      "Implemented WhatsApp account setup workflows and Outlook-based meeting invitation functionality.",
      "Prepared technical documentation for Power Automate and WhatsApp workflows using the Zervise Bot Builder."
    ]
  },
  {
    period: "Dec 2025 to Jan 2026",
    company: "Techqueto Pvt Ltd.",
    role: "Frontend Developer Intern",
    tools: "TypeScript, React.js, Google Charts",
    points: [
      "Built dynamic line, bar, area, and pie charts using React and Google Charts.",
      "Implemented JSON-driven chart data and configuration, removing hardcoded values.",
      "Designed reusable chart utilities in common.ts for shared data and options.",
      "Integrated asynchronous data loading with useEffect.",
      "Debugged TypeScript, data-shape, and rendering issues across multiple chart types.",
      "Ensured charts were backend-ready and easy to extend."
    ]
  },
  {
    period: "Jan 2026 to May 2026",
    company: "National Post Graduate College",
    role: "Volunteer",
    tools: "HTML5, CSS3, JavaScript, Bootstrap",
    points: [
      "Developed a web-based registration platform using HTML5, CSS3, and JavaScript for a college techfest.",
      "Designed a responsive frontend as an alternative to traditional form-based registration workflows.",
      "Supported live event operations by handling registrations for over 8,000 students.",
      "Tested and refined interface behaviour for diverse user inputs under time constraints."
    ]
  }
];

export const skillGroups = [
  { number: "01", title: "Programming and markup", description: "JavaScript (ES6+), TypeScript, HTML5, CSS3" },
  { number: "02", title: "Frontend development", description: "React.js, Next.js, Redux.js, Tailwind CSS, Material UI, Bootstrap, SCSS" },
  { number: "03", title: "Backend development", description: "Node.js, Express.js, REST API, MongoDB (MERN)" },
  { number: "04", title: "Developer tools and platforms", description: "Git, GitHub, Insomnia, Render, Vercel" },
  { number: "05", title: "Concepts", description: "Responsive design, component-based architecture, API integration, version control workflows" }
];

export const education = [
  {
    label: "Currently pursuing",
    degree: "Master of Computer Applications (MCA)",
    institution: "Amity University Lucknow Campus",
    detail: "Amity Institute of Information Technology (AIIT)",
    period: "August 2026 to Present",
    current: true
  },
  {
    label: "Undergraduate study",
    degree: "Bachelor of Computer Applications (BCA)",
    institution: "National Post Graduate College",
    detail: "University of Lucknow (Affiliated)",
    period: "Sep 2023 to Jun 2026",
    current: false
  }
];
