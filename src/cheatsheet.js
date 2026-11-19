import {escapeHTML as esc,icon,matchesTerms} from './ui.js';
const docs='https://docs.yoctoproject.org/5.0.12/';
export const cheatSources=[
 {id:'security-cve',title:'Yocto 5.0 / Vulnerability checking',url:docs+'dev-manual/vulnerabilities.html',detail:'CVE matching, patch evidence and branch-specific status handling.'},
 {id:'security-sbom',title:'Yocto 5.0 / SPDX inventory',url:docs+'dev-manual/sbom.html',detail:'Scarthgap generation and output. Verify schema and defaults on newer branches.'},
 {id:'yocto-lens',title:'Prashant Divate / Yocto Lens',url:'https://github.com/prashantdivate/yocto-lens',detail:'Metadata linting before build; not a replacement for CVE analysis or target testing.'},
 {id:'windriver-setup',title:'Wind River versioned setup README',url:'https://github.com/WindRiverLinux24/wrlinux-x/blob/WRLINUX_10_24_LTS/README.md',detail:'Generated project configuration differs from active build-directory configuration. Match tool and product release.'},
 {id:'windriver-sbom',title:'Wind River SBOM technical README',url:'https://github.com/Wind-River/meta-wr-sbom/blob/main/README.md',detail:'Legacy layer generation and LTS25+ defaults have different requirements; inspect schema and scanner compatibility.'},
 {id:'community',title:'Shantanoo Desai / Yocto Project Cheatsheet',url:'https://github.com/shantanoo-desai/yoctoproject-cheatsheet',detail:'Community command coverage reviewed. Historical layer-creation and override examples need release-aware updates.'},
 {id:'readme',title:'Original cheatsheet README',url:'https://github.com/shantanoo-desai/yoctoproject-cheatsheet/blob/master/README.md',detail:'Source attribution and the original reference. Commands below have independently written interpretation and safety notes.'},
 {id:'elinux',title:'eLinux / BitBake Cheat Sheet',url:'https://elinux.org/Bitbake_Cheat_Sheet',detail:'Additional requested reference. Automated access was blocked during this review; its contents are not represented as verified or mirrored.'},
 {id:'debug',title:'Yocto 5.0 / Debugging',url:docs+'dev-manual/debugging.html',detail:'Effective variables, package data, task evidence and dependency inspection.'},
 {id:'tasks',title:'Yocto 5.0 / Tasks',url:docs+'ref-manual/tasks.html',detail:'Task semantics and the differences among clean, cleansstate and cleanall.'},
 {id:'sdk',title:'Yocto 5.0 / SDK workflow',url:docs+'sdk-manual/extensible.html',detail:'Managed devtool iteration and returning changes to maintained metadata.'},
 {id:'layers',title:'Yocto 5.0 / Layers',url:docs+'dev-manual/layers.html',detail:'Layer creation, registration, compatibility and ownership.'}
];
const C=(category,intent,command,note,source='debug',risk='inspect')=>({category,intent,command,note,source,risk});
export const cheatCommands=[
 C('Cybersecurity','Enable build-time CVE matching','INHERIT += "cve-check"','Configuration snippet. Rebuild and review branch-specific reports; zero findings do not prove security.','security-cve','configuration snippet'),
 C('Cybersecurity','Generate a Scarthgap SPDX inventory','INHERIT += "create-spdx"','Configuration snippet. Build the image, retain referenced documents and validate the emitted schema. Newer releases can have different defaults.','security-sbom','configuration snippet'),
 C('Cybersecurity','Gate owned metadata findings','yocto-lens --no-tui --fail-on high /path/to/meta-product','Install and pin a reviewed tool release first. Investigate findings and record justified exceptions.','yocto-lens','local analysis'),
 C('Wind River / BSP','Inspect the versioned setup instructions','less wrlinux-x/README.md','Read the checked-out product revision before running setup. Archived source availability is not a maintenance guarantee.','windriver-setup'),
 C('Wind River / BSP','Capture resolved project revisions','repo manifest -r','Run from the initialized project. Retain setup arguments, product release and RCPL identity separately.','windriver-setup'),
 C('Wind River / SBOM','Select package-URL metadata for the documented generation','WRTEMPLATE:append = " feature/purl"','WRLinux LTS25+ configuration example from the README, not a universal layer setting. Check scanner and SPDX compatibility.','windriver-sbom','configuration snippet'),
 C('Configuration','Query the selected machine','bitbake-getvar MACHINE','Run after sourcing the intended build environment.'),
 C('Configuration','Inspect a recipe value','bitbake-getvar -r sensor SRC_URI','Check assignment history as well as the final value.'),
 C('Configuration','Find source, build and install roots','bitbake-getvar -r sensor S\nbitbake-getvar -r sensor B\nbitbake-getvar -r sensor D','Do not assume S and B are identical.'),
 C('Configuration','Find task evidence directory','bitbake-getvar -r sensor T','Inspect log.do_<task> and run.do_<task> in the resolved directory.'),
 C('Configuration','Inspect full recipe metadata','bitbake -e sensor','Can reveal private paths or credentials; review before sharing.','community'),
 C('Configuration','List recipe versions','bitbake -s','Candidates are not the same as installed package versions.','community'),
 C('Layers','List active layer collections','bitbake-layers show-layers','A checkout on disk is not necessarily active.','layers'),
 C('Layers','Create an owned layer','bitbake-layers create-layer ../meta-training','Creates files; choose a new reviewed destination. Replaces old yocto-layer examples.','layers','changes files'),
 C('Layers','Register an existing layer','bitbake-layers add-layer ../meta-training','Modifies the current build configuration. Check compatibility first.','community','changes config'),
 C('Layers','Remove layer registration','bitbake-layers remove-layer ../meta-training','Removes registration, not the source directory. Dependent metadata may stop parsing.','community','changes config'),
 C('Layers','Inspect recipe candidates','bitbake-layers show-recipes "gdb*"','Recipe candidates do not enumerate all emitted runtime packages.','community'),
 C('Layers','Find overlayed recipes','bitbake-layers show-overlayed','Investigate selection before changing priority.','community'),
 C('Layers','Inspect matched append files','bitbake-layers show-appends','A local bbappend only matters when discovered and matched.','community'),
 C('Layers','Inspect cross-layer recipe requirements','bitbake-layers show-cross-depends','Useful for ownership boundaries; not the complete runtime package graph.','community'),
 C('Tasks','List the available task names','bitbake -c listtasks sensor','Task availability depends on inherited classes.','community'),
 C('Tasks','Prepare recipe sources','bitbake -c patch sensor','Runs required preparation dependencies; inspect source and patch logs.','tasks','build task'),
 C('Tasks','Build a single recipe','bitbake sensor','Does not automatically add its output to your product image.','tasks','build task'),
 C('Tasks','Re-run compilation deliberately','bitbake -f -c compile sensor','Forces this task and taints task state; not a universal stale-build fix.','community','forced task'),
 C('Tasks','Compile then continue downstream','bitbake -C compile sensor','Invalidates the named task stamp and continues the normal target dependency chain.','debug','forced task'),
 C('Tasks','Enter the recipe development shell','bitbake -c devshell sensor','A recipe-specific tool environment, not a persistence mechanism for temporary source edits.','community','interactive'),
 C('Tasks','Enter a Python metadata shell','bitbake -c devpyshell sensor','Inspect the task datastore; do not confuse it with the host Python environment.','community','interactive'),
 C('Tasks','Dry-run task scheduling','bitbake -n sensor','Shows planned actions without executing build tasks. Parsing and metadata access still occur.'),
 C('Dependencies','Generate task dependency graphs','bitbake -g sensor','Writes graph files in the build directory; inspect task-depends.dot.','debug','writes evidence'),
 C('Dependencies','Read a signature dump','bitbake-dumpsig <sigdata-file>','Supply a verified signature file; inspect variable dependencies.'),
 C('Dependencies','Compare two task signatures','bitbake-diffsigs <old-sigdata> <new-sigdata>','Compare equivalent task identities to investigate rebuild causes.'),
 C('Packages','Find the runtime package owning a file','oe-pkgdata-util find-path /usr/bin/sensor','Requires package data from built recipes.'),
 C('Packages','List a runtime package file set','oe-pkgdata-util list-pkg-files sensor','Use the output package name, not an assumed recipe name.'),
 C('Packages','Inspect runtime requirements','oe-pkgdata-util read-value RDEPENDS sensor','Check actual package dependency closure.'),
 C('Packages','Map package to recipe','oe-pkgdata-util lookup-recipe sensor','Package splitting means one recipe can own several packages.'),
 C('Packages','Inspect image package selection','bitbake-getvar -r training-image IMAGE_INSTALL','Also inspect the generated image manifest after rootfs resolution.'),
 C('SDK & devtool','Generate a standard SDK','bitbake training-image -c populate_sdk','SDK output follows the chosen image configuration.','sdk','build task'),
 C('SDK & devtool','Generate an extensible SDK','bitbake training-image -c populate_sdk_ext','Check selected release/platform support and disk needs.','sdk','build task'),
 C('SDK & devtool','List workspace modifications','devtool status','Identify overrides that must not leak into release assumptions.','sdk'),
 C('SDK & devtool','Prepare an existing recipe workspace','devtool modify sensor','Use a managed source tree; retain your work in version control.','sdk','changes workspace'),
 C('SDK & devtool','Build the workspace recipe','devtool build sensor','Validate package/image integration separately.','sdk','build task'),
 C('SDK & devtool','Integrate committed source changes','devtool finish sensor ../meta-product','Inspect generated metadata and patches. Commit and back up source work first.','sdk','changes files'),
 C('SDK & devtool','Remove a workspace override','devtool reset sensor','Retain source changes before resetting. Confirm documented behavior for your release.','sdk','changes workspace'),
 C('Cleaning','Remove recipe work outputs','bitbake -c clean sensor','Removes work output; shared-state reuse may restore it. Preserve diagnostic logs first.','tasks','removes work'),
 C('Cleaning','Remove work and local shared state','bitbake -c cleansstate sensor','More invasive than clean; coordinate shared caches. Remote mirrors may still supply state.','tasks','removes cache'),
 C('Cleaning','Remove work, state and downloaded inputs','bitbake -c cleanall sensor','Also affects fetched sources. Avoid as a routine fix, especially with shared downloads.','tasks','removes downloads'),
 C('Metadata','Declare runtime requirements','RDEPENDS:${PN} += "bash"','Package-level requirement; modern colon override syntax.','layers','recipe snippet'),
 C('Metadata','Add an image package','IMAGE_INSTALL:append = " training-hello"','Leading space is intentional. Put stable policy in the owned image recipe.','layers','recipe snippet'),
 C('Metadata','Extend local append search paths','FILESEXTRAPATHS:prepend := "${THISDIR}/${PN}:"','Immediate expansion and the trailing path separator are deliberate.','layers','recipe snippet')
];
export function filterCheats(query='',category='all',rows=cheatCommands){const terms=query.toLowerCase().trim().split(/\s+/).filter(Boolean);return rows.filter(r=>(category==='all'||r.category===category)&&matchesTerms([r.intent,r.command,r.note,r.category].join(' '),terms));}
export function cheatsheet(legacy=[]){
 for(const [intent,command,note] of legacy)if(!cheatCommands.some(r=>r.command===command))cheatCommands.push(C('Linux & target',intent,command,note));
 return `<main class="full-page cheatsheet-page" id="main"><div class="eyebrow">CHEATSHEETS / SCARTHGAP BASELINE</div><h1>Commands with a reason.</h1><p class="lead">Query before changing state. Examples use sensor and training-image; substitute verified recipe names and paths in a sourced build shell. Snippets belong in metadata, not the terminal.</p><div class="cheat-tools"><label class="field-label">Find a command<input id="cheat-query" type="search" placeholder="Try SDK, RDEPENDS, signature, clean…"></label><label class="field-label">Category<select id="cheat-category"><option value="all">All categories</option>${[...new Set(cheatCommands.map(r=>r.category))].map(c=>`<option>${esc(c)}</option>`).join('')}</select></label><span id="cheat-count" aria-live="polite"></span></div><div class="table-scroll"><table class="cheat-table"><thead><tr><th>Intent / category</th><th>Command or metadata</th><th>Interpretation / effect</th><th>Copy</th></tr></thead><tbody id="cheat-rows"></tbody></table></div><section class="cheat-sources"><h2>Sources & release interpretation</h2><p>Command topics include the supplied community cheatsheet, with current-release semantics checked against official documentation. No broad deletion shortcut is provided. Older underscore overrides and yocto-layer commands are not the course baseline.</p>${cheatSources.map(s=>`<article><a href="${s.url}" target="_blank" rel="noopener">${esc(s.title)} ${icon('ArrowUpRight',12)}</a><p>${esc(s.detail)}</p></article>`).join('')}</section></main>`;
}
export function bindCheatsheet(){const query=document.querySelector('#cheat-query'),category=document.querySelector('#cheat-category'),body=document.querySelector('#cheat-rows');function draw(){const rows=filterCheats(query.value,category.value);document.querySelector('#cheat-count').textContent=`${rows.length} of ${cheatCommands.length} entries`;body.innerHTML=rows.map(r=>`<tr><td><strong>${esc(r.intent)}</strong><small>${esc(r.category)}</small></td><td><pre><code>${esc(r.command)}</code></pre></td><td><span class="command-effect">${esc(r.risk)}</span><p>${esc(r.note)}</p><a href="${cheatSources.find(s=>s.id===r.source).url}" target="_blank" rel="noopener">Reference ${icon('ArrowUpRight',10)}</a></td><td><button class="icon-button" title="Copy ${esc(r.intent)}" data-copy-command="${esc(r.command)}">${icon('Copy',14)}</button></td></tr>`).join('')||'<tr><td colspan="4">No matching commands.</td></tr>';body.querySelectorAll('[data-copy-command]').forEach(b=>b.onclick=async()=>{try{await navigator.clipboard.writeText(b.dataset.copyCommand);b.title='Copied';b.innerHTML=icon('Check',14);}catch{b.title='Clipboard unavailable; select the command text.';}});}query.oninput=draw;category.onchange=draw;draw();}
