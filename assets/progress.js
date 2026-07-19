window.LibraryProgress = (function () {
  var KEY = "learning-library:progress";

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : { books: {} };
    } catch (e) {
      return { books: {} };
    }
  }

  function save(doc) {
    localStorage.setItem(KEY, JSON.stringify(doc));
  }

  function ensureBook(doc, bookId) {
    if (!doc.books[bookId]) doc.books[bookId] = { completed: [], learningRecords: [] };
    return doc.books[bookId];
  }

  function notify(detail) {
    document.dispatchEvent(new CustomEvent("progress:updated", { detail: detail || {} }));
  }

  // getProgress() -> whole document. getProgress(bookId) -> that book's {completed, learningRecords}.
  function getProgress(bookId) {
    var doc = load();
    if (bookId) return ensureBook(doc, bookId);
    return doc;
  }

  function recordMastery(bookId, lessonId, evidence) {
    var doc = load();
    var book = ensureBook(doc, bookId);
    if (book.completed.indexOf(lessonId) === -1) book.completed.push(lessonId);
    book.learningRecords.push({ lessonId: lessonId, evidence: evidence || "", date: new Date().toISOString() });
    save(doc);
    notify({ bookId: bookId, lessonId: lessonId, mastered: true });
    return book;
  }

  function markCompleteManually(bookId, lessonId) {
    var doc = load();
    var book = ensureBook(doc, bookId);
    if (book.completed.indexOf(lessonId) === -1) book.completed.push(lessonId);
    save(doc);
    notify({ bookId: bookId, lessonId: lessonId, mastered: false, manual: true });
    return book;
  }

  function exportProgress() {
    var doc = load();
    var blob = new Blob([JSON.stringify(doc, null, 2)], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "progress-export-" + new Date().toISOString().slice(0, 10) + ".json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Merges an imported document into the current one — never overwrites, only unions.
  function importProgress(file, callback) {
    var reader = new FileReader();
    reader.onload = function () {
      var imported;
      try {
        imported = JSON.parse(reader.result);
      } catch (e) {
        return callback(new Error("That file isn't valid JSON."));
      }
      if (!imported || typeof imported.books !== "object") {
        return callback(new Error("That file doesn't look like a progress export."));
      }
      var current = load();
      var addedLessons = 0;
      var touchedBooks = 0;
      Object.keys(imported.books).forEach(function (bookId) {
        var incoming = imported.books[bookId] || {};
        var existing = ensureBook(current, bookId);
        var before = existing.completed.length;
        (incoming.completed || []).forEach(function (id) {
          if (existing.completed.indexOf(id) === -1) existing.completed.push(id);
        });
        var gained = existing.completed.length - before;
        if (gained > 0) touchedBooks++;
        addedLessons += gained;

        var seen = {};
        existing.learningRecords.concat(incoming.learningRecords || []).forEach(function (r) {
          seen[r.lessonId + "|" + r.date] = r;
        });
        existing.learningRecords = Object.keys(seen).map(function (k) { return seen[k]; });
      });
      save(current);
      notify({ imported: true });
      callback(null, { addedLessons: addedLessons, touchedBooks: touchedBooks });
    };
    reader.onerror = function () { callback(new Error("Could not read that file.")); };
    reader.readAsText(file);
  }

  return {
    getProgress: getProgress,
    recordMastery: recordMastery,
    markCompleteManually: markCompleteManually,
    exportProgress: exportProgress,
    importProgress: importProgress
  };
})();
