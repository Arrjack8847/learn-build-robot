# Level 1 Quiz — original visual concept illustrations

## What changed

- All **33 unpublished Level 1 banks** now have a lightweight, original SVG concept sketch.
- Two alternative questions in **one of the five learning objectives** share the sketch. The Quiz Studio selects one question per objective, so **each five-question attempt and immediate retry contains exactly one illustrated question**. This is intentional: it avoids adding heavy images to every question.
- Each SVG is an original concept diagram derived from text-grounded curriculum topics, **not a screenshot or exact representation of the official PDF illustrations**.
- The visual image is displayed responsively with alt text in the existing Quiz Studio. The app continues to support the two existing gear SVG illustrations used by Acceleration Car.
- The Phase 4 offline reviewer shows these images with source text and a direct link to the original PDF page. Its image-related warning reminds a teacher to compare each visual with the actual lesson before approving.

## Student release status

**No new banks have been approved or registered.** The Level 1 readiness ledger remains 27 ready / 33 pending, and `main` is unchanged. Some visual questions reuse the same concept sketch in their paired alternative. Source content and correct answer keys still require a teacher's manual review, especially for image-dependent questions.

## Local testing

```powershell
git pull --ff-only origin feat/quiz-level1-phase1-standard-20261029
npm run test:quiz
npm run build
npm run dev
```

Open `http://localhost:3000/projects/ferocious-snake`, click **Test Quiz (Draft)**, and answer five questions. One should have a diagram. Retry to confirm an alternative illustrated question is included. Also try `/quiz/shy-penguin?preview=1` and `/quiz/caged-bird?preview=1`.

Generate the offline source review page with `npm run quiz:review-level1` and open `quiz-research/level1-phase4-review.html` to compare original diagrams against the official PDF. It is an internal educational review tool and cannot publish content.

The sketches are vector diagrams, not photographs or exact replicas of the manufacturer’s construction components. Do **not** use them to justify precise assembly orientation, port placement, or dimensions without checking the original manuals.
