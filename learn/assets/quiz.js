/* quiz.js — reusable classification-quiz widget for lessons.
 *
 * Markup contract:
 *   <div class="quiz">
 *     <p class="q-prompt">…</p>
 *     <div class="q-options">
 *       <button class="q-opt" data-choice="sum">Sum (parallel)</button>
 *       <button class="q-opt" data-choice="min">Min (bottleneck)</button>
 *     </div>
 *     <p class="q-feedback"
 *        data-correct="min"
 *        data-explain-sum="Why sum is wrong here…"
 *        data-explain-min="Why min is right here…"></p>
 *   </div>
 *
 * Immediate feedback, retry allowed. No build step; plain DOM.
 */
(function () {
  function initQuiz(quiz) {
    var fb = quiz.querySelector(".q-feedback");
    if (!fb) return;
    var correct = fb.getAttribute("data-correct");
    var opts = quiz.querySelectorAll(".q-opt");

    opts.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var choice = btn.getAttribute("data-choice");
        var ok = choice === correct;

        opts.forEach(function (b) { b.classList.remove("is-correct", "is-wrong"); });
        btn.classList.add(ok ? "is-correct" : "is-wrong");

        var explain = fb.getAttribute("data-explain-" + choice) || "";
        fb.textContent = (ok ? "\u2713 " : "\u2717 ") + explain;
        fb.classList.add("show");
        fb.classList.toggle("good", ok);
        fb.classList.toggle("bad", !ok);
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".quiz").forEach(initQuiz);
  });
})();
