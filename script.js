let lastJobRole = null;
let lastMatchedSkills = [];

const themeBtn = document.getElementById("themeToggle");
if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    document.body.classList.toggle("light");
    themeBtn.textContent = document.body.classList.contains("dark") ? "☀️ Light Mode" : "🌙 Dark Mode";
  });
}

function loadSample() {
  document.getElementById("resumeText").value = `
John Doe
Email: john.doe@example.com | Phone: +91-9876543210
LinkedIn: linkedin.com/in/johndoe | GitHub: github.com/johndoe

OBJECTIVE
Motivated Computer Science student passionate about software development and AI.

EDUCATION
B.Tech in Computer Science and Engineering (2021–2025)
XYZ Institute of Technology, Bengaluru

SKILLS
Python, Java, C++, HTML, CSS, JavaScript, React.js, Node.js, MySQL, Git, AWS

PROJECTS
AI Resume Analyzer, Smart Attendance System

INTERNSHIP
Software Development Intern - TechNova Solutions
`;
}

function analyzeResume() {
  const text = document.getElementById("resumeText").value.toLowerCase();
  const resultDiv = document.getElementById("analysisResult");
  const careerDiv = document.getElementById("careerResult");

  if (!text.trim()) {
    resultDiv.innerHTML = "<p style='color:red;'>⚠️ Please paste or load a resume first.</p>";
    return;
  }

  const skills = {
    python: "Python", java: "Java", "c++": "C++", javascript: "JavaScript",
    html: "HTML", css: "CSS", react: "React.js", node: "Node.js",
    sql: "SQL", mysql: "MySQL", mongodb: "MongoDB", aws: "AWS",
    docker: "Docker", linux: "Linux", tensorflow: "TensorFlow", pytorch: "PyTorch"
  };

  const keys = Object.keys(skills);
  const matched = keys.filter(s => text.includes(s));
  const missing = keys.filter(s => !text.includes(s));

  let jobRole = "Engineering Student";
  if (matched.includes("python") && (matched.includes("sql") || matched.includes("tensorflow") || matched.includes("pytorch"))) jobRole = "Data Analyst / ML Engineer";
  else if (matched.includes("react") && matched.includes("javascript")) jobRole = "Frontend Developer";
  else if (matched.includes("java") || matched.includes("c++")) jobRole = "Software Developer";
  else if (matched.includes("aws") || matched.includes("docker") || matched.includes("linux")) jobRole = "Cloud / DevOps Engineer";

  lastJobRole = jobRole;
  lastMatchedSkills = matched;
  resultDiv.innerHTML = `
    <h3>🎯 Best Matched Job Role:</h3>
    <p><strong>${jobRole}</strong></p>

    <h3>✅ Matched Skills:</h3>
    <p>${matched.length ? matched.map(s => `<span class="tag">${skills[s]}</span>`).join(" ") : "No major skills found."}</p>

    <h3>⚠️ Missing Skills:</h3>
    <p>${missing.length ? missing.map(s => `<span class="tag missing">${skills[s]}</span>`).join(" ") : "None — excellent resume!"}</p>

    <h3>🚀 Improvement Tips:</h3>
    <ul>
      <li>Learn or practice: <strong>${missing.slice(0, 4).map(s => skills[s]).join(", ") || "Keep refining your current skills!"}</strong></li>
      <li>Quantify your project achievements (e.g., "Reduced latency by 30%").</li>
      <li>Include links to project repos and live demos.</li>
    </ul>
  `;

  careerDiv.innerHTML = `<p>Detected role: <strong>${jobRole}</strong>. Click "Recommend Career Paths" for detailed suggestions.</p>`;
}

function recommendCareer() {
  const careerDiv = document.getElementById("careerResult");

  if (!lastJobRole) analyzeResume();
  if (!lastJobRole) {
    careerDiv.innerHTML = "<p style='color:red;'>⚠️ Please paste or load a resume first and click Analyze.</p>";
    return;
  }

  const careerPaths = {
    "Data Analyst / ML Engineer": {
      paths: ["Data Scientist", "Machine Learning Engineer", "Business Intelligence"],
      resources: [
        {title: "Coursera - Data Science Specialization", url: "https://www.coursera.org/"},
        {title: "fast.ai Practical Deep Learning", url: "https://www.fast.ai/"}
      ]
    },
    "Frontend Developer": {
      paths: ["UI/UX Designer", "React Native Developer", "Web Performance Engineer"],
      resources: [
        {title: "freeCodeCamp Frontend Libraries", url: "https://www.freecodecamp.org/"},
        {title: "Frontend Mentor (projects)", url: "https://www.frontendmentor.io/"}
      ]
    },
    "Software Developer": {
      paths: ["Backend Engineer", "Full-Stack Developer", "System Design Engineer"],
      resources: [
        {title: "GeeksforGeeks (DS & Algo)", url: "https://www.geeksforgeeks.org/"},
        {title: "Udemy - Java/Python courses", url: "https://www.udemy.com/"}
      ]
    },
    "Cloud / DevOps Engineer": {
      paths: ["DevOps Engineer", "Site Reliability Engineer", "Cloud Architect"],
      resources: [
        {title: "AWS Cloud Practitioner (Coursera)", url: "https://www.coursera.org/"},
        {title: "Linux Foundation / Kubernetes tutorials", url: "https://www.katacoda.com/"}
      ]
    },
    "Engineering Student": {
      paths: ["Internships", "Open Source Projects", "Certifications"],
      resources: [
        {title: "LinkedIn Learning & Internship Listings", url: "https://www.linkedin.com/"},
        {title: "GitHub - Practice with open source", url: "https://github.com/"}
      ]
    }
  };

  const entry = careerPaths[lastJobRole] || careerPaths["Engineering Student"];
  const pathsHtml = entry.paths.map(p => `<li>${p}</li>`).join("");
  const resourcesHtml = entry.resources.map(r => `<li><a href="${r.url}" target="_blank">${r.title}</a></li>`).join("");

  careerDiv.innerHTML = `
    <h3>🧭 Career paths for <strong>${lastJobRole}</strong>:</h3>
    <ul>${pathsHtml}</ul>

    <h3>📚 Recommended resources:</h3>
    <ul>${resourcesHtml}</ul>
  `;
}

function showInsights() {
  const insightDiv = document.getElementById("insightResult");

  if (!lastMatchedSkills.length) {
    insightDiv.innerHTML = "<p style='color:red;'>⚠️ Please analyze a resume first.</p>";
    return;
  }

  insightDiv.innerHTML = `
    <h3>💡 Smart Insights:</h3>
    <ul>
      <li>You're strong in <strong>${lastMatchedSkills.slice(0, 4).join(", ")}</strong> — keep highlighting these!</li>
      <li>Add more technical details in your projects section (e.g., tech stack used).</li>
      <li>Include measurable results (e.g., "Improved efficiency by 25%").</li>
      <li>Update your LinkedIn and GitHub links in the contact section.</li>
    </ul>
  `;
}

function downloadReport() {
  const content = document.getElementById("analysisResult").innerText;
  const blob = new Blob([content], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "resume_analysis_report.txt";
  link.click();
}
