class StudentManager {
    constructor() {
        this.students = JSON.parse(localStorage.getItem('students')) || [];
    }

    populateDropdowns() {
        this.populateStudentFilter(); //used in Data page.
        this.populateStudentList(); // information used in Assign Subjects page.
    }

    populateStudentFilter() {
        const studentFilter = document.getElementById('student-filter');
        if (!studentFilter) return;
        studentFilter.innerHTML = '<option value="">Select a student</option>';
        this.students.forEach(student => {
            const option = document.createElement('option');
            option.value = student.id;
            option.textContent = `${student.name} ${student.lastName}`;
            studentFilter.appendChild(option);
        });
    }

    populateStudentList() {
        const studentList = document.getElementById('student-list');
        if (!studentList) return;
        studentList.innerHTML = '<option value="">Select a student</option>';
        this.students.forEach(student => {
            const option = document.createElement('option');
            option.value = student.id;
            option.textContent = `${student.name} ${student.lastName}`;
            studentList.appendChild(option);
        });
    }

    createStudent(event) {
        event.preventDefault();
        const name = document.getElementById('name').value;
        const lastName = document.getElementById('lastname').value;
        const age = document.getElementById('age').value;
        const gradeLevel = document.getElementById('grade').value;

        const newStudent = {
            id: Date.now(),
            name,
            lastName,
            age,
            gradeLevel,
            subjects: [], // Initialize subjects array
            grades: {}
        };

        this.students.push(newStudent);
        this.updateStorage();
        alert('Student created successfully.');
        document.getElementById('create-student-form').reset();
        this.populateDropdowns();
    }

    filterStudentData() {
        const studentId = document.getElementById('student-filter').value;
        this.displayStudentCard(studentId);
    }

    displayStudentCard(studentId) {
        const student = this.students.find(s => s.id.toString() === studentId);
        if (!student) return;

        const container = document.getElementById('students-table-container');
        container.innerHTML = ''; // Clear previous content

        let subjectsHtml = student.subjects.length > 0 ? student.subjects.map(subject => {
            let grade = student.grades[subject] || '';
            return `<div><p>${subject}: <input type="number" min="0" max="100" placeholder="Grade" value="${grade}" id="grade-${subject}"></p></div>`;
        }).join('') : '<p>No subjects assigned.</p>';

        const card = `
            <div class="student-card">
                <h3>${student.name} ${student.lastName}</h3>
                <p>Age: ${student.age}</p>
                <p>Grade Level: ${student.gradeLevel}</p>
                <h4>Subjects and Grades:</h4>
                ${subjectsHtml}
                <button onclick="studentManager.saveGrades(${student.id})">Save Grades</button>
            </div>
        `;
        container.innerHTML = card;
    }

    saveGrades(studentId) {
        const student = this.students.find(s => s.id === studentId);
        if (!student) return;

        student.subjects.forEach(subject => {
            const gradeValue = document.getElementById(`grade-${subject}`).value;
            if (gradeValue) {
                student.grades[subject] = gradeValue;
            }
        });

        this.updateStorage();
        alert('Grades saved successfully.');
        this.displayStudentCard(studentId.toString()); // Ensures ID is a string for matching
    }

    updateStorage() {
        localStorage.setItem('students', JSON.stringify(this.students));
    }

    clearAllData() {
        if (confirm("Are you sure you want to clear all data?")) {
            localStorage.clear();
            this.students = [];
            alert('All data cleared successfully.');
            this.populateDropdowns();
            document.getElementById('students-table-container').innerHTML = '';
        }
    }
}

const studentManager = new StudentManager();

document.addEventListener('DOMContentLoaded', function () {
    studentManager.populateDropdowns();

    const studentFilter = document.getElementById('student-filter');
    if (studentFilter) {
        studentFilter.addEventListener('change', () => studentManager.filterStudentData());
        studentManager.filterStudentData(); // Initial call
    }

    const createStudentForm = document.getElementById('create-student-form');
    if (createStudentForm) {
        createStudentForm.addEventListener('submit', (event) => studentManager.createStudent(event));
    }
});

window.assignSubjects = function () {
    const studentId = document.getElementById('student-list').value;
    const subjects = Array.from(document.querySelectorAll('input[name="subjects"]:checked')).map(el => el.value);
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const student = students.find(s => s.id == studentId);
    if (student) {
        student.subjects = subjects;
        localStorage.setItem('students', JSON.stringify(students));
        alert('Subjects assigned successfully.');
        studentManager.populateDropdowns(); // Refresh dropdowns to reflect the changes
    } else {
        alert('Please select a student.');
    }
};
