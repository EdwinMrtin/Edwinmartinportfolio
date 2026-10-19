// 1. Typing animation
const typingText = document.getElementById("typingText");

const phrases = [
    "Java Backend Developer",
    "Spring Boot & REST APIs",
    "Python and SQL Enthusiast"
];

let phraseIndex = 0;
let letterIndex = 0;
let deleting = false;

function typeWords() {
    const currentPhrase = phrases[phraseIndex];

    if (deleting) {
        letterIndex--;
    } else {
        letterIndex++;
    }

    typingText.textContent = currentPhrase.substring(0, letterIndex);

    let delay = deleting ? 45 : 85;

    if (!deleting && letterIndex === currentPhrase.length) {
        deleting = true;
        delay = 1200;
    } else if (deleting && letterIndex === 0) {
        deleting = false;

        phraseIndex = (phraseIndex + 1) % phrases.length;
        delay = 350;
    }

    setTimeout(typeWords, delay);
}

typeWords();


// 2. Mobile navigation menu
const menuButton = document.getElementById("menuButton");
const navLinks = document.getElementById("navLinks");

menuButton.addEventListener("click", function () {
    navLinks.classList.toggle("open");

    const isOpen = navLinks.classList.contains("open");

    menuButton.setAttribute("aria-expanded", isOpen);
});


// Close the menu after clicking a navigation link
navLinks.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
        navLinks.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
    });
});


// Open and close the project detail dialogs
document.querySelectorAll(".project-read-more").forEach(function (button) {
    const dialog = document.getElementById(button.dataset.dialog);

    if (!dialog) {
        console.error("Project details dialog not found:", button.dataset.dialog);
        return;
    }

    button.addEventListener("click", function () {
        dialog.showModal();
    });

    dialog.querySelector(".project-dialog-close").addEventListener("click", function () {
        dialog.close();
    });

    dialog.addEventListener("click", function (event) {
        if (event.target === dialog) {
            dialog.close();
        }
    });
});


// 3. Animated background particles
const canvas = document.getElementById("particles");
const context = canvas.getContext("2d");

let particles = [];

function resizeCanvas() {
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = canvas.offsetWidth * pixelRatio;
    canvas.height = canvas.offsetHeight * pixelRatio;

    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

    particles = [];

    const particleCount = Math.min(
        65,
        Math.floor(canvas.offsetWidth / 18)
    );

    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.offsetWidth,
            y: Math.random() * canvas.offsetHeight,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 0.5
        });
    }
}

function drawParticles() {
    context.clearRect(
        0,
        0,
        canvas.offsetWidth,
        canvas.offsetHeight
    );

    particles.forEach(function (particle, index) {
        // Move each particle
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Keep particles inside the canvas
        if (
            particle.x < 0 ||
            particle.x > canvas.offsetWidth
        ) {
            particle.speedX *= -1;
        }

        if (
            particle.y < 0 ||
            particle.y > canvas.offsetHeight
        ) {
            particle.speedY *= -1;
        }

        // Draw a particle
        context.beginPath();

        context.arc(
            particle.x,
            particle.y,
            2,
            0,
            Math.PI * 2
        );

        context.fillStyle = "#ed7772";
        context.fill();

        // Connect nearby particles with lines
        for (let j = index + 1; j < particles.length; j++) {
            const other = particles[j];

            const distance = Math.hypot(
                particle.x - other.x,
                particle.y - other.y
            );

            if (distance < 115) {
                context.beginPath();

                context.moveTo(particle.x, particle.y);
                context.lineTo(other.x, other.y);

                context.strokeStyle =
                    "rgba(237, 81, 79, " +
                    (1 - distance / 115) * 0.35 +
                    ")";

                context.lineWidth = 1;
                context.stroke();
            }
        }
    });

    requestAnimationFrame(drawParticles);
}


// 4. Start the background animation
window.addEventListener("resize", resizeCanvas);

resizeCanvas();
drawParticles();


// 5. Scroll progress bar
const progressBar = document.createElement("div");

progressBar.style.position = "fixed";
progressBar.style.top = "0";
progressBar.style.left = "0";
progressBar.style.height = "3px";
progressBar.style.width = "0";
progressBar.style.background = "#ed514f";
progressBar.style.zIndex = "1000";

document.body.appendChild(progressBar);

window.addEventListener("scroll", function () {
    const pageHeight =
        document.documentElement.scrollHeight - window.innerHeight;

    const scrollPercent = pageHeight > 0
        ? (window.scrollY / pageHeight) * 100
        : 0;

    progressBar.style.width = scrollPercent + "%";
});


// 6. Animate the journey timeline's red date-side progress line on scroll
const journeyTimeline = document.querySelector(".timeline");
let timelineUpdatePending = false;

function updateTimelineProgress() {
    const timelineRect = journeyTimeline.getBoundingClientRect();
    const progress = Math.max(
        0,
        Math.min(window.innerHeight * 0.7 - timelineRect.top, timelineRect.height - 34)
    );

    journeyTimeline.style.setProperty("--timeline-progress", progress + "px");
    timelineUpdatePending = false;
}

function scheduleTimelineProgressUpdate() {
    if (!timelineUpdatePending) {
        timelineUpdatePending = true;
        requestAnimationFrame(updateTimelineProgress);
    }
}

window.addEventListener("scroll", scheduleTimelineProgressUpdate, { passive: true });
window.addEventListener("resize", scheduleTimelineProgressUpdate);
updateTimelineProgress();


// 7. Let the skill bubbles drift, collide, and bounce inside their cloud
const bubbleCloud = document.querySelector(".skill-logo-cloud");
const bubbleElements = Array.from(
    document.querySelectorAll(".skill-logo-cloud span")
);
const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
let bubbleStates = [];
let cloudWidth = 0;
let cloudHeight = 0;
let previousFrame = 0;
let bubbleTime = 0;

function setupSkillBubbles() {
    const width = bubbleCloud.clientWidth;
    const height = bubbleCloud.clientHeight;

    if (!width || !height) {
        return;
    }

    bubbleStates = bubbleElements.map(function (element, index) {
        const computed = getComputedStyle(element);
        const oldState = bubbleStates[index];
        const x = oldState && cloudWidth
            ? oldState.x / Math.max(cloudWidth - element.offsetWidth, 1) * Math.max(width - element.offsetWidth, 1)
            : parseFloat(computed.left);
        const y = oldState && cloudHeight
            ? oldState.y / Math.max(cloudHeight - element.offsetHeight, 1) * Math.max(height - element.offsetHeight, 1)
            : parseFloat(computed.top);

        return {
            element: element,
            x: Number.isFinite(x) ? x : Math.random() * width,
            y: Number.isFinite(y) ? y : Math.random() * height,
            vx: oldState ? oldState.vx : (Math.random() - 0.5) * 36,
            vy: oldState ? oldState.vy : (Math.random() - 0.5) * 30,
            phase: Math.random() * Math.PI * 2
        };
    });

    cloudWidth = width;
    cloudHeight = height;
}

function animateSkillBubbles(timestamp) {
    if (reducedMotionQuery.matches) {
        return;
    }

    const delta = previousFrame
        ? Math.min((timestamp - previousFrame) / 1000, 0.04)
        : 0;
    previousFrame = timestamp;
    bubbleTime += delta;

    const wind = Math.sin(bubbleTime * 0.34) * 8 +
        Math.sin(bubbleTime * 0.13 + 1.7) * 5;

    bubbleStates.forEach(function (bubble) {
        const breeze = wind + Math.sin(bubbleTime * 0.6 + bubble.phase) * 3;
        const lift = Math.sin(bubbleTime * 0.42 + bubble.phase) * 3;
        bubble.vx += (breeze - bubble.vx * 0.16) * delta;
        bubble.vy += (lift - bubble.vy * 0.16) * delta;
        bubble.x += bubble.vx * delta;
        bubble.y += bubble.vy * delta;
    });

    for (let i = 0; i < bubbleStates.length; i++) {
        for (let j = i + 1; j < bubbleStates.length; j++) {
            const first = bubbleStates[i];
            const second = bubbleStates[j];
            const firstRadius = first.element.offsetWidth / 2;
            const secondRadius = second.element.offsetWidth / 2;
            let dx = second.x + secondRadius - (first.x + firstRadius);
            let dy = second.y + secondRadius - (first.y + firstRadius);
            let distance = Math.hypot(dx, dy);
            const minimumDistance = firstRadius + secondRadius;

            if (distance >= minimumDistance) {
                continue;
            }

            if (distance === 0) {
                dx = 1;
                dy = 0;
                distance = 1;
            }

            const normalX = dx / distance;
            const normalY = dy / distance;
            const overlap = minimumDistance - distance;
            first.x -= normalX * overlap * 0.51;
            first.y -= normalY * overlap * 0.51;
            second.x += normalX * overlap * 0.51;
            second.y += normalY * overlap * 0.51;

            const relativeVelocity =
                (second.vx - first.vx) * normalX +
                (second.vy - first.vy) * normalY;

            if (relativeVelocity < 0) {
                const impulse = -(1 + 0.82) * relativeVelocity / 2;
                first.vx -= impulse * normalX;
                first.vy -= impulse * normalY;
                second.vx += impulse * normalX;
                second.vy += impulse * normalY;
            }
        }
    }

    bubbleStates.forEach(function (bubble) {
        const maxX = Math.max(0, cloudWidth - bubble.element.offsetWidth);
        const maxY = Math.max(0, cloudHeight - bubble.element.offsetHeight);

        if (bubble.x < 0 || bubble.x > maxX) {
            bubble.x = Math.max(0, Math.min(bubble.x, maxX));
            bubble.vx *= -0.82;
        }

        if (bubble.y < 0 || bubble.y > maxY) {
            bubble.y = Math.max(0, Math.min(bubble.y, maxY));
            bubble.vy *= -0.82;
        }

        bubble.element.style.left = bubble.x + "px";
        bubble.element.style.top = bubble.y + "px";
    });

    requestAnimationFrame(animateSkillBubbles);
}

setupSkillBubbles();
if (!reducedMotionQuery.matches) {
    requestAnimationFrame(animateSkillBubbles);
}
window.addEventListener("resize", setupSkillBubbles);
reducedMotionQuery.addEventListener("change", function (event) {
    if (!event.matches) {
        previousFrame = 0;
        requestAnimationFrame(animateSkillBubbles);
    }
});


// 8. Show each technology's proficiency and logo on its skill card
const deviconBase = "https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/";
const technologyIcons = {
    "java": "java/java-original.svg",
    "python": "python/python-original.svg",
    "c": "c/c-original.svg",
    "javascript": "javascript/javascript-original.svg",
    "sql": "mysql/mysql-original.svg",
    "spring boot": "spring/spring-original.svg",
    "rest apis": "swagger/swagger-original.svg",
    "node.js": "nodejs/nodejs-original.svg",
    "flask": "flask/flask-original.svg",
    "postgresql": "postgresql/postgresql-original.svg",
    "mysql": "mysql/mysql-original.svg",
    "database design": "postgresql/postgresql-original.svg",
    "git": "git/git-original.svg",
    "github": "github/github-original.svg",
    "docker": "docker/docker-original.svg",
    "postman": "postman/postman-original.svg",
    "html": "html5/html5-original.svg",
    "css": "css3/css3-original.svg"
};

const technologyLevels = {
    "java": 75,
    "python": 50,
    "c": 50,
    "javascript": 60,
    "sql": 75,
    "spring boot": 30,
    "rest apis": 30,
    "node.js": 30,
    "flask": 30,
    "postgresql": 20,
    "mysql": 20,
    "database design": 20,
    "git": 20,
    "github": 20,
    "docker": 20,
    "postman": 20,
    "html": 75,
    "css": 75
};

document.querySelectorAll(".skill-card").forEach(function (card) {
    const spotlight = card.querySelector(".skill-spotlight");
    const spotlightIcon = spotlight.querySelector("img");
    const spotlightLabel = spotlight.querySelector("span");
    const spotlightLevel = document.createElement("span");
    spotlightLevel.className = "skill-spotlight-level";
    spotlightLevel.setAttribute("aria-hidden", "true");
    spotlight.appendChild(spotlightLevel);

    card.querySelectorAll(".tech-tags span").forEach(function (tag) {
        const technology = tag.textContent.trim();
        const normalizedTechnology = technology.toLowerCase();
        const level = technologyLevels[normalizedTechnology] || 0;
        tag.tabIndex = 0;
        tag.setAttribute("aria-label", technology + ", " + level + "% proficiency");

        function showTechnology() {
            const icon = technologyIcons[normalizedTechnology];

            if (icon && level > 0) {
                spotlightIcon.src = deviconBase + icon;
                spotlightLabel.textContent = technology;
                spotlightLevel.textContent = level + "%";
            }
        }

        tag.addEventListener("pointerenter", showTechnology);
        tag.addEventListener("focus", showTechnology);
    });
});