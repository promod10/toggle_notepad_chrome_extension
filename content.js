let notepadInstance = null;
let currentTabs = [{ id: "1", title: "Notes 1", content: "" }];
let activeTabId = "1";
let isTyping = false; // Prevents cursor jumping when syncing text

// Load data initially when the page opens
const loadDataFromStorage = () => {
  chrome.storage.local.get(["notepadTabs", "activeTabId", "notepadPos", "notepadSize", "notepadVisible"], (data) => {
    if (data.notepadTabs && data.notepadTabs.length > 0) currentTabs = data.notepadTabs;
    if (data.activeTabId) activeTabId = data.activeTabId;
    
    if (data.notepadVisible) {
      createNotepadUI();
      applyPositionAndSize(data.notepadPos, data.notepadSize);
    }
  });
};

const applyPositionAndSize = (pos, size) => {
  if (!notepadInstance) return;
  if (pos) {
    notepadInstance.style.top = pos.top;
    notepadInstance.style.left = pos.left;
    notepadInstance.style.right = 'auto';
  }
  if (size) {
    notepadInstance.style.width = size.width;
    notepadInstance.style.height = size.height;
  }
};

const saveDataToStorage = () => {
  if (!notepadInstance) return;
  chrome.storage.local.set({
    notepadTabs: currentTabs,
    activeTabId: activeTabId,
    notepadVisible: notepadInstance.style.display !== 'none',
    notepadPos: { top: notepadInstance.style.top, left: notepadInstance.style.left },
    notepadSize: { width: notepadInstance.style.width, height: notepadInstance.style.height }
  });
};

// Listen for changes made in OTHER tabs (e.g., YouTube vs Wikipedia)
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === "local") {
    // 1. Sync Visibility (If opened in one tab, open in all)
    if (changes.notepadVisible) {
      if (changes.notepadVisible.newValue) {
        createNotepadUI();
      } else if (notepadInstance) {
        notepadInstance.style.display = "none";
      }
    }

    // 2. Sync Position and Size across tabs
    if (changes.notepadPos || changes.notepadSize) {
      const pos = changes.notepadPos ? changes.notepadPos.newValue : null;
      const size = changes.notepadSize ? changes.notepadSize.newValue : null;
      applyPositionAndSize(pos, size);
    }

    // 3. Sync Data & Tabs (Only update text if we aren't actively typing in THIS specific tab)
    if ((changes.notepadTabs || changes.activeTabId) && !isTyping) {
      if (changes.notepadTabs) currentTabs = changes.notepadTabs.newValue;
      if (changes.activeTabId) activeTabId = changes.activeTabId.newValue;
      if (notepadInstance && notepadInstance.style.display !== "none") {
        renderTabs();
      }
    }
  }
});

const createNotepadUI = () => {
  if (notepadInstance) {
    notepadInstance.style.display = "flex";
    return;
  }

  notepadInstance = document.createElement("div");
  notepadInstance.className = "floating-notepad-container";
  
  notepadInstance.innerHTML = `
    <div class="notepad-header">
      <div class="notepad-tabs" id="notepadTabsContainer"></div>
      <button class="add-tab-btn" id="addTabBtn">+</button>
    </div>
    <div class="notepad-body">
      <textarea class="notepad-textarea" id="notepadTextarea" placeholder="Write something down..."></textarea>
    </div>
  `;

  // Append to documentElement instead of body to bypass specific site restrictions like YouTube's dynamic body
  document.documentElement.appendChild(notepadInstance);
  setupDragging(notepadInstance.querySelector(".notepad-header"), notepadInstance);
  setupResizingObserver(notepadInstance);

  notepadInstance.querySelector("#addTabBtn").addEventListener("click", addNewTab);
  
  const textarea = notepadInstance.querySelector("#notepadTextarea");
  
  // Track typing to prevent the live-sync from overwriting your active cursor
  textarea.addEventListener("focus", () => isTyping = true);
  textarea.addEventListener("blur", () => isTyping = false);
  
  textarea.addEventListener("input", (e) => {
    isTyping = true;
    const activeTab = currentTabs.find(t => t.id === activeTabId);
    if (activeTab) {
      activeTab.content = e.target.value;
      saveDataToStorage();
    }
  });

  renderTabs();
};

const renderTabs = () => {
  const container = document.getElementById("notepadTabsContainer");
  if (!container) return;
  container.innerHTML = "";

  currentTabs.forEach((tab) => {
    const tabEl = document.createElement("div");
    tabEl.className = `notepad-tab ${tab.id === activeTabId ? "active" : ""}`;
    tabEl.dataset.id = tab.id;

    tabEl.innerHTML = `
      <input type="text" class="tab-title-input" value="${tab.title}" />
      ${currentTabs.length > 1 ? `<span class="tab-close">&times;</span>` : ""}
    `;

    tabEl.addEventListener("click", (e) => {
      if (e.target.className !== "tab-close" && e.target.className !== "tab-title-input") {
        switchTab(tab.id);
      }
    });

    tabEl.querySelector(".tab-title-input").addEventListener("input", (e) => {
      tab.title = e.target.value;
      saveDataToStorage();
    });

    if (currentTabs.length > 1) {
      tabEl.querySelector(".tab-close").addEventListener("click", (e) => {
        e.stopPropagation();
        closeTab(tab.id);
      });
    }

    container.appendChild(tabEl);
  });

  const activeTab = currentTabs.find(t => t.id === activeTabId);
  const textarea = document.getElementById("notepadTextarea");
  if (textarea && document.activeElement !== textarea) {
    textarea.value = activeTab ? activeTab.content : "";
  }
};

const switchTab = (id) => {
  activeTabId = id;
  renderTabs();
  saveDataToStorage();
};

const addNewTab = () => {
  const newId = Date.now().toString();
  currentTabs.push({ id: newId, title: `Notes ${currentTabs.length + 1}`, content: "" });
  activeTabId = newId;
  renderTabs();
  saveDataToStorage();
};

const closeTab = (id) => {
  const index = currentTabs.findIndex(t => t.id === id);
  if (index === -1) return;
  currentTabs = currentTabs.filter(t => t.id !== id);
  if (activeTabId === id) {
    activeTabId = currentTabs[Math.max(0, index - 1)].id;
  }
  renderTabs();
  saveDataToStorage();
};

const setupDragging = (header, container) => {
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  header.onmousedown = (e) => {
    if (e.target.className === "tab-title-input" || e.target.className === "add-tab-btn") return;
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  };
  function elementDrag(e) {
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    container.style.top = (container.offsetTop - pos2) + "px";
    container.style.left = (container.offsetLeft - pos1) + "px";
    container.style.right = 'auto';
  }
  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
    saveDataToStorage();
  }
};

const setupResizingObserver = (container) => {
  const resizeObserver = new ResizeObserver(() => saveDataToStorage());
  resizeObserver.observe(container);
};

chrome.runtime.onMessage.addListener((request) => {
  if (request.action === "toggleNotepad") {
    if (notepadInstance && notepadInstance.style.display !== "none") {
      notepadInstance.style.display = "none";
      saveDataToStorage();
    } else {
      createNotepadUI();
      saveDataToStorage(); // Immediately save so other tabs open it too
    }
  }
});

loadDataFromStorage();