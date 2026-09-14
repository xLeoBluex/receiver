// Estado da aplicação
let currentSection = 'dashboard';
let studentData = {
    name: 'Ana Silva Santos',
    id: '2024001',
    grades: [
        { subject: 'Matemática', grade1: 8.5, grade2: 9.0, assignments: 8.8, average: 8.8, status: 'approved' },
        { subject: 'Português', grade1: 9.2, grade2: 8.8, assignments: 9.0, average: 9.0, status: 'approved' },
        { subject: 'História', grade1: 7.5, grade2: 8.0, assignments: 7.8, average: 7.8, status: 'approved' },
        { subject: 'Geografia', grade1: 8.0, grade2: 7.5, assignments: 8.2, average: 7.9, status: 'approved' },
        { subject: 'Ciências', grade1: 9.0, grade2: 9.5, assignments: 9.2, average: 9.2, status: 'approved' },
        { subject: 'Inglês', grade1: 6.8, grade2: 7.2, assignments: 7.0, average: 7.0, status: 'approved' }
    ],
    assignments: [
        { id: 1, title: 'Lista de Exercícios - Álgebra', subject: 'Matemática', dueDate: '2024-10-15', status: 'pending', submitted: false },
        { id: 2, title: 'Redação - Meio Ambiente', subject: 'Português', dueDate: '2024-10-20', status: 'pending', submitted: false },
        { id: 3, title: 'Pesquisa - Brasil Colonial', subject: 'História', dueDate: '2024-10-12', status: 'overdue', submitted: false },
        { id: 4, title: 'Experimento - Densidade', subject: 'Ciências', dueDate: '2024-10-25', status: 'pending', submitted: true },
    ],
    schedule: [
        { time: '07:30-08:20', mon: 'Matemática', tue: 'Português', wed: 'História', thu: 'Geografia', fri: 'Ciências' },
        { time: '08:20-09:10', mon: 'Português', tue: 'Matemática', wed: 'Geografia', thu: 'História', fri: 'Inglês' },
        { time: '09:30-10:20', mon: 'História', tue: 'Ciências', wed: 'Matemática', thu: 'Português', fri: 'Geografia' },
        { time: '10:20-11:10', mon: 'Ciências', tue: 'Inglês', wed: 'Português', thu: 'Matemática', fri: 'História' },
        { time: '11:30-12:20', mon: 'Geografia', tue: 'História', wed: 'Ciências', thu: 'Inglês', fri: 'Português' }
    ],
    materials: [
        { id: 1, title: 'Resumo de Álgebra', subject: 'Matemática', type: 'pdf', downloadUrl: '#' },
        { id: 2, title: 'Lista de Verbos Irregulares', subject: 'Português', type: 'pdf', downloadUrl: '#' },
        { id: 3, title: 'Mapa do Brasil Colonial', subject: 'História', type: 'image', downloadUrl: '#' },
        { id: 4, title: 'Tabela Periódica', subject: 'Ciências', type: 'pdf', downloadUrl: '#' }
    ],
    messages: [
        { id: 1, sender: 'teacher', senderName: 'Prof. Maria', text: 'Boa tarde! Como estão os estudos?', time: '14:30' },
        { id: 2, sender: 'student', senderName: 'Ana Silva', text: 'Olá professora! Tenho dúvidas sobre a questão 5 da lista.', time: '14:32' },
        { id: 3, sender: 'teacher', senderName: 'Prof. Maria', text: 'Claro! Qual parte específica você não entendeu?', time: '14:35' }
    ]
};

// Função para trocar de seção
function switchSection(sectionName) {
    // Remove active de todos os nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });

    // Adiciona active no item clicado
    document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');

    // Esconde todas as seções
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('hidden');
    });

    // Mostra a seção selecionada
    document.getElementById(`${sectionName}-section`).classList.remove('hidden');

    currentSection = sectionName;

    // Carrega conteúdo da seção
    loadSectionContent(sectionName);
}

// Função para carregar conteúdo das seções
function loadSectionContent(sectionName) {
    switch(sectionName) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'grades':
            loadGrades();
            break;
        case 'assignments':
            loadAssignments();
            break;
        case 'schedule':
            loadSchedule();
            break;
        case 'materials':
            loadMaterials();
            break;
        case 'messages':
            loadMessages();
            break;
    }
}

// Carregar dashboard
function loadDashboard() {
    // Próximas tarefas
    const upcomingTasks = document.getElementById('upcoming-tasks');
    const pendingTasks = studentData.assignments.filter(a => a.status === 'pending').slice(0, 3);
    
    upcomingTasks.innerHTML = pendingTasks.map(task => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #f3f4f6;">
            <div>
                <p style="font-weight: 500; margin: 0 0 4px 0;">${task.title}</p>
                <p style="font-size: 14px; color: #6b7280; margin: 0;">${task.subject} - ${new Date(task.dueDate).toLocaleDateString('pt-BR')}</p>
            </div>
            <span class="badge ${task.status === 'overdue' ? 'badge-red' : 'badge-yellow'}">
                ${task.status === 'overdue' ? 'Atrasada' : 'Pendente'}
            </span>
        </div>
    `).join('');

    // Próximas aulas
    const upcomingClasses = document.getElementById('upcoming-classes');
    const today = new Date().getDay(); // 0 = domingo, 1 = segunda, etc.
    const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const todaySchedule = studentData.schedule.slice(0, 3);

    upcomingClasses.innerHTML = todaySchedule.map(slot => {
        const subjects = [slot.mon, slot.tue, slot.wed, slot.thu, slot.fri];
        const todaySubject = subjects[today - 1] || 'Sem aula';
        
        return `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #f3f4f6;">
                <div>
                    <p style="font-weight: 500; margin: 0 0 4px 0;">${todaySubject}</p>
                    <p style="font-size: 14px; color: #6b7280; margin: 0;">${slot.time}</p>
                </div>
                <span class="badge badge-blue">Hoje</span>
            </div>
        `;
    }).join('');
}

// Carregar notas
function loadGrades() {
    const gradesTable = document.getElementById('grades-table');
    gradesTable.innerHTML = studentData.grades.map(grade => `
        <tr>
            <td style="font-weight: 500;">${grade.subject}</td>
            <td>${grade.grade1.toFixed(1)}</td>
            <td>${grade.grade2.toFixed(1)}</td>
            <td>${grade.assignments.toFixed(1)}</td>
            <td style="font-weight: 600;">${grade.average.toFixed(1)}</td>
            <td>
                <span class="badge ${grade.status === 'approved' ? 'badge-green' : 'badge-red'}">
                    ${grade.status === 'approved' ? 'Aprovado' : 'Reprovado'}
                </span>
            </td>
        </tr>
    `).join('');
}

// Carregar tarefas
function loadAssignments() {
    const assignmentsList = document.getElementById('assignments-list');
    assignmentsList.innerHTML = studentData.assignments.map(assignment => `
        <div class="card assignment-card">
            <div class="assignment-header">
                <div>
                    <h3 class="assignment-title">
                        <i class="fas ${getSubjectIcon(assignment.subject)}" style="margin-right: 8px; color: #3b82f6;"></i>
                        ${assignment.title}
                    </h3>
                    <p class="assignment-due">
                        <i class="fas fa-calendar-alt" style="margin-right: 4px;"></i>
                        ${assignment.subject} - Prazo: ${new Date(assignment.dueDate).toLocaleDateString('pt-BR')}
                    </p>
                </div>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span class="badge ${getBadgeClass(assignment.status)}">
                        ${getStatusText(assignment.status)}
                    </span>
                    ${assignment.submitted ? 
                        '<i class="fas fa-check-circle" style="color: #10b981; font-size: 20px;"></i>' : 
                        '<i class="fas fa-clock" style="color: #f59e0b; font-size: 20px;"></i>'
                    }
                </div>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; align-items: center; gap: 16px;">
                    <span style="font-size: 14px; color: #6b7280;">
                        Status: ${assignment.submitted ? 'Entregue' : 'Não entregue'}
                    </span>
                </div>
                <div style="display: flex; gap: 8px;">
                    ${!assignment.submitted ? 
                        '<button class="btn btn-primary" onclick="submitAssignment(' + assignment.id + ')"><i class="fas fa-upload"></i> Entregar</button>' :
                        '<button class="btn btn-success"><i class="fas fa-eye"></i> Ver Entrega</button>'
                    }
                </div>
            </div>
        </div>
    `).join('');

    // Preenche select do modal
    const taskSelect = document.getElementById('task-select');
    const pendingTasks = studentData.assignments.filter(a => !a.submitted);
    taskSelect.innerHTML = '<option value="">Escolha uma tarefa...</option>' + 
        pendingTasks.map(task => `<option value="${task.id}">${task.title} (${task.subject})</option>`).join('');
}

// Carregar horários
function loadSchedule() {
    const scheduleTable = document.getElementById('schedule-table');
    scheduleTable.innerHTML = studentData.schedule.map(slot => `
        <tr>
            <td style="font-weight: 500;">${slot.time}</td>
            <td><i class="fas ${getSubjectIcon('Matemática')}" style="margin-right: 8px; color: #3b82f6;"></i>${slot.mon}</td>
            <td><i class="fas ${getSubjectIcon('Português')}" style="margin-right: 8px; color: #10b981;"></i>${slot.tue}</td>
            <td><i class="fas ${getSubjectIcon('História')}" style="margin-right: 8px; color: #f59e0b;"></i>${slot.wed}</td>
            <td><i class="fas ${getSubjectIcon('Geografia')}" style="margin-right: 8px; color: #8b5cf6;"></i>${slot.thu}</td>
            <td><i class="fas ${getSubjectIcon('Ciências')}" style="margin-right: 8px; color: #ef4444;"></i>${slot.fri}</td>
        </tr>
    `).join('');
}

// Carregar materiais
function loadMaterials() {
    const materialsList = document.getElementById('materials-list');
    materialsList.innerHTML = studentData.materials.map(material => `
        <div class="card" style="border-left: 4px solid #10b981; display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; align-items: center; gap: 16px;">
                <i class="fas ${getFileIcon(material.type)}" style="font-size: 24px; color: #10b981;"></i>
                <div>
                    <h3 style="margin: 0;">${material.title}</h3>
                    <p style="color: #6b7280; margin: 4px 0 0 0;">
                        <i class="fas ${getSubjectIcon(material.subject)}" style="margin-right: 4px;"></i>
                        ${material.subject}
                    </p>
                </div>
            </div>
            <div style="display: flex; gap: 8px;">
                <button class="btn btn-success" onclick="downloadMaterial('${material.id}')">
                    <i class="fas fa-download"></i> Baixar
                </button>
                <button class="btn btn-primary">
                    <i class="fas fa-eye"></i> Visualizar
                </button>
            </div>
        </div>
    `).join('');
}

// Carregar mensagens
function loadMessages() {
    const chatContainer = document.getElementById('chat-container');
    chatContainer.innerHTML = studentData.messages.map(message => `
        <div class="message ${message.sender}">
            <div class="message-bubble">
                <p style="margin: 0 0 4px 0; font-size: 14px;">${message.text}</p>
                <div class="message-info">
                    ${message.sender === 'teacher' ? 
                        `<i class="fas fa-chalkboard-teacher" style="margin-right: 4px;"></i>${message.senderName}` : 
                        `<i class="fas fa-user-graduate" style="margin-right: 4px;"></i>Você`
                    } - ${message.time}
                </div>
            </div>
        </div>
    `).join('');

    // Scroll para o final
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Funções auxiliares
function getSubjectIcon(subject) {
    const icons = {
        'Matemática': 'fa-calculator',
        'Português': 'fa-book',
        'História': 'fa-landmark',
        'Geografia': 'fa-globe',
        'Ciências': 'fa-flask',
        'Inglês': 'fa-language'
    };
    return icons[subject] || 'fa-book';
}

function getFileIcon(type) {
    const icons = {
        'pdf': 'fa-file-pdf',
        'image': 'fa-file-image',
        'doc': 'fa-file-word',
        'video': 'fa-file-video'
    };
    return icons[type] || 'fa-file';
}

function getBadgeClass(status) {
    const classes = {
        'pending': 'badge-yellow',
        'overdue': 'badge-red',
        'completed': 'badge-green'
    };
    return classes[status] || 'badge-blue';
}

function getStatusText(status) {
    const texts = {
        'pending': 'Pendente',
        'overdue': 'Atrasada',
        'completed': 'Concluída'
    };
    return texts[status] || 'Pendente';
}

// Funções de interação
function openSubmissionModal() {
    document.getElementById('submission-modal').classList.add('show');
}

function closeSubmissionModal() {
    document.getElementById('submission-modal').classList.remove('show');
    document.getElementById('submission-form').reset();
}

function submitAssignment(assignmentId) {
    // Encontra a tarefa e abre o modal com ela pré-selecionada
    const assignment = studentData.assignments.find(a => a.id === assignmentId);
    if (assignment) {
        openSubmissionModal();
        document.getElementById('task-select').value = assignmentId;
    }
}

function sendMessage() {
    const input = document.getElementById('message-input');
    const message = input.value.trim();
    
    if (!message) return;

    // Adiciona mensagem do estudante
    const newMessage = {
        id: studentData.messages.length + 1,
        sender: 'student',
        senderName: 'Ana Silva',
        text: message,
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    studentData.messages.push(newMessage);
    input.value = '';
    loadMessages();

    // Simula resposta automática do professor (opcional)
    setTimeout(() => {
        const autoReply = {
            id: studentData.messages.length + 1,
            sender: 'teacher',
            senderName: 'Prof. Maria',
            text: 'Obrigada pela mensagem! Vou responder em breve.',
            time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        };
        studentData.messages.push(autoReply);
        loadMessages();
    }, 2000);
}

function downloadMaterial(materialId) {
    alert('Download iniciado para o material ID: ' + materialId);
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            const section = this.getAttribute('data-section');
            switchSection(section);
        });
    });

    // Submissão de tarefa
    document.getElementById('submission-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const taskId = document.getElementById('task-select').value;
        const file = document.getElementById('submission-file').files[0];
        const text = document.getElementById('submission-text').value;

        if (!taskId) {
            alert('Selecione uma tarefa!');
            return;
        }

        if (!file && !text) {
            alert('Adicione um arquivo ou escreva uma resposta!');
            return;
        }

        // Marca tarefa como entregue
        const assignment = studentData.assignments.find(a => a.id == taskId);
        if (assignment) {
            assignment.submitted = true;
            assignment.status = 'completed';
        }

        alert('Tarefa enviada com sucesso!');
        closeSubmissionModal();
        
        if (currentSection === 'assignments') {
            loadAssignments();
        }
    });

    // Enter no chat
    document.getElementById('message-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Click fora do modal para fechar
    document.getElementById('submission-modal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeSubmissionModal();
        }
    });

    // Carrega conteúdo inicial
    loadDashboard();
});