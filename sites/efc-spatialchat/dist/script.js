const presentationOrder = [
  "opening",
  "problem",
  "convergence",
  "connected-home",
  "partnership",
  "origin",
  "ecosystem",
  "live",
  "courses",
  "studio",
  "workflows",
  "mobile",
  "engagement",
  "knowledge",
  "gamification",
  "analytics",
  "intelligence",
  "commercial",
  "roadmap",
  "closing",
];

const main = document.querySelector("main");
presentationOrder.forEach((id) => {
  const section = document.getElementById(id);
  if (section) main?.append(section);
});

const sections = [...document.querySelectorAll("main > section[id]")];
const reveals = [...document.querySelectorAll(".reveal")];
const sectionLinks = [...document.querySelectorAll(".section-nav a")];
const header = document.querySelector("#siteHeader");
const progressBar = document.querySelector("#progressBar");
const pointerLight = document.querySelector("#pointerLight");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("is-visible");
    });
  },
  { threshold: 0.14 },
);

reveals.forEach((element) => revealObserver.observe(element));

const sectionObserver = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;
    const id = visible.target.id;
    const theme = visible.target.dataset.theme;

    sectionLinks.forEach((link) => {
      const active = link.dataset.section === id;
      link.classList.toggle("is-active", active);
      if (active) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });

    header.classList.toggle("is-light", theme === "light");
    header.classList.toggle("is-dark", theme === "dark");
  },
  { rootMargin: "-32% 0px -46% 0px", threshold: [0, 0.1, 0.4] },
);

sections.forEach((section) => sectionObserver.observe(section));

const updateProgress = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  progressBar.style.width = `${Math.min(progress, 100)}%`;
};

window.addEventListener("scroll", updateProgress, { passive: true });
updateProgress();

const tabs = [...document.querySelectorAll(".experience-tab")];
const stage = document.querySelector(".experience-stage");
const stageImage = document.querySelector("#experienceImage");
const stageKicker = document.querySelector("#experienceKicker");
const stageTitle = document.querySelector("#experienceTitle");
const stageCopy = document.querySelector("#experienceCopy");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    if (tab.classList.contains("is-active")) return;

    tabs.forEach((item) => {
      const active = item === tab;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-selected", String(active));
    });

    stage.classList.add("is-changing");

    window.setTimeout(() => {
      stageImage.src = tab.dataset.image;
      stageImage.alt = `${tab.querySelector("b").textContent} interface`;
      stageKicker.textContent = tab.dataset.kicker;
      stageTitle.textContent = tab.dataset.title;
      stageCopy.textContent = tab.dataset.copy;
      stage.classList.remove("is-changing");
    }, 180);
  });
});

const phoneDemo = document.querySelector(".phone-demo");
const phoneModeButtons = [...document.querySelectorAll("[data-phone-view]")];
const phonePanels = [...document.querySelectorAll("[data-phone-panel]")];
const startCallButtons = [...document.querySelectorAll("[data-start-call]")];
const acceptCall = document.querySelector(".accept-call");
const declineCall = document.querySelector(".decline-call");
const incomingLabel = document.querySelector(".incoming-label");
const callState = document.querySelector(".call-state");

const showPhoneView = (view) => {
  phoneModeButtons.forEach((button) => {
    const active = button.dataset.phoneView === view;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", String(active));
  });
  phonePanels.forEach((panel) => {
    panel.classList.toggle("is-active", panel.dataset.phonePanel === view);
  });
};

phoneModeButtons.forEach((button) => {
  button.addEventListener("click", () => showPhoneView(button.dataset.phoneView));
});

startCallButtons.forEach((button) => {
  button.addEventListener("click", () => {
    phoneDemo?.classList.remove("is-connected");
    if (incomingLabel) incomingLabel.textContent = "Calling EFC member";
    if (callState) callState.textContent = "Connecting…";
    const acceptLabel = acceptCall?.querySelector("b");
    if (acceptLabel) acceptLabel.textContent = "Accept";
    showPhoneView("call");
  });
});

acceptCall?.addEventListener("click", () => {
  const connected = phoneDemo?.classList.toggle("is-connected");
  if (incomingLabel) incomingLabel.textContent = connected ? "Connected · encrypted" : "Incoming EFC call";
  if (callState) callState.textContent = connected ? "00:01 · mobile audio" : "Mobile audio";
  const label = acceptCall.querySelector("b");
  if (label) label.textContent = connected ? "Mute" : "Accept";
});

declineCall?.addEventListener("click", () => {
  phoneDemo?.classList.remove("is-connected");
  if (incomingLabel) incomingLabel.textContent = "Call ended";
  if (callState) callState.textContent = "Return to messages";
  const acceptLabel = acceptCall?.querySelector("b");
  if (acceptLabel) acceptLabel.textContent = "Accept";
  window.setTimeout(() => showPhoneView("message"), 550);
});

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const hasFinePointer = window.matchMedia("(pointer: fine)").matches;

const liveParticipants = [...document.querySelectorAll("[data-live-person]")];
const liveTranscript = document.querySelector("#liveTranscript");
const liveConsole = document.querySelector(".live-console");
let activeSpeakerIndex = 0;
let liveConversationTimer;

const setLiveSpeaker = (index) => {
  activeSpeakerIndex = index;
  liveParticipants.forEach((participant, participantIndex) => {
    const isSpeaking = participantIndex === index;
    participant.classList.toggle("is-speaking", isSpeaking);
    participant.setAttribute("aria-label", `${participant.dataset.name} is ${isSpeaking ? "speaking" : "listening"}`);
  });

  const activeSpeaker = liveParticipants[index];
  if (activeSpeaker && liveTranscript) {
    liveTranscript.textContent = `${activeSpeaker.dataset.name} is speaking: ${activeSpeaker.dataset.caption}`;
  }
};

const startLiveConversation = () => {
  if (prefersReducedMotion || liveConversationTimer || liveParticipants.length < 2) return;
  liveConversationTimer = window.setInterval(() => {
    setLiveSpeaker((activeSpeakerIndex + 1) % liveParticipants.length);
  }, 3600);
};

const stopLiveConversation = () => {
  window.clearInterval(liveConversationTimer);
  liveConversationTimer = undefined;
};

if (liveParticipants.length) {
  setLiveSpeaker(0);
  if ("IntersectionObserver" in window && liveConsole) {
    const liveConversationObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) startLiveConversation();
      else stopLiveConversation();
    }, { threshold: 0.18 });
    liveConversationObserver.observe(liveConsole);
  } else {
    startLiveConversation();
  }
}

const journeyMap = document.querySelector("[data-journey-map]");
const journeyNodes = [...document.querySelectorAll("[data-journey-node]")];
const journeyPhases = [...document.querySelectorAll("[data-journey-phase]")];
const journeyStatus = document.querySelector("[data-journey-status]");
const journeyProgress = document.querySelector("[data-journey-progress]");
const journeyPhaseForStep = [0, 0, 1, 2];
const journeyProgressForStep = [8, 34, 62, 100];
let journeyTimer;
let journeyReplayTimer;

const setJourneyStep = (step) => {
  const activePhase = journeyPhaseForStep[step];

  journeyNodes.forEach((node, index) => {
    node.classList.toggle("is-current", index === step);
    node.classList.toggle("is-past", index < step);
  });

  journeyPhases.forEach((phase, index) => {
    phase.classList.toggle("is-current", index === activePhase);
    phase.classList.toggle("is-past", index < activePhase);
  });

  if (journeyStatus) journeyStatus.textContent = journeyNodes[step]?.dataset.status || "The EFC journey";
  if (journeyProgress) journeyProgress.style.width = `${journeyProgressForStep[step]}%`;
};

const stopJourneyOverview = () => {
  window.clearInterval(journeyTimer);
  window.clearTimeout(journeyReplayTimer);
  journeyTimer = undefined;
  journeyReplayTimer = undefined;
  journeyMap?.classList.remove("is-playing");
};

const playJourneyOverview = () => {
  if (!journeyMap || prefersReducedMotion || journeyNodes.length < 2) return;
  stopJourneyOverview();
  void journeyMap.offsetWidth;
  journeyMap.classList.add("is-playing");
  setJourneyStep(0);

  let nextStep = 1;
  journeyTimer = window.setInterval(() => {
    setJourneyStep(nextStep);
    if (nextStep === journeyNodes.length - 1) {
      window.clearInterval(journeyTimer);
      journeyTimer = undefined;
      journeyReplayTimer = window.setTimeout(playJourneyOverview, 2400);
    }
    nextStep += 1;
  }, 1750);
};

if (journeyMap && journeyNodes.length) {
  if (prefersReducedMotion) {
    journeyMap.classList.add("is-static");
    journeyNodes.forEach((node) => node.classList.add("is-complete"));
    journeyPhases.forEach((phase) => phase.classList.add("is-complete"));
    if (journeyStatus) journeyStatus.textContent = "Oct 2025 → 2027 · Full roadmap";
    if (journeyProgress) journeyProgress.style.width = "100%";
  } else {
    const journeyObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) playJourneyOverview();
      else stopJourneyOverview();
    }, { threshold: 0.22 });
    journeyObserver.observe(journeyMap);
  }
}

if (hasFinePointer && !prefersReducedMotion) {
  window.addEventListener("pointermove", (event) => {
    pointerLight.style.left = `${event.clientX}px`;
    pointerLight.style.top = `${event.clientY}px`;
    pointerLight.style.opacity = "1";
  });
  document.documentElement.addEventListener("mouseleave", () => {
    pointerLight.style.opacity = "0";
  });
}

const activeSectionIndex = () => {
  const marker = window.scrollY + window.innerHeight * 0.45;
  let index = 0;
  sections.forEach((section, sectionIndex) => {
    if (section.offsetTop <= marker) index = sectionIndex;
  });
  return index;
};

window.addEventListener("keydown", (event) => {
  const targetTag = event.target.tagName;
  if (["INPUT", "TEXTAREA", "SELECT", "BUTTON"].includes(targetTag)) return;
  if (!prefersReducedMotion && ["ArrowDown", "PageDown", "ArrowUp", "PageUp"].includes(event.key)) {
    event.preventDefault();
    const direction = ["ArrowDown", "PageDown"].includes(event.key) ? 1 : -1;
    const next = Math.max(0, Math.min(sections.length - 1, activeSectionIndex() + direction));
    sections[next].scrollIntoView({ behavior: "smooth", block: "start" });
  }
});

window.addEventListener("load", () => {
  document.body.classList.add("is-ready");
  document.querySelectorAll("#opening .reveal").forEach((element) => element.classList.add("is-visible"));
});
