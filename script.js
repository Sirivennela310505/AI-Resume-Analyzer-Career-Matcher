let lastJobRole = null;
let lastMatchedSkills = [];
let atsScore = 0;

/* ---------------- PDF Upload ---------------- */

async function uploadResumePDF() {
  const fileInput = document.getElementById("resumeFile");
  const file = fileInput.files[0];

  if (!file) {
    return;
  }

  if (file.type !== "application/pdf") {
    alert("Please upload a PDF resume.");
    return;
  }

  const reader = new FileReader();

  reader.onload = async function () {
    const typedArray = new Uint8Array(this.result);

    const pdf = await pdfjsLib.getDocument(typedArray).promise;

    let extractedText = "";

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const textItems = textContent.items.map(item => item.str);

      extractedText += textItems.join(" ");
    }

    document.getElementById("resumeText").value = extractedText;

    document.getElementById("uploadStatus").innerHTML =
      "Resume uploaded successfully. Analysis generated below.";

    analyzeResume();
  };

  reader.readAsArrayBuffer(file);
}

/* ---------------- Resume Analysis ---------------- */

function analyzeResume() {
  const text = document.getElementById("resumeText").value.toLowerCase();

  const resultDiv = document.getElementById("analysisResult");
  const careerDiv = document.getElementById("careerResult");

  if (!text.trim()) {
    resultDiv.innerHTML =
      "<p class='error'>Please upload a resume first.</p>";
    return;
  }

  const skills = {
    java: "Java",
    python: "Python",
    javascript: "JavaScript",
    html: "HTML",
    css: "CSS",
    react: "React",
    node: "Node.js",
    sql: "SQL",
    mysql: "MySQL",
    mongodb: "MongoDB",
    git: "Git",
    github: "GitHub",
    aws: "AWS",
    docker: "Docker",
    linux: "Linux",
    tensorflow: "TensorFlow",
    pytorch: "PyTorch",
    figma: "Figma",
    api: "API",
    firebase: "Firebase"
  };

  const keys = Object.keys(skills);

  const matched = keys.filter(skill => text.includes(skill));

  const missing = keys.filter(skill => !text.includes(skill));

  const resumeSections = {
    Education: text.includes("education"),
    Skills: text.includes("skills"),
    Projects: text.includes("projects"),
    Experience: text.includes("experience") || text.includes("internship"),
    Certifications:
      text.includes("certifications") || text.includes("certificate")
  };

  const sectionResult = Object.entries(resumeSections)
    .map(([section, found]) => {
      return found
        ? `<li class="section-found">✅ ${section} section found</li>`
        : `<li class="section-missing">❌ ${section} section missing</li>`;
    })
    .join("");

  atsScore = Math.min(100, 40 + matched.length * 5);

  let jobRole = "Student / Fresher";

  if (
    matched.includes("python") &&
    (matched.includes("tensorflow") || matched.includes("pytorch"))
  ) {
    jobRole = "AI / Machine Learning Engineer";
  } else if (matched.includes("react") && matched.includes("node")) {
    jobRole = "Full Stack Developer";
  } else if (matched.includes("react") && matched.includes("javascript")) {
    jobRole = "Frontend Developer";
  } else if (matched.includes("java") && matched.includes("sql")) {
    jobRole = "Backend Java Developer";
  } else if (
    matched.includes("aws") ||
    matched.includes("docker") ||
    matched.includes("linux")
  ) {
    jobRole = "Cloud / DevOps Engineer";
  }

  lastJobRole = jobRole;
  lastMatchedSkills = matched;
const foundSections = Object.values(resumeSections).filter(Boolean).length;
const sectionScore = foundSections * 20;
  resultDiv.innerHTML = `
    <h3>ATS Resume Score</h3>

    <div class="score-box">
      <div class="score-text">${atsScore}%</div>

      <div class="progress-bar">
        <div class="progress-fill" style="width:${atsScore}%"></div>
      </div>
    </div>
    <h3>Resume Strength Breakdown</h3>

<div class="breakdown-box">
  <div class="breakdown-item">
    <span>ATS Score</span>
    <div class="mini-bar">
      <div class="mini-fill" style="width:${atsScore}%"></div>
    </div>
    <strong>${atsScore}%</strong>
  </div>

  <div class="breakdown-item">
    <span>Skills Match</span>
    <div class="mini-bar">
      <div class="mini-fill" style="width:${matched.length * 8}%"></div>
    </div>
    <strong>${Math.min(100, matched.length * 8)}%</strong>
  </div>

  <div class="breakdown-item">
    <span>Section Quality</span>
    <div class="mini-bar">
      <div class="mini-fill" style="width:${sectionScore}%"></div>
    </div>
    <strong>${sectionScore}%</strong>
  </div>
</div>

    <h3>Resume Section Check</h3>

    <ul class="section-check">
      ${sectionResult}
    </ul>

    <h3>Best Matched Role</h3>
    <p><strong>${jobRole}</strong></p>

    <h3>Matched Skills</h3>
    <p>
      ${
        matched.length
          ? matched
              .map(skill => `<span class="tag">${skills[skill]}</span>`)
              .join(" ")
          : "No major skills found."
      }
    </p>

    <h3>Missing Skills</h3>
    <p>
      ${
        missing.length
          ? missing
              .slice(0, 8)
              .map(skill => `<span class="tag missing">${skills[skill]}</span>`)
              .join(" ")
          : "No major missing skills found."
      }
    </p>
    <h3>Priority Improvements</h3>
<ul>
  ${
    missing.length
      ? missing
          .slice(0, 3)
          .map(skill => `<li>Focus on improving <strong>${skills[skill]}</strong></li>`)
          .join("")
      : "<li>Your core technical skills look strong.</li>"
  }
</ul>

    <h3>Resume Improvement Tips</h3>

    <ul>
      <li>Add strong project descriptions with technologies used.</li>
      <li>Include GitHub and LinkedIn profile links.</li>
      <li>Mention internships, certifications, and achievements clearly.</li>
      <li>Use action words like Built, Developed, Designed, Improved.</li>
      <li>Add measurable impact in projects and internships.</li>
    </ul>
  `;

  careerDiv.innerHTML = `
    <p>
      Detected role:
      <strong>${jobRole}</strong>
    </p>

    <p>
      Click <strong>Career Match</strong> to view suitable career paths.
    </p>
  `;
}

/* ---------------- Career Recommendation ---------------- */

function recommendCareer() {
  const careerDiv = document.getElementById("careerResult");

  if (!lastJobRole) {
    analyzeResume();
  }

  if (!lastJobRole) {
    careerDiv.innerHTML =
      "<p class='error'>Please upload a resume first.</p>";
    return;
  }

  const careerPaths = {
    "AI / Machine Learning Engineer": {
      paths: ["AI Engineer", "Machine Learning Engineer", "Data Scientist"],
      roadmap: [
        "Learn Python deeply",
        "Practice SQL and data analysis",
        "Learn Machine Learning basics",
        "Build AI projects",
        "Create strong GitHub portfolio"
      ]
    },

    "Frontend Developer": {
      paths: ["Frontend Developer", "UI Developer", "React Developer"],
      roadmap: [
        "Master HTML CSS JavaScript",
        "Build responsive projects",
        "Learn React deeply",
        "Deploy projects online",
        "Improve UI/UX skills"
      ]
    },

    "Full Stack Developer": {
      paths: ["Full Stack Developer", "MERN Developer", "Software Engineer"],
      roadmap: [
        "Learn frontend and backend",
        "Understand databases",
        "Build CRUD projects",
        "Work with APIs",
        "Deploy full stack apps"
      ]
    },

    "Backend Java Developer": {
      paths: ["Java Developer", "Backend Developer", "Spring Boot Developer"],
      roadmap: [
        "Master Java",
        "Practice DSA",
        "Learn DBMS and SQL",
        "Learn Spring Boot",
        "Build backend projects"
      ]
    },

    "Cloud / DevOps Engineer": {
      paths: ["Cloud Engineer", "DevOps Engineer", "Site Reliability Engineer"],
      roadmap: [
        "Learn Linux basics",
        "Understand cloud concepts",
        "Learn AWS services",
        "Practice Docker",
        "Learn CI/CD basics"
      ]
    },

    "Student / Fresher": {
      paths: ["Software Developer Intern", "Frontend Intern", "Java Intern"],
      roadmap: [
        "Choose one core language",
        "Practice DSA daily",
        "Build strong projects",
        "Improve LinkedIn and GitHub",
        "Apply for internships"
      ]
    }
  };

  const entry = careerPaths[lastJobRole] || careerPaths["Student / Fresher"];

  careerDiv.innerHTML = `
    <h3>Suitable Career Paths</h3>

    <ul>
      ${entry.paths.map(path => `<li>${path}</li>`).join("")}
    </ul>

    <h3>Learning Roadmap</h3>

    <ol>
      ${entry.roadmap.map(step => `<li>${step}</li>`).join("")}
    </ol>
  `;
}

/* ---------------- Resume Insights ---------------- */

function showInsights() {
  const insightDiv = document.getElementById("insightResult");

  if (!lastMatchedSkills.length) {
    insightDiv.innerHTML =
      "<p class='error'>Please analyze a resume first.</p>";
    return;
  }

  let readiness = "Beginner Level";

  if (atsScore >= 80) {
    readiness = "Internship Ready";
  } else if (atsScore >= 60) {
    readiness = "Good, but needs improvement";
  }

  insightDiv.innerHTML = `
    <h3>Internship Readiness</h3>
    <p><strong>${readiness}</strong></p>

    <h3>Smart Resume Insights</h3>

    <ul>
      <li>
        Your strongest skills are:
        <strong>${lastMatchedSkills.slice(0, 5).join(", ")}</strong>
      </li>

      <li>Add measurable results in project descriptions.</li>
      <li>Include certifications and technical achievements clearly.</li>
      <li>Keep resume clean and ATS friendly.</li>
      <li>Add strong GitHub projects and portfolio links.</li>
    </ul>
  `;
}