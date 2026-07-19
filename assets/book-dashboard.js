(function () {
  var grid = document.getElementById("moduleGrid");
  var completedCountEl = document.getElementById("completedCount");
  var totalCountEl = document.getElementById("totalCount");
  var progressFill = document.getElementById("progressFill");
  if (!grid) return;

  var heading = document.createElement("h2");
  heading.className = "toc-section-heading";
  heading.id = "chapters";
  heading.textContent = "Chapters";
  grid.insertAdjacentElement("beforebegin", heading);

  var segments = location.pathname.split("/");
  var booksIndex = segments.indexOf("books");
  var bookId = booksIndex !== -1 ? segments[booksIndex + 1] : null;
  if (!bookId) return;

  fetch("/books/" + bookId + "/lessons/manifest.json")
    .then(function (r) { return r.json(); })
    .then(function (lessons) {
      var completed = window.LibraryProgress ? window.LibraryProgress.getProgress(bookId).completed : [];
      var nextUpId = null;
      for (var i = 0; i < lessons.length; i++) {
        if (completed.indexOf(lessons[i].id) === -1) { nextUpId = lessons[i].id; break; }
      }

      if (totalCountEl) totalCountEl.textContent = lessons.length;
      if (completedCountEl) completedCountEl.textContent = completed.length;
      if (progressFill) progressFill.style.width = Math.round((completed.length / lessons.length) * 100) + "%";

      grid.innerHTML = "";
      lessons.forEach(function (lesson) {
        var done = completed.indexOf(lesson.id) !== -1;
        var card = document.createElement("a");
        card.className = "module-card" + (done ? " done" : "") + (lesson.id === nextUpId ? " next-up" : "");
        card.href = "/books/" + bookId + "/lessons/" + lesson.file;
        card.innerHTML =
          '<span class="module-number">' + lesson.id + "</span>" +
          "<div>" +
            "<h3>" + lesson.title + "</h3>" +
            '<p class="module-book">' + lesson.book + "</p>" +
          "</div>" +
          '<span class="module-status">' + (done ? "DONE ✓" : (lesson.id === nextUpId ? "NEXT UP" : "")) + "</span>";
        grid.appendChild(card);
      });
    });
})();
