# Yocto Atlas

A local course and textbook reader using the verified light-theme palette and mono typography of Designed to Scale, with original illustrated system scenes.

Brand: Yocto Atlas. Primary navigation is Learn, Architecture Playground, Practice, Cheatsheets, Library. The playground page title is Architecture Design Playground. Designer credit links to Prashant Divate's GitHub profile using a local GitHub mark from Simple Icons (CC0 icon data; GitHub branding remains its owner's trademark).

Every animated scene shares a 50-250% zoom slider, zoom buttons, fit control, native scrollbars and pointer/touch drag panning. Zoom anchors around the last pointer position. Per-topic zoom is retained locally. Connection explanations live in a separate expandable list instead of overlapping artwork. Tests check reserved artwork/label bounds and orthogonal route clearance for all 392 lesson steps; browser QA checks actual SVG framing and drag behavior.

The language dropdown matches the reference's 21 choices in two columns, with native names, English labels, badges and one selected checkmark. Selection applies directly; native popover dismissal and keyboard navigation are supported. Core navigation has local translations. Chapter prose can be translated through the browser's on-device Translator API; models may need downloading. This requires a compatible desktop browser and available language pair. Unsupported browsers keep English prose with an explicit status. This is machine translation, not human-reviewed localization. Commands, diagram labels, user notes and original PDF pages remain unchanged. No course text is sent to a cloud translation service by this implementation.

Reading prose uses 15px type, code uses 13px and supporting navigation uses 11-13px, with responsive wrapping and generous line height. The header and sidebar show a linked, green-highlighted Prashant Divate credit beside a GitHub icon.

Five studies from Prashant Divate's supplied public Medium collection are included in relevant readings: Weston/Wayland, UEFI/RAUC, remote graphics via RDP, multiconfig and ramoops/pstore. Each retains publication context and an original lab brief. Interpretation notes distinguish slot health from activity, require reviewed RAM reservations and avoid public remote-desktop exposure.

## Run

## Public Hosting

GitHub Pages deploys the static public build through `.github/workflows/pages.yml` on pushes to `main`. Enable **Settings > Pages > Source: GitHub Actions**. The project uses relative asset paths and hash routes, including under `/yocto-atlas/`.

`npm run build` creates `dist/` with only authored course modules and required licensed assets. PDFs, extracted textbook content, research, credentials and local browser state are never copied. The public site hides local-book controls; the original local library remains available when running from the owner's checkout. Fresh clones can run the authored course without the private books. Local-PDF integrity tests are skipped when those private files are absent.

## Local Development

Use a recent Node.js LTS release and a modern browser. Dependencies provide local fonts, Lucide icons and PDF.js page rendering.

```powershell
cd yocto-atlas
npm.cmd ci
npm.cmd run dev
```

Open http://localhost:5173. Set PORT to use a different port. Run `npm.cmd test` for content and route integrity checks.

## Course

76 guided lessons and 392 sections are organized into 36 focused courses, from Linux with no prerequisites through production Yocto and system design. Courses have explicit descriptions and outcomes. Every lesson has reading, a practical lab, expected results, troubleshooting, a deliverable and a knowledge check. Completion requires a passed check and recorded lab evidence. Existing lesson URLs and locally saved lesson progress remain valid.

Four additional cybersecurity lessons cover threat modeling, CVE investigation, SPDX validation/reconciliation and remediation-to-fleet evidence. Yocto Lens and VulnTrack appear in relevant readings, exercises and Library studies, with repository links and explicit limits. Commands are teaching examples, not executed by the website. No actual Yocto build, vulnerability scan or hardware security assessment was performed during website verification.

The separate textbook path includes 136 technical chapters and approximately 629,600 source words from all 12 supplied PDFs. This includes detailed topics beyond the guided path: power management, Qt projects, Rust, containers, trusted execution and the books' complete examples. Chapters retain authorship, release context and PDF page references. Text is loaded in page batches; the Original Pages view renders the PDF itself, preserving diagrams, tables and exact code layout. Extracted text can contain PDF layout artifacts; consult the original-page view where formatting matters.

Full-text search covers guided lessons and textbook content. Read Chapter connects a guided lesson to relevant complete textbook chapters. The sidebar's textbook button opens all source chapters. Notes, quizzes and progress are stored locally; notes can be exported. The design lab includes update-policy choices and a raw offline-retention calculation.

15 reviewed tutorial documents from Munawar-git/YoctoTutorials are mapped into the relevant hands-on labs. The site includes original exercise briefs, direct source links and release/interpretation notes. No repository license was declared at review time, so its source files are linked rather than redistributed.

New worked lessons cover build configuration, assignment semantics, a C recipe, maintained patches, RDEPENDS, RPROVIDES, image composition and systemd packaging. Additional guided topics cover shell automation, read-only systems, power management, Python, Qt, containers and Rust. Nine original Variscite board-lab briefs link the supplied DART-MX8M Scarthgap 6.6.y_2.2.2-v1.1 guide path to relevant lessons, with prerequisites, preparation commands, evidence and safety boundaries. They are not a mirror of the vendor manuals. Some individual vendor pages were inaccessible during review; live guides remain authoritative for board-specific steps.

Commands and console traces are educational examples, never executed by the site. The design lab offers qualitative engineering guidance; it does not generate production configurations or benchmark hardware. Course examples use a Scarthgap baseline; board boot stages and release details vary.

Architecture Design Playground has eleven update approaches, nine vendor-neutral scenarios and fourteen architecture/policy selectors. BSP provider, release and hardware family are independent. Ten release contexts span Dunfell through Blacksail plus vendor-pinned builds; nine hardware contexts include virtual, x86, i.MX, Sitara, STM32MP, Raspberry Pi, Jetson, FPGA SoCs and custom targets. Wind River release/RCPL context is explicit. The model checks conflicts, estimates a limited storage lower bound, retains choices locally and exports a Markdown brief; it does not certify compatibility or generate flash layouts.

The searchable cheatsheet includes Linux/target commands, Wind River setup/SBOM notes, cybersecurity snippets, command-effect labels, copy controls and source references. Requested shantanoo-desai topics have independently written explanations and version corrections. eLinux is linked but its anti-bot page blocked content verification. Thirty-three engineering studies include vendor integrations, upstream guidance, five Medium articles, eight Wind River technical/blog studies and four security/tool studies. They appear in relevant readings and Library; search includes their subjects. The Library release/hardware worksheet is learning coverage, not a fabricated support matrix.

The core worked examples retain their stated release rather than being silently rewritten by a selector. Readings explain the pre-Honister underscore/colon boundary and the 5.1 source-unpack transition. Historical vendor tutorials are labeled as historical; current vendor and upstream maintenance policies must be checked independently. Source review snapshot: 2026-11-18.

Resources remain in the supplied Resources directory. No files are uploaded or published. The local server binds only to loopback. Keep licensed reference books local unless you have distribution permission.

## Structure

- `src/course.js`, `course-catalog.js`, `course-expansion.js`, `foundations.js`, `platform.js`, `yocto-deep.js`, `yocto-production.js`, `advanced.js`: guided curriculum and focused course organization.
- `src/course-app.js`: views, navigation, assessment and persistence.
- `src/scenes.js`: illustrated isometric objects, animated flows and scenario states.
- `src/course.css`, `textbook.css`: reference palette, responsive layout and reading styles.
- `src/textbook-reader.js`, `textbooks/`: attributed chapter catalog, extracted text and original-page viewer.
- `src/community-labs.js`, `board-labs.js`: external tutorial mappings and original lab briefs.
- `src/design-model.js`, `design-lab.js`: testable design checks, estimates and interactive planning workspace.
- `src/cheatsheet.js`, `engineering-guides.js`: searchable command reference and source-linked engineering case studies.
- `scripts/index_resources.py`: page-addressable local research index.
- `scripts/build_textbooks.py`: reproducible source-chapter extraction using PDF bookmarks.
- `scripts/rename-resources.mjs`: idempotent descriptive renames with SHA-256 verification.
- `DESIGN.md`: reference-site observations and adaptation decisions.

PDF extraction scripts require Python and pypdf. They generate content mechanically; no source PDF is changed. The generated textbook files are already included for running the site.

No account or backend database is required. Progress is specific to the browser and origin; clearing browser storage clears it. Local PDF links require the Resources directory to remain beside index.html.
