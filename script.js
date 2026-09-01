// ==================== GECE/GÜNDÜZ MODU ====================
function toggleTheme() {
    const body = document.body;
    const themeBtn = document.getElementById('themeBtn');
    
    if (body.classList.contains('light-mode')) {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
        themeBtn.textContent = '☀️';
        localStorage.setItem('theme', 'dark');
    } else {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        themeBtn.textContent = '🌙';
        localStorage.setItem('theme', 'light');
    }
}

// Tema yükleme (sayfa açıldığında)
function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const body = document.body;
    const themeBtn = document.getElementById('themeBtn');
    
    if (savedTheme === 'dark') {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
        themeBtn.textContent = '☀️';
    } else {
        body.classList.add('light-mode');
        themeBtn.textContent = '🌙';
    }
}

// ==================== DİL AYARLARI ====================
const languages = {
    tr: {
        name: 'Türkçe',
        flag: '🇹🇷'
    },
    en: {
        name: 'English',
        flag: '🇬🇧'
    },
    de: {
        name: 'Deutsch',
        flag: '🇩🇪'
    },
    ru: {
        name: 'Русский',
        flag: '🇷🇺'
    },
    az: {
        name: 'Azərbaycan',
        flag: '🇦🇿'
    }
};

// Tarayıcı dilini algıla ve yönlendir
function detectAndRedirectLanguage() {
    const currentPath = window.location.pathname;
    
    // Eğer zaten bir dil klasöründeyse, yönlendirme yapma
    const langPattern = /\/(tr|en|de|ru|az)\//;
    if (langPattern.test(currentPath)) {
        return;
    }
    
    const userLang = navigator.language || navigator.userLanguage;
    const langCode = userLang.split('-')[0];
    
    if (languages[langCode]) {
        window.location.href = `/${langCode}/index.html`;
    } else {
        // Varsayılan olarak Türkçe
        window.location.href = '/tr/index.html';
    }
}

// ==================== TEST/SINAV SISTEMI ====================
class QuizEngine {
    constructor(questions, timeLimit = null) {
        this.questions = questions;
        this.timeLimit = timeLimit;
        this.currentQuestionIndex = 0;
        this.answers = [];
        this.score = 0;
        this.timeRemaining = timeLimit;
        this.startTime = Date.now();
        this.isQuizActive = true;
    }

    getCurrentQuestion() {
        return this.questions[this.currentQuestionIndex];
    }

    selectAnswer(optionIndex) {
        if (!this.isQuizActive) return;
        this.answers[this.currentQuestionIndex] = optionIndex;
    }

    nextQuestion() {
        if (this.currentQuestionIndex < this.questions.length - 1) {
            this.currentQuestionIndex++;
            return true;
        }
        return false;
    }

    previousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            return true;
        }
        return false;
    }

    calculateScore() {
        this.score = 0;
        this.questions.forEach((question, index) => {
            if (this.answers[index] === question.correctAnswer) {
                this.score += 100 / this.questions.length;
            }
        });
        return Math.round(this.score);
    }

    getResults() {
        const results = {
            totalQuestions: this.questions.length,
            correctAnswers: 0,
            wrongAnswers: 0,
            blankAnswers: 0,
            score: this.calculateScore(),
            details: []
        };

        this.questions.forEach((question, index) => {
            const userAnswer = this.answers[index];
            const isCorrect = userAnswer === question.correctAnswer;
            const isBlank = userAnswer === undefined || userAnswer === null;

            if (isCorrect) {
                results.correctAnswers++;
            } else if (isBlank) {
                results.blankAnswers++;
            } else {
                results.wrongAnswers++;
            }

            results.details.push({
                questionNumber: index + 1,
                question: question.question,
                userAnswer: userAnswer !== undefined ? question.options[userAnswer] : 'Boş',
                correctAnswer: question.options[question.correctAnswer],
                isCorrect: isCorrect
            });
        });

        return results;
    }

    startTimer() {
        if (!this.timeLimit) return;

        const timerInterval = setInterval(() => {
            this.timeRemaining--;

            const timerElement = document.getElementById('timer');
            if (timerElement) {
                const minutes = Math.floor(this.timeRemaining / 60);
                const seconds = this.timeRemaining % 60;
                timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

                if (this.timeRemaining <= 300 && this.timeRemaining > 0) {
                    timerElement.classList.add('warning');
                }

                if (this.timeRemaining <= 0) {
                    clearInterval(timerInterval);
                    this.isQuizActive = false;
                    this.endQuiz();
                }
            }
        }, 1000);
    }

    endQuiz() {
        this.isQuizActive = false;
        const endBtn = document.querySelector('.quiz-btn-finish');
        if (endBtn) {
            endBtn.click();
        }
    }
}

// ==================== KONU İLERLEME TAKIBI ====================
class ProgressTracker {
    constructor() {
        this.storageKey = 'dersdunyasi_progress';
        this.progress = this.loadProgress();
    }

    loadProgress() {
        const saved = localStorage.getItem(this.storageKey);
        return saved ? JSON.parse(saved) : {};
    }

    saveProgress() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.progress));
    }

    completeLesson(lessonId) {
        if (!this.progress[lessonId]) {
            this.progress[lessonId] = {
                completed: true,
                completedAt: new Date().toISOString()
            };
            this.saveProgress();
            return true;
        }
        return false;
    }

    isLessonCompleted(lessonId) {
        return this.progress[lessonId] && this.progress[lessonId].completed;
    }

    getCompletedCount() {
        return Object.keys(this.progress).filter(key => this.progress[key].completed).length;
    }

    getTotalCompletedLessons() {
        return Object.values(this.progress).filter(lesson => lesson.completed).length;
    }
}

// ==================== SERTİFİKA SISTEMI ====================
class CertificateManager {
    constructor() {
        this.storageKey = 'dersdunyasi_certificates';
        this.certificates = this.loadCertificates();
    }

    loadCertificates() {
        const saved = localStorage.getItem(this.storageKey);
        return saved ? JSON.parse(saved) : [];
    }

    saveCertificates() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.certificates));
    }

    addCertificate(courseName, score, date = new Date()) {
        const certificate = {
            id: 'CERT_' + Date.now(),
            courseName: courseName,
            score: score,
            issuedDate: date.toISOString(),
            certificateNumber: this.generateCertificateNumber()
        };
        this.certificates.push(certificate);
        this.saveCertificates();
        return certificate;
    }

    generateCertificateNumber() {
        return 'DD' + new Date().getFullYear() + Math.random().toString(36).substr(2, 9).toUpperCase();
    }

    getCertificates() {
        return this.certificates;
    }

    downloadCertificate(certificateId) {
        const cert = this.certificates.find(c => c.id === certificateId);
        if (!cert) return;

        const canvas = document.createElement('canvas');
        canvas.width = 1200;
        canvas.height = 800;
        const ctx = canvas.getContext('2d');

        // Arka plan
        ctx.fillStyle = '#f4e4c1';
        ctx.fillRect(0, 0, 1200, 800);

        // Kenarlık
        ctx.strokeStyle = '#b8860b';
        ctx.lineWidth = 10;
        ctx.strokeRect(20, 20, 1160, 760);

        // Başlık
        ctx.fillStyle = '#8b4513';
        ctx.font = 'bold 60px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('SERTIFIKA', 600, 120);

        // İçerik
        ctx.fillStyle = '#333';
        ctx.font = '24px Arial';
        ctx.fillText(`${cert.courseName} Kursunu Başarıyla Tamamladınız`, 600, 250);

        ctx.font = 'bold 30px Arial';
        ctx.fillText(`Puan: ${cert.score}%`, 600, 330);

        ctx.font = '20px Arial';
        ctx.fillText(`Sertifika No: ${cert.certificateNumber}`, 600, 400);
        ctx.fillText(`Tarih: ${new Date(cert.issuedDate).toLocaleDateString('tr-TR')}`, 600, 450);

        // İndir
        const link = document.createElement('a');
        link.href = canvas.toDataURL();
        link.download = `sertifika_${cert.certificateNumber}.png`;
        link.click();
    }
}

// ==================== VİDEO YÖNETİCİ ====================
class VideoManager {
    static openVideo(videoId) {
        const modal = document.getElementById('videoModal');
        if (!modal) return;

        const videoFrame = document.getElementById('videoFrame');
        videoFrame.src = `https://www.youtube.com/embed/${videoId}`;
        modal.style.display = 'block';
    }

    static closeVideo() {
        const modal = document.getElementById('videoModal');
        if (modal) {
            modal.style.display = 'none';
            const videoFrame = document.getElementById('videoFrame');
            if (videoFrame) videoFrame.src = '';
        }
    }

    static getSuggestions(courseName) {
        const suggestions = {
            'algebra': 'https://www.youtube.com/embed/wh-TdrLq-hE',
            'geometry': 'https://www.youtube.com/embed/cJlDZ9y6cWY',
            'trigonometry': 'https://www.youtube.com/embed/WVxg2DbvI94',
            'calculus': 'https://www.youtube.com/embed/rB83DpBr93s',
            'physics': 'https://www.youtube.com/embed/kKKM8Y-u7f4',
            'chemistry': 'https://www.youtube.com/embed/0KiUzXcBjSY',
            'english': 'https://www.youtube.com/embed/zBF-bw5LjqE',
            'programming': 'https://www.youtube.com/embed/PkZNo7MFNFg'
        };
        return suggestions[courseName.toLowerCase()] || null;
    }
}

// ==================== QUIZ RENDER FONKSIYONLARI ====================
function renderQuestion(quiz) {
    const container = document.getElementById('quizContainer');
    if (!container) return;

    const question = quiz.getCurrentQuestion();
    const questionIndex = quiz.currentQuestionIndex;
    const totalQuestions = quiz.questions.length;

    const progressPercent = ((questionIndex + 1) / totalQuestions) * 100;

    let html = `
        <div class="progress-bar">
            <div class="progress-fill" style="width: ${progressPercent}%"></div>
        </div>
        
        <div class="question-card">
            <div class="question-number">Soru ${questionIndex + 1} / ${totalQuestions}</div>
            <h3>${question.question}</h3>
            
            <div class="options">
    `;

    question.options.forEach((option, index) => {
        const isSelected = quiz.answers[questionIndex] === index;
        const selectedClass = isSelected ? 'selected' : '';
        html += `
            <div class="option ${selectedClass}" onclick="selectOption(${index})">
                <strong>${String.fromCharCode(65 + index)}.</strong> ${option}
            </div>
        `;
    });

    html += `
            </div>
        </div>

        <div class="quiz-controls">
            ${questionIndex > 0 ? `<button onclick="previousQuestion()" class="btn-prev">← Önceki</button>` : ''}
            ${questionIndex < totalQuestions - 1 ? `<button onclick="nextQuestion()" class="btn-next">Sonraki →</button>` : ''}
            ${questionIndex === totalQuestions - 1 ? `<button onclick="finishQuiz()" class="quiz-btn-finish">Testi Bitir</button>` : ''}
        </div>
    `;

    container.innerHTML = html;
}

function selectOption(index) {
    if (window.quizEngine) {
        window.quizEngine.selectAnswer(index);
        renderQuestion(window.quizEngine);
    }
}

function nextQuestion() {
    if (window.quizEngine && window.quizEngine.nextQuestion()) {
        renderQuestion(window.quizEngine);
    }
}

function previousQuestion() {
    if (window.quizEngine && window.quizEngine.previousQuestion()) {
        renderQuestion(window.quizEngine);
    }
}

function finishQuiz() {
    if (window.quizEngine) {
        window.quizEngine.isQuizActive = false;
        showResults(window.quizEngine.getResults());
    }
}

// ==================== SONUÇ GÖSTERME ====================
function showResults(results) {
    const container = document.getElementById('quizContainer');
    if (!container) return;

    const isPassed = results.score >= 50;
    const resultMessage = isPassed ? '✅ Başarılı!' : '❌ Başarısız';
    const resultColor = isPassed ? '#4caf50' : '#f44336';

    let html = `
        <div class="result-card" style="border-left: 5px solid ${resultColor}">
            <div class="result-score" style="color: ${resultColor}">${results.score}%</div>
            <div class="result-message" style="color: ${resultColor}">${resultMessage}</div>
            
            <div class="result-details">
                <div class="result-detail">
                    <strong>Doğru:</strong> ${results.correctAnswers}
                </div>
                <div class="result-detail">
                    <strong>Yanlış:</strong> ${results.wrongAnswers}
                </div>
                <div class="result-detail">
                    <strong>Boş:</strong> ${results.blankAnswers}
                </div>
            </div>

            <h3 style="margin-top: 30px; margin-bottom: 20px;">📋 Detaylı Sonuçlar</h3>
    `;

    results.details.forEach(detail => {
        const isCorrect = detail.isCorrect;
        const bgColor = isCorrect ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)';
        const borderColor = isCorrect ? '#4caf50' : '#f44336';

        html += `
            <div style="background: ${bgColor}; border-left: 4px solid ${borderColor}; padding: 15px; margin-bottom: 10px; border-radius: 5px;">
                <strong>Soru ${detail.questionNumber}:</strong> ${detail.question}<br>
                <span style="color: ${isCorrect ? '#4caf50' : '#f44336'}">
                    ${isCorrect ? '✓' : '✗'} Cevap: ${detail.userAnswer}
                </span>
                ${!isCorrect ? `<br><span style="color: #4caf50">✓ Doğru Cevap: ${detail.correctAnswer}</span>` : ''}
            </div>
        `;
    });

    if (results.score >= 50) {
        html += `
            <button onclick="downloadCertificate('${results.courseName}')" class="btn-certificate" style="margin-top: 20px; background: linear-gradient(135deg, #6c63ff 0%, #ff6584 100%); color: white; padding: 12px 24px; border: none; border-radius: 8px; cursor: pointer; font-size: 1em;">
                🎓 Sertifika İndir
            </button>
        `;
    }

    html += `
        <button onclick="location.reload()" style="margin-top: 20px; margin-left: 10px; background: #6c63ff; color: white; padding: 12px 24px; border: none; border-radius: 8px; cursor: pointer; font-size: 1em;">
            🔄 Testi Tekrar Et
        </button>
    `;

    html += `</div>`;

    container.innerHTML = html;
}

// ==================== SERTİFİKA İNDİR ====================
function downloadCertificate(courseName) {
    const certificateManager = new CertificateManager();
    const score = window.quizEngine ? window.quizEngine.calculateScore() : 75;
    const cert = certificateManager.addCertificate(courseName, score);
    certificateManager.downloadCertificate(cert.id);
}

// ==================== TEMA YÜKLEME (SAYFA AÇILIŞINDA) ====================
document.addEventListener('DOMContentLoaded', function() {
    loadTheme();
});

// ==================== MODAL KAPATMA (Harita Dışında Tıklama) ====================
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
};
