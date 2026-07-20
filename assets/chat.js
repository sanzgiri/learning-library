(function () {
  var CONFIG_KEY = "learning-library:apiConfig";
  var API_URL = "https://api.anthropic.com/v1/messages";
  var ANTHROPIC_VERSION = "2023-06-01";
  var DEFAULT_MODEL = "claude-sonnet-5";

  var file = location.pathname.split("/").pop();
  var lessonId = (file.match(/^(\d{4})/) || [])[1];
  if (!lessonId) return;

  var segments = location.pathname.split("/");
  var booksIndex = segments.indexOf("books");
  var bookId = booksIndex !== -1 ? segments[booksIndex + 1] : null;
  if (!bookId) return;

  var practiceBlocks = document.querySelectorAll(".practice");
  var anchor = practiceBlocks[practiceBlocks.length - 1];
  if (!anchor) return;

  var wrap = document.createElement("div");
  wrap.className = "chat-widget";
  wrap.innerHTML =
    '<h2>Talk to your tutor</h2>' +
    '<div class="already-done" hidden></div>' +
    '<div class="chat-key-panel">' +
      '<p>Paste your own Anthropic API key to chat with the tutor about this lesson. It is stored only in your browser and sent only to Anthropic — never to us.</p>' +
      '<input type="password" class="chat-key-input" placeholder="sk-ant-…" autocomplete="off" />' +
      '<input type="text" class="chat-model-input" value="' + DEFAULT_MODEL + '" />' +
      '<div class="chat-key-actions">' +
        '<button type="button" class="chat-key-save">Save &amp; start chatting</button>' +
        '<a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noopener">Get a key →</a>' +
      '</div>' +
    '</div>' +
    '<div class="chat-thread" hidden></div>' +
    '<form class="chat-form" hidden>' +
      '<textarea class="chat-input" rows="2" placeholder="Your answer or question…"></textarea>' +
      '<div class="chat-actions">' +
        '<button type="submit" class="chat-send">Send</button>' +
        '<button type="button" class="mark-complete-anyway">Mark complete anyway</button>' +
        '<button type="button" class="chat-forget-key">Change key</button>' +
      '</div>' +
    '</form>' +
    '<div class="chat-status" aria-live="polite"></div>';

  anchor.insertAdjacentElement("afterend", wrap);

  var keyPanel = wrap.querySelector(".chat-key-panel");
  var keyInput = wrap.querySelector(".chat-key-input");
  var modelInput = wrap.querySelector(".chat-model-input");
  var keySaveBtn = wrap.querySelector(".chat-key-save");
  var thread = wrap.querySelector(".chat-thread");
  var form = wrap.querySelector(".chat-form");
  var input = wrap.querySelector(".chat-input");
  var sendBtn = wrap.querySelector(".chat-send");
  var forgetBtn = wrap.querySelector(".chat-forget-key");
  var completeBtn = wrap.querySelector(".mark-complete-anyway");
  var status = wrap.querySelector(".chat-status");
  var alreadyDone = wrap.querySelector(".already-done");

  var messages = [];
  var lesson = null;
  var systemPrompt = "";

  function getConfig() {
    try {
      return JSON.parse(localStorage.getItem(CONFIG_KEY) || "null");
    } catch (e) {
      return null;
    }
  }

  function saveConfig(cfg) {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(cfg));
  }

  function clearConfig() {
    localStorage.removeItem(CONFIG_KEY);
  }

  function escapeHtml(s) {
    var d = document.createElement("div");
    d.textContent = s || "";
    return d.innerHTML;
  }

  function addBubble(role, text) {
    var bubble = document.createElement("div");
    bubble.className = "chat-bubble " + role;
    bubble.innerHTML = "<strong>" + (role === "tutor" ? "Tutor" : "You") + "</strong><br>" + escapeHtml(text).replace(/\n/g, "<br>");
    thread.appendChild(bubble);
    thread.scrollTop = thread.scrollHeight;
  }

  function addMasteredBadge(evidence) {
    var badge = document.createElement("div");
    badge.className = "chat-bubble mastered-badge";
    badge.innerHTML = "<strong>✓ Mastered</strong><br>" + escapeHtml(evidence || "Nice work.");
    thread.appendChild(badge);
    thread.scrollTop = thread.scrollHeight;
  }

  function buildSystemPrompt(lessonEntry) {
    return "You are a rigorous but encouraging Socratic tutor teaching \"" + lessonEntry.title + "\" (" + lessonEntry.book + "). " +
      "Ground everything you say in this material — do not rely on your own general knowledge instead of it:\n\n\"\"\"\n" + lessonEntry.grounding + "\n\"\"\"\n\n" +
      "Converse naturally: ask questions, push back gently on vague or incomplete answers, and only confirm understanding once the learner has both (a) restated the core idea in their own words and (b) applied it to a concrete example, without a major misconception. " +
      "When — and only when — you judge the learner has genuinely demonstrated that, call the recordMastery tool with a one-to-two sentence evidence summary of specifically what they got right, and say something warm and specific to them in the same turn before or alongside the tool call. Do not call recordMastery for a confident-sounding but unsupported restatement.";
  }

  function tools() {
    return [{
      name: "recordMastery",
      description: "Call this when the learner has genuinely demonstrated understanding of this lesson's core idea, in their own words, applied to a concrete example.",
      input_schema: {
        type: "object",
        properties: {
          evidence: { type: "string", description: "1-2 sentences: what specifically the learner got right." }
        },
        required: ["evidence"]
      }
    }];
  }

  function setBusy(busy) {
    sendBtn.disabled = busy;
    input.disabled = busy;
    status.textContent = busy ? "Thinking…" : "";
  }

  function callTutor() {
    var cfg = getConfig();
    if (!cfg) return showKeyPanel();
    setBusy(true);
    fetch(API_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": cfg.apiKey,
        "anthropic-version": ANTHROPIC_VERSION,
        "anthropic-dangerous-direct-browser-access": "true"
      },
      body: JSON.stringify({
        model: cfg.model || DEFAULT_MODEL,
        max_tokens: 1024,
        system: systemPrompt,
        messages: messages,
        tools: tools()
      })
    })
      .then(function (r) {
        return r.json().then(function (data) {
          if (!r.ok) throw new Error((data.error && data.error.message) || "Anthropic API error");
          return data;
        });
      })
      .then(function (data) {
        messages.push({ role: "assistant", content: data.content });
        var toolUse = null;
        (data.content || []).forEach(function (block) {
          if (block.type === "text" && block.text) addBubble("tutor", block.text);
          if (block.type === "tool_use" && block.name === "recordMastery") toolUse = block;
        });
        if (toolUse) {
          var evidence = (toolUse.input && toolUse.input.evidence) || "";
          window.LibraryProgress.recordMastery(bookId, lessonId, evidence);
          addMasteredBadge(evidence);
          announceMastered();
          // Keep the transcript API-valid for any further messages without an extra round trip.
          messages.push({
            role: "user",
            content: [{ type: "tool_result", tool_use_id: toolUse.id, content: "Recorded." }]
          });
        }
      })
      .catch(function (err) {
        status.textContent = "";
        addBubble("tutor", "(The tutor is unavailable right now: " + err.message + ")");
      })
      .finally(function () { setBusy(false); });
  }

  function announceMastered() {
    document.dispatchEvent(new CustomEvent("lesson:mastered", { detail: { bookId: bookId, lessonId: lessonId } }));
  }

  function showKeyPanel() {
    keyPanel.hidden = false;
    thread.hidden = true;
    form.hidden = true;
  }

  function showChat() {
    keyPanel.hidden = true;
    thread.hidden = false;
    form.hidden = false;
    if (!thread.childElementCount) {
      addBubble("tutor", "Tell me your answer to the practice questions above — or ask me anything about the idea — and I'll respond.");
    }
  }

  keySaveBtn.addEventListener("click", function () {
    var key = keyInput.value.trim();
    if (!key) return;
    saveConfig({ provider: "anthropic", apiKey: key, model: (modelInput.value || DEFAULT_MODEL).trim() });
    showChat();
  });

  forgetBtn.addEventListener("click", function () {
    clearConfig();
    messages = [];
    thread.innerHTML = "";
    showKeyPanel();
  });

  completeBtn.addEventListener("click", function () {
    completeBtn.disabled = true;
    window.LibraryProgress.markCompleteManually(bookId, lessonId);
    status.textContent = "Marked complete.";
    announceMastered();
    completeBtn.disabled = false;
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var text = input.value.trim();
    if (!text) return;
    addBubble("you", text);
    messages.push({ role: "user", content: text });
    input.value = "";
    callTutor();
  });

  fetch("manifest.json")
    .then(function (r) { return r.json(); })
    .then(function (manifest) {
      lesson = manifest.find(function (l) { return l.id === lessonId; });
      if (!lesson) return;
      systemPrompt = buildSystemPrompt(lesson);
    })
    .catch(function () {});

  window.LibraryProgress && window.LibraryProgress.getProgress(bookId).completed.indexOf(lessonId) !== -1 &&
    (function () {
      alreadyDone.hidden = false;
      alreadyDone.textContent = "✓ Already marked complete — you can still chat about it below.";
    })();

  if (getConfig()) showChat(); else showKeyPanel();
})();
