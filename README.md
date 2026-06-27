# Chrome Tabbed Floating Notepad


#### How to use this project on your browser

1. Download ZIP File or clone this given repo:

2. Open Google Chrome.

3. Navigate to your extensions management page by entering <i style="color: blue;"> chrome://extensions/ </i> in the URL address bar.

4. Turn on Developer mode using the toggle switch located in the top-right corner.

5. Click the Load unpacked button in the top-left corner.

5. Select the <em style="color: blue;"> toggle_notepad_chorme_extension </em> folder that contains your four files.

6. Open any regular website (e.g., wikipedia.org, youtube), click your Extension Puzzle Icon puzzle piece in the upper toolbar, and click Chrome Tabbed Floating Notepad.


### Project Title: Chrome Tabbed Floating Notepad

#### Overview
This project is a custom Google Chrome Extension that injects a persistent, floating notepad directly into the user's browser. Instead of switching back and forth between a web browser and a separate note-taking app (like Notepad or Word), users can type notes directly over the web page they are currently viewing. It features a nostalgic lined-paper design and a modern browser-style tab system.

#### Core Features
Always On Top: The notepad hovers above all webpage content, ensuring you can read an article or watch a video while simultaneously typing

- Real-Time Tab Syncing: If you open the notepad on YouTube and type a note, then switch to a tab with Wikipedia, the notepad will instantly appear there in the exact same spot with your text already updated.

- Infinite Save (Persistent Storage): Content is never deleted unless the user manually erases it. If you close the browser or restart your computer, your notes will still be there when you come back.

- Multi-Page Tab System: Just like the Chrome browser itself, the notepad features customizable tabs, allowing users to organize different notes (e.g., "Math Notes", "To-Do List", "Email Draft") within the same small window.

- Draggable & Resizable: Users can click the header to drag the notepad anywhere on their screen, or pull the corners to resize it, ensuring it never blocks important webpage content.

#### What is it Used For? (Use Cases)
This extension solves the problem of "context switching" — the time and focus lost when minimizing a browser to open a separate app just to write something down.

- Video Summaries: Taking notes while watching an educational YouTube video or webinar without having to shrink the video window.

- Research & Copy-Pasting: Acting as a "holding zone" to quickly copy and paste quotes, links, and text snippets while researching across multiple websites.

- Drafting Messages: Writing and formatting a long social media comment, email, or forum post safely before pasting it into the actual site (preventing accidental deletion if the web page reloads).

- To-Do Lists: Keeping a running checklist visible on the screen while working through daily tasks.

#### Who Can Use It? (Target Audience)
Because it lives directly in the browser, it is a highly versatile tool for almost anyone who spends a lot of time on the internet.

- Students (Like you): Perfect for jotting down notes, formulas, or project ideas while reading online textbooks or watching lectures.

- Researchers & Writers: For gathering sources, compiling facts, and organizing thoughts across dozens of open browser tabs.

- Developers & IT Professionals: For temporarily storing code snippets, API keys, or error logs while reading documentation.

- Casual Users: For writing down grocery lists, saving recipes, or keeping track of interesting links they want to revisit later.

#### Technical Summary
This is a lightweight, frontend-only project that requires no external servers or databases. It is built entirely using:

- HTML/CSS: To create the lined-paper visual design and the tabbed user interface.

- Vanilla JavaScript: To handle the drag-and-drop mechanics, tab switching, and DOM injection.

- Chrome Extension APIs (chrome.storage & chrome.scripting): To forcefully inject the tool into web pages, bypass site restrictions, and save data locally to the user's hard drive.

OUTPUT:
<img width="2880" height="1634" alt="image" src="https://github.com/user-attachments/assets/30f4b2cc-84ff-4aa0-a833-11b86cbb4ba6" />
