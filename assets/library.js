(function () {
  var grid = document.getElementById("bookGrid");
  if (!grid) return;

  function render() {
    fetch("books/index.json")
      .then(function (r) { return r.json(); })
      .then(function (books) {
        return Promise.all(books.map(function (book) {
          return fetch("books/" + book.id + "/lessons/manifest.json")
            .then(function (r) { return r.json(); })
            .then(function (manifest) { return { book: book, total: manifest.length }; })
            .catch(function () { return { book: book, total: 0 }; });
        }));
      })
      .then(function (entries) {
        grid.innerHTML = "";
        entries.forEach(function (entry) {
          var book = entry.book;
          var total = entry.total;
          var progress = window.LibraryProgress ? window.LibraryProgress.getProgress(book.id) : { completed: [] };
          var done = progress.completed.length;
          var pct = total ? Math.round((done / total) * 100) : 0;
          var status = done === 0 ? "Not started" : (total > 0 && done >= total ? "Complete" : "In progress");
          var card = document.createElement("a");
          card.className = "book-card" + (status === "Complete" ? " complete" : "");
          card.href = "books/" + book.id + "/index.html";
          card.innerHTML =
            "<h3>" + book.title + "</h3>" +
            '<p class="book-author">' + (book.author || "") + "</p>" +
            '<p class="book-tagline">' + (book.tagline || "") + "</p>" +
            '<div class="book-progress-track"><div class="book-progress-fill" style="width:' + pct + '%"></div></div>' +
            '<span class="book-status">' + status + " · " + done + "/" + total + " lessons</span>";
          grid.appendChild(card);
        });
      });
  }

  render();

  var exportBtn = document.getElementById("exportProgress");
  var importInput = document.getElementById("importProgress");

  if (exportBtn) {
    exportBtn.addEventListener("click", function () {
      window.LibraryProgress.exportProgress();
    });
  }

  if (importInput) {
    importInput.addEventListener("change", function () {
      var file = importInput.files[0];
      if (!file) return;
      window.LibraryProgress.importProgress(file, function (err, result) {
        if (err) { alert(err.message); return; }
        alert("Imported " + result.addedLessons + " newly-completed lesson(s) across " + result.touchedBooks + " book(s).");
        importInput.value = "";
        render();
      });
    });
  }

  document.addEventListener("progress:updated", render);
})();
