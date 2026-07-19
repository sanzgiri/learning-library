(function () {
  var segments = location.pathname.split("/");
  var booksIndex = segments.indexOf("books");
  if (booksIndex === -1) return; // root library page: no per-book sidebar
  var bookId = segments[booksIndex + 1];
  var onLessonPage = segments.indexOf("lessons") !== -1;
  var manifestUrl = onLessonPage ? "manifest.json" : "lessons/manifest.json";
  var lessonHrefPrefix = onLessonPage ? "" : "lessons/";
  var currentFile = onLessonPage ? segments[segments.length - 1] : null;

  var bookTitle = bookId;

  Promise.all([
    fetch(manifestUrl).then(function (r) { return r.json(); }),
    fetch("/books/index.json").then(function (r) { return r.json(); }).catch(function () { return []; })
  ])
    .then(function (results) {
      var books = results[1] || [];
      var match = books.find(function (b) { return b.id === bookId; });
      if (match && match.title) bookTitle = match.title;
      render(results[0]);
    })
    .catch(function () {});

  function render(lessons) {
    var nav = document.createElement("nav");
    nav.className = "toc";

    var heading = document.createElement("div");
    heading.className = "toc-heading";
    heading.textContent = bookTitle;
    nav.appendChild(heading);

    var links = document.createElement("div");
    links.className = "toc-links";
    if (onLessonPage) {
      var bookLink = document.createElement("a");
      bookLink.href = "../index.html";
      bookLink.className = "toc-home";
      bookLink.textContent = "← This book";
      links.appendChild(bookLink);
    }
    var libraryLink = document.createElement("a");
    libraryLink.href = "/";
    libraryLink.className = "toc-home";
    libraryLink.textContent = "All books";
    links.appendChild(libraryLink);
    nav.appendChild(links);

    var list = document.createElement("ol");
    lessons.forEach(function (lesson) {
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = lessonHrefPrefix + lesson.file;
      a.dataset.lessonId = lesson.id;
      var mark = document.createElement("span");
      mark.className = "toc-mark";
      a.appendChild(mark);
      a.appendChild(document.createTextNode(lesson.title));
      if (lesson.file === currentFile) {
        a.setAttribute("aria-current", "page");
        li.className = "current";
      }
      li.appendChild(a);
      list.appendChild(li);
    });
    nav.appendChild(list);

    var content = document.createElement("div");
    content.className = "content";
    Array.prototype.slice.call(document.body.childNodes).forEach(function (node) {
      if (node.tagName === "SCRIPT") return;
      content.appendChild(node);
    });

    document.body.prepend(nav);
    document.body.appendChild(content);

    applyCompleted();
  }

  function applyCompleted() {
    if (!window.LibraryProgress) return;
    var completed = window.LibraryProgress.getProgress(bookId).completed || [];
    document.querySelectorAll('.toc a[data-lesson-id]').forEach(function (a) {
      var li = a.parentElement;
      if (completed.indexOf(a.dataset.lessonId) !== -1) {
        li.classList.add("done");
        a.querySelector(".toc-mark").textContent = "✓";
      } else {
        li.classList.remove("done");
        a.querySelector(".toc-mark").textContent = "";
      }
    });
  }

  document.addEventListener("lesson:mastered", function (e) {
    var detail = e.detail || {};
    if (detail.bookId !== bookId) return;
    var a = document.querySelector('.toc a[data-lesson-id="' + detail.lessonId + '"]');
    if (a) {
      a.parentElement.classList.add("done");
      a.querySelector(".toc-mark").textContent = "✓";
    }
  });

  document.addEventListener("progress:updated", function (e) {
    if (!e.detail || e.detail.imported) applyCompleted();
  });
})();
