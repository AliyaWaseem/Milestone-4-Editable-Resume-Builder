interface WorkExperience {
    jobTitle: string;
    company: string;
    duration: string;
}

interface Education {
    degree: string;
    institution: string;
    year: string;
}

interface ResumeData {
    name: string;
    jobTitle: string;
    email: string;
    phone: string;
    skills: string[];
    profilePicUrl: string;
    workExperience: WorkExperience[];
    education: Education[];
}

let currentResumeData: ResumeData | null = null;

// Variables to keep track of the number of entries
let workExperienceCount = 1;
let educationCount = 1;

// Function to add more work experience fields
document.getElementById('add-work-experience')?.addEventListener('click', () => {
    workExperienceCount++;
    const container = document.getElementById('work-experience-container') as HTMLElement;
    const newExperience = document.createElement('div');
    newExperience.classList.add('work-experience-item');
    newExperience.innerHTML = `
        <label for="job-title-${workExperienceCount}">Job Title:</label>
        <input type="text" id="job-title-${workExperienceCount}" placeholder="Job Title" required>

        <label for="company-${workExperienceCount}">Company:</label>
        <input type="text" id="company-${workExperienceCount}" placeholder="Company Name" required>

        <label for="duration-${workExperienceCount}">Duration:</label>
        <input type="text" id="duration-${workExperienceCount}" placeholder="Duration (e.g., 2019-2021)" required>
    `;
    container.appendChild(newExperience);
});

// Function to add more education fields
document.getElementById('add-education')?.addEventListener('click', () => {
    educationCount++;
    const container = document.getElementById('education-container') as HTMLElement;
    const newEducation = document.createElement('div');
    newEducation.classList.add('education-item');
    newEducation.innerHTML = `
        <label for="degree-${educationCount}">Degree:</label>
        <input type="text" id="degree-${educationCount}" placeholder="Degree" required>

        <label for="institution-${educationCount}">Institution:</label>
        <input type="text" id="institution-${educationCount}" placeholder="Institution Name" required>

        <label for="year-${educationCount}">Year:</label>
        <input type="text" id="year-${educationCount}" placeholder="Year of Graduation" required>
    `;
    container.appendChild(newEducation);
});

// Function to handle form submission and generate the resume
document.getElementById('resume-form')?.addEventListener('submit', function (event) {
    event.preventDefault();

    const name = (document.getElementById('name') as HTMLInputElement).value;
    const jobTitle = (document.getElementById('job-title') as HTMLInputElement).value;
    const email = (document.getElementById('email') as HTMLInputElement).value;
    const phone = (document.getElementById('phone') as HTMLInputElement).value;
    const skills = (document.getElementById('skills') as HTMLTextAreaElement).value.split(',').map(skill => skill.trim());

    const profilePicInput = document.getElementById('profile-pic') as HTMLInputElement;
    const profilePicFile = profilePicInput.files?.[0];

    const reader = new FileReader();

    reader.onload = function (event) {
        const profilePicUrl = event.target?.result as string;

        // Collect work experience data
        const workExperience: WorkExperience[] = [];
        for (let i = 1; i <= workExperienceCount; i++) {
            const jobTitleInput = document.getElementById(`job-title-${i}`) as HTMLInputElement;
            const companyInput = document.getElementById(`company-${i}`) as HTMLInputElement;
            const durationInput = document.getElementById(`duration-${i}`) as HTMLInputElement;

            if (jobTitleInput && companyInput && durationInput) {
                workExperience.push({
                    jobTitle: jobTitleInput.value,
                    company: companyInput.value,
                    duration: durationInput.value
                });
            }
        }

        // Collect education data
        const education: Education[] = [];
        for (let i = 1; i <= educationCount; i++) {
            const degreeInput = document.getElementById(`degree-${i}`) as HTMLInputElement;
            const institutionInput = document.getElementById(`institution-${i}`) as HTMLInputElement;
            const yearInput = document.getElementById(`year-${i}`) as HTMLInputElement;

            if (degreeInput && institutionInput && yearInput) {
                education.push({
                    degree: degreeInput.value,
                    institution: institutionInput.value,
                    year: yearInput.value
                });
            }
        }

        const resumeData: ResumeData = {
            name,
            jobTitle,
            email,
            phone,
            skills,
            profilePicUrl,
            workExperience,
            education
        };

        currentResumeData = resumeData;
        generateResume(resumeData);
    };

    if (profilePicFile) {
        reader.readAsDataURL(profilePicFile);
    } else {
        if (currentResumeData && currentResumeData.profilePicUrl) {
            const profilePicUrl = currentResumeData.profilePicUrl;

            // Collect work experience and education data as above

            const resumeData: ResumeData = {
                name,
                jobTitle,
                email,
                phone,
                skills,
                profilePicUrl,
                workExperience: currentResumeData.workExperience,
                education: currentResumeData.education
            };

            currentResumeData = resumeData;
            generateResume(resumeData);
        } else {
            alert('Please upload a profile picture.');
        }
    }
});

// Function to generate the resume and make it editable
function generateResume(data: ResumeData) {
    currentResumeData = data;

    const resumeSection = document.getElementById('resume') as HTMLElement;

    // Clear previous content
    resumeSection.innerHTML = '';

    // Generate Work Experience HTML
    let workExperienceHtml = '';
    data.workExperience.forEach((exp, index) => {
        workExperienceHtml += `
            <div class="work-item">
                               <p id="job-title-${index + 1}" class="job-title" contenteditable="true">${exp.jobTitle}</p>

                <p id="company-${index + 1}" class="company" contenteditable="true">at ${exp.company}</p>
                <p id="duration-${index + 1}" class="duration" contenteditable="true">${exp.duration}</p>
            </div>
        `;
    });

    // Generate Education HTML
    let educationHtml = '';
    data.education.forEach((edu, index) => {
        educationHtml += `
            <div class="education-item">
                <p id="degree-${index + 1}" class="degree" contenteditable="true"><strong>${edu.degree}</strong></p>
                <p id="institution-${index + 1}" class="institution" contenteditable="true">from ${edu.institution}</p>
                <p id="year-${index + 1}" class="year" contenteditable="true">${edu.year}</p>
            </div>
        `;
    });

    // Construct the resume HTML
    resumeSection.innerHTML = `
        <div class="resume-details">
            <img src="${data.profilePicUrl}" alt="Profile Picture" class="profile-pic">
            <h2 id="name-section">${data.name}</h2>
            <h4 id="job-title-section">${data.jobTitle}</h4>
            <p id="email-section">Email: ${data.email}</p>
            <p id="phone-section">Phone: ${data.phone}</p>

            <h3>Skills</h3>
            <p id="skills-section">${data.skills.join(', ')}</p>

            <h3>Work Experience</h3>
            ${workExperienceHtml}

            <h3>Education</h3>
            ${educationHtml}
        </div>
    `;

    // Enable in-place editing
    enableEditing(data);
}

// Function to enable in-place editing for each section
function enableEditing(data: ResumeData) {
    // Personal Information
    ['name-section', 'job-title-section', 'email-section', 'phone-section'].forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('click', () => {
                makeSectionEditable(id, element.innerText, (newValue) => {
                    switch (id) {
                        case 'name-section':
                            data.name = newValue;
                            break;
                        case 'job-title-section':
                            data.jobTitle = newValue;
                            break;
                        case 'email-section':
                            data.email = newValue;
                            break;
                        case 'phone-section':
                            data.phone = newValue;
                            break;
                    }
                });
            });
        }
    });

    // Skills
    const skillsElement = document.getElementById('skills-section');
    if (skillsElement) {
        skillsElement.addEventListener('click', () => {
            makeSectionEditable('skills-section', data.skills.join(', '), (newValue) => {
                data.skills = newValue.split(',').map(skill => skill.trim());
            });
        });
    }

    // Work Experience
    data.workExperience.forEach((exp, index) => {
        const idx = index + 1;
        ['job-title', 'company', 'duration'].forEach(field => {
            const elementId = `${field}-${idx}`;
            const element = document.getElementById(elementId);
            if (element) {
                element.addEventListener('click', () => {
                    makeSectionEditable(elementId, element.innerText, (newValue) => {
                        exp[field as keyof WorkExperience] = newValue;
                    });
                });
            }
        });
    });

    // Education
    data.education.forEach((edu, index) => {
        const idx = index + 1;
        ['degree', 'institution', 'year'].forEach(field => {
            const elementId = `${field}-${idx}`;
            const element = document.getElementById(elementId);
            if (element) {
                element.addEventListener('click', () => {
                    makeSectionEditable(elementId, element.innerText, (newValue) => {
                        edu[field as keyof Education] = newValue;
                    });
                });
            }
        });
    });
}

// Utility function to make a section editable
function makeSectionEditable(sectionId: string, initialValue: string, onSave: (newValue: string) => void) {
    const sectionElement = document.getElementById(sectionId);
    if (!sectionElement) return;

    const inputElement = document.createElement('input');
    inputElement.type = 'text';
    inputElement.value = initialValue;
    inputElement.style.width = '100%';

    sectionElement.innerHTML = '';
    sectionElement.appendChild(inputElement);

    inputElement.focus();

    inputElement.addEventListener('blur', () => {
        const newValue = inputElement.value;
        sectionElement.innerText = newValue;
        onSave(newValue);
    });

    inputElement.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            inputElement.blur();
        }
    });
}
