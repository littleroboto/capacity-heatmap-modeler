/* levels.js — global three-level depth switcher for the Capacity Modeling course.
 *
 * Contract:
 *   <body data-level="intermediate">
 *   <div class="level-bar" data-level-bar></div>   ← filled by this script
 *   <div class="lvl lvl-easy">…</div>
 *   <div class="lvl lvl-intermediate">…</div>
 *   <div class="lvl lvl-expert">…</div>
 *
 * The chosen level is written to <body data-level> (CSS shows the matching .lvl
 * blocks) and persisted in localStorage so it carries across every lesson.
 */
(function () {
  var KEY = "capacity-course-level";
  var LEVELS = [
    { id: "easy",         label: "Overview",    sub: "The essentials" },
    { id: "intermediate", label: "In practice", sub: "How to model it" },
    { id: "expert",       label: "In depth",    sub: "Theory & edges" }
  ];

  function currentLevel() {
    var stored;
    try { stored = localStorage.getItem(KEY); } catch (e) { stored = null; }
    if (stored && LEVELS.some(function (l) { return l.id === stored; })) return stored;
    return document.body.getAttribute("data-level") || "intermediate";
  }

  function apply(level) {
    document.body.setAttribute("data-level", level);
    try { localStorage.setItem(KEY, level); } catch (e) {}
    document.querySelectorAll(".level-btn").forEach(function (btn) {
      btn.setAttribute("aria-pressed", String(btn.getAttribute("data-level") === level));
    });
    // Tag .lvl blocks with a print label so paper output stays legible.
    LEVELS.forEach(function (l) {
      document.querySelectorAll(".lvl-" + l.id).forEach(function (el) {
        el.setAttribute("data-print-label", l.label + " · " + l.sub);
      });
    });
  }

  function build(bar) {
    var lbl = document.createElement("span");
    lbl.className = "lb-label";
    lbl.textContent = "Reading level";
    bar.appendChild(lbl);
    LEVELS.forEach(function (l) {
      var btn = document.createElement("button");
      btn.className = "level-btn";
      btn.type = "button";
      btn.setAttribute("data-level", l.id);
      btn.setAttribute("aria-pressed", "false");
      btn.innerHTML = l.label + "<small>" + l.sub + "</small>";
      btn.addEventListener("click", function () { apply(l.id); });
      bar.appendChild(btn);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var bar = document.querySelector("[data-level-bar]");
    if (bar) build(bar);
    apply(currentLevel());
  });
})();
