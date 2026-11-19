import {releases,hardwareFamilies,releaseContext} from './ecosystem.js';
export const updateStrategies=[
 {id:'qbee-rauc',label:'qbee management + RAUC A/B integration',layout:'ab',scene:'ota',summary:'The management agent and image installer have separate roles. Verify the qbee/RAUC integration, enrollment policy and board boot recovery for the selected release.',checks:['Pin meta-qbee and inspect layer compatibility for the BSP.','Keep enrollment secrets separate from public images; test health confirmation and reconnect behavior.'],url:'https://docs.qbee.io/deployment-yocto.html'},
 {id:'balena',label:'balenaOS / managed host + containers',layout:'managed',scene:'containers',summary:'A device-type-specific host, supervisor and application release form separate lifecycle boundaries. Verify device designation and supported OS upgrade paths.',checks:['Record host OS, supervisor, device type and application revisions independently.','Test host and application recovery with persistent volumes; do not ship development-mode access.'],url:'https://docs.balena.io/reference/os/overview/'},
 {id:'rauc-ab',label:'RAUC / signed A/B images',layout:'ab',scene:'ota',summary:'Signed bundles install to configured slots. Boot selection, application confirmation and data compatibility still require platform integration.',checks:['Test bootloader attempt limits and inactive-slot writes.','Retain signing trust, compatible identifiers and mark-good evidence.'],url:'https://rauc.readthedocs.io/en/latest/basic.html'},
 {id:'swupdate-ab',label:'SWUpdate / A/B system images',layout:'ab',scene:'ota',summary:'Handlers describe component installation. A/B behavior is an integration choice, not a guarantee created by the framework name.',checks:['Review sw-description, selected handlers and signature enforcement.','Test boot state, interrupted writes and component compatibility.'],url:'https://sbabic.github.io/swupdate/overview.html'},
 {id:'mender-ab',label:'Mender / rootfs A/B',layout:'ab',scene:'ota',summary:'A rootfs update design couples artifact delivery, target integration and commit/rollback policy. Application Update Modules have different contracts.',checks:['Verify the supported board, partition and bootloader integration.','Test commit, rollback, device authentication and fleet policy.'],url:'https://docs.mender.io/overview/introduction'},
 {id:'swupdate-recovery',label:'SWUpdate / recovery-system installation',layout:'recovery',scene:'recovery',summary:'A separate recovery system can install a main system while it is not running. Availability and recovery-image protection become explicit requirements.',checks:['Keep the recovery system bootable after a failed main-system write.','Test loss of power and interrupted recovery installation.'],url:'https://sbabic.github.io/swupdate/overview.html'},
 {id:'ostree',label:'OSTree / versioned system deployments',layout:'tree',scene:'deployments',summary:'Versioned filesystem deployments use a content-addressed object store. Deployment rollback differs from two fixed raw rootfs partitions.',checks:['Budget retained objects and deployment cleanup.','Validate boot integration and shared /var schema compatibility.'],url:'https://ostreedev.github.io/ostree/'},
 {id:'torizon',label:'Torizon / OS + application updates',layout:'tree',scene:'deployments',summary:'A vendor-integrated path supports OS and application delivery, with online and offline workflows. Check the supported Torizon release and module.',checks:['Validate the vendor client/backend and supported hardware.','Test compatibility between OS, application and persistent data.'],url:'https://developer.toradex.com/torizon/torizon-platform/torizon-updates/'},
 {id:'packages',label:'RPM / IPK / DEB package feeds',layout:'mutable',scene:'packages',summary:'Package-level changes support fine-grained delivery but do not inherently provide whole-system atomic rollback.',checks:['Maintain signed feed policy and coherent package versions.','Test partial transactions, dependency closure and external recovery.'],url:'https://docs.yoctoproject.org/5.0.12/dev-manual/packages.html'},
 {id:'containers',label:'Container application delivery',layout:'app',scene:'containers',summary:'Application images can change independently of the host. The kernel, boot chain and host rootfs still need a separate maintained update path.',checks:['Pin image digests and constrain privileges/mounts.','Test host API compatibility and application-data rollback.'],url:'https://docs.mender.io/overview/introduction'},
 {id:'manual-recovery',label:'Service media / recovery re-image',layout:'recovery',scene:'recovery',summary:'An attended recovery workflow can fit serviced or disconnected products. It trades remote availability for physical access and a documented recovery process.',checks:['Authenticate media and verify destination identity.','Preserve identity/calibration and test interrupted installation.'],url:'https://dev.variscite.com/dart-mx8m/mx8m-yocto-scarthgap-6.6.y_2.2.2-v1.1/swupdate-guide/'}
];
export const designChoices={
 platform:{label:'BSP / platform provider',options:[['generic','Upstream / QEMU reference BSP'],['variscite','Variscite module BSP'],['toradex','Toradex BSP / OS offering'],['phytec','PHYTEC BSP'],['windriver','Wind River Linux'],['nxp','NXP i.MX BSP'],['ti','TI Processor SDK / Arago'],['st','ST OpenSTLinux'],['community','Community board BSP'],['custom','Other vendor / owned BSP']]},
 release:{label:'Yocto release context',options:releases.map(r=>[r.id,r.label])},
 hardware:{label:'Hardware family',options:hardwareFamilies.map(h=>[h.id,h.label])},
 rootfs:{label:'Root filesystem',options:[['ro','Read-only + dedicated data'],['rw','Writable root filesystem'],['overlay','Read-only lower + writable overlay'],['tree','Versioned immutable deployment']]},
 update:{label:'Update approach',options:updateStrategies.map(s=>[s.id,s.label])},
 delivery:{label:'Delivery channel',options:[['https','Authenticated HTTPS service'],['fleet','Fleet orchestration service'],['usb','Authenticated removable media'],['lan','Managed local-network service']]},
 payload:{label:'Payload transfer',options:[['full','Full payload'],['delta','Delta / incremental payload'],['stream','Streaming where supported']]},
 storage:{label:'Storage model',options:[['emmc','Managed block storage / eMMC'],['sd','Removable SD'],['nand','Raw NAND + UBI / UBIFS'],['nor','NOR / constrained flash']]},
 boot:{label:'Boot recovery policy',options:[['attempts','Bounded trial boot + fallback'],['recovery','Dedicated recovery boot'],['manual','Manual service recovery only']]},
 health:{label:'Candidate confirmation',options:[['validated','Required product health checks'],['staged','Checks + bounded soak window'],['early','PID 1 starts (unsafe shortcut)']]},
 trust:{label:'Execution trust',options:[['signed','Authenticated updates only'],['verified','Verified boot + rootfs integrity'],['rollback','Verified boot + anti-rollback policy']]},
 data:{label:'Persistent-data evolution',options:[['compatible','Backward-compatible schema'],['snapshot','Versioned snapshot + restore plan'],['forward','Forward-only migration']]},
 network:{label:'Connectivity',options:[['offline','Intermittent / long offline periods'],['online','Usually connected'],['airgap','Air-gapped / service visits']]},
 rollout:{label:'Release rollout',options:[['canary','Canary -> cohorts -> fleet'],['attended','Attended maintenance window'],['all','Entire fleet at once']]}
};
export const numericFields={rate:{label:'Sample rate (Hz)',min:0.01,max:100000,value:10},bytes:{label:'Bytes per sample',min:1,max:1000000,value:64},hours:{label:'Offline hours',min:0,max:8760,value:24},headroom:{label:'Retention headroom (%)',min:0,max:500,value:30},slot:{label:'One expanded rootfs / tree budget (GiB)',min:0.01,max:1024,value:1},reserve:{label:'Boot, recovery, staging + logs reserve (GiB)',min:0,max:4096,value:1},capacity:{label:'Usable device capacity (GiB)',min:0.01,max:16384,value:8}};
export const defaultDesign={platform:'generic',release:'vendor',hardware:'qemu',rootfs:'ro',update:'rauc-ab',delivery:'https',payload:'full',storage:'emmc',boot:'attempts',health:'validated',trust:'verified',data:'compatible',network:'offline',rollout:'canary',...Object.fromEntries(Object.entries(numericFields).map(([k,v])=>[k,v.value]))};
export const designPresets=[
 {id:'gateway',label:'Recoverable gateway',values:{...defaultDesign}},
 {id:'variscite',label:'Board-integrated A/B system',values:{...defaultDesign,platform:'variscite',hardware:'imx',update:'swupdate-ab'}},
 {id:'torizon',label:'Versioned OS + applications',values:{...defaultDesign,platform:'toradex',hardware:'custom',rootfs:'tree',update:'torizon',delivery:'fleet'}},
 {id:'service',label:'Offline serviced product',values:{...defaultDesign,update:'manual-recovery',delivery:'usb',network:'airgap',boot:'recovery',rollout:'attended'}},
 {id:'constrained',label:'Constrained recovery design',values:{...defaultDesign,update:'swupdate-recovery',storage:'nand',boot:'recovery',slot:0.25,reserve:0.25,capacity:1}},
 {id:'application',label:'Container application boundary',values:{...defaultDesign,update:'containers',delivery:'fleet'}},
 {id:'managed-agent',label:'Agent-managed recoverable fleet',values:{...defaultDesign,update:'qbee-rauc',delivery:'fleet'}},
 {id:'managed-host',label:'Managed container-host lifecycle',values:{...defaultDesign,platform:'custom',hardware:'custom',update:'balena',delivery:'fleet'}},
 {id:'maintained-platform',label:'Maintained multi-architecture product',values:{...defaultDesign,platform:'windriver',hardware:'custom'}}
];
export function normalizeDesign(input={}){input=input&&typeof input==='object'?input:{};const state={...defaultDesign};for(const [key,field] of Object.entries(designChoices))if(field.options.some(([id])=>id===input[key]))state[key]=input[key];for(const key of Object.keys(numericFields))if(Object.hasOwn(input,key))state[key]=input[key]===''?NaN:Number(input[key]);return state;}
export function evaluateDesign(input){
 const s=normalizeDesign(input),strategy=updateStrategies.find(v=>v.id===s.update),warnings=[],notes=[...strategy.checks],tests=['Interrupt download, installation and first boot at controlled points on a recoverable development unit.','Test expired/untrusted signatures, wrong hardware compatibility and unavailable update servers.','Verify identity, calibration and persistent records across update and rollback.'];
 const context=releaseContext(s.release,s.hardware);
 if(s.platform==='windriver')notes.push('Record Wind River Linux product release, RCPL maintenance level, setup revision and validated BSP separately from the upstream Yocto series.','The LTS25 notice maps that product to Walnascar; the product page reviewed 2026-11-19 describes LTS26/Wrynose. Check the exact versioned support record, not a moving marketing page.','Archived WindRiver-Labs examples, custom layers and independently selected OTA frameworks do not acquire commercial support automatically. Validate the integration and contract scope.');
 notes.push(`Release context: ${context.release.note}`,`Hardware context: ${context.hardware.note}`,'BSP + Yocto branch + board revision + updater version compatibility remains unverified until documented and tested.');
 if(s.release==='dunfell')warnings.push('Legacy-release study: audit underscore overrides and verify who supplies ongoing security maintenance. Modern course snippets cannot be copied unchanged.');
 if(strategy.id==='mender-ab'&&s.release!=='vendor'&&!['scarthgap','wrynose'].includes(s.release))warnings.push('The Mender policy reviewed 2026-11-18 lists Scarthgap and Wrynose. This release needs separate compatibility/maintenance evidence; branch existence is insufficient.');
 if(strategy.layout==='managed')notes.push('Capacity sketch is incomplete for this managed host. Measure its actual partition layout, retained host images, container layers and update peaks; enter those costs explicitly.');
 if(strategy.id==='qbee-rauc')notes.push('The qbee tutorial includes historical Kirkstone wording; verify present layer compatibility instead of treating that example as the current release recommendation.');
 if(s.health==='early')warnings.push('Starting PID 1 is not product readiness. Early confirmation can discard the recovery opportunity.');
 if(s.health==='staged')notes.push('Define a bounded soak window, required checks and who commits or rejects the candidate.');
 if(strategy.layout==='ab'&&s.boot!=='attempts')warnings.push('This A/B design lacks the selected bounded trial-boot/fallback policy. Two slots alone do not recover failed boots.');
 if(strategy.layout==='recovery'&&s.boot==='attempts')warnings.push('Define how the trial policy reaches the dedicated recovery system; a single main rootfs has no old rootfs slot to select.');
 if(strategy.layout==='mutable'&&s.rootfs!=='rw')warnings.push('Package-feed updates need a writable installation target. A read-only or immutable root requires another deployment design.');
 if(strategy.layout==='tree'&&s.rootfs!=='tree')warnings.push('Versioned deployments require their filesystem/deployment model; do not treat this as a raw-partition installer.');
 if(strategy.layout==='app')warnings.push('This updates applications only. Specify a separate host OS, kernel and bootloader update/recovery path.');
 if(s.data==='forward')warnings.push('A forward-only data migration may make software rollback unusable. Add reversible migration or a tested restore boundary.');
 if(s.data==='snapshot')notes.push('Snapshots require capacity, consistency and restoration testing; not every selected filesystem supports the same mechanism.');
 if(s.network==='airgap'&&s.delivery!=='usb')warnings.push('The selected network delivery channel does not meet the air-gapped operating constraint. Define an offline import path.');
 if(s.delivery==='usb')notes.push('Physical media still needs authenticity, replay policy, operator permissions and audit evidence.');
 if(s.delivery==='fleet')notes.push('Choose a compatible target client/backend pair; an on-device installer does not by itself supply fleet orchestration.');
 if(s.payload==='delta')notes.push('Delta support depends on tool/version and source state. Retain a full fallback payload and measure temporary storage and bandwidth.');
 if(s.payload==='stream')notes.push('Streaming is implementation-specific. Verify transport/kernel support and interruption behavior; it does not mean zero reserved storage.');
 if(s.storage==='nand')notes.push('Raw NAND needs bad-block, eraseblock and UBI volume design; a block-device partition sketch cannot be reused unchanged.');
 if(s.storage==='nor')warnings.push('Check erase geometry and capacity against the selected update layout; large duplicated rootfs images may not fit constrained NOR.');
 if(s.storage==='sd')notes.push('Validate removable-media endurance, loss/removal behavior and power-loss recovery.');
 if(s.rootfs==='overlay')notes.push('Version or reset the writable upper layer explicitly; stale upper files can mask a newly deployed lower image.');
 if(s.rootfs==='rw')notes.push('Specify filesystem recovery, transactional application writes and package/configuration drift controls.');
 if(s.trust==='signed')notes.push('Authenticating an update is not the same as enforcing trusted execution at boot.');
 if(s.trust==='rollback')notes.push('Anti-rollback policy must allow the intended known-good fallback; provision counters and recovery keys deliberately. Never experiment with fuses casually.');
 if(s.rollout==='all')warnings.push('A fleet-wide first deployment has no canary containment. Define staged rollout, stop thresholds and recovery staffing.');
 if(s.platform==='variscite')notes.push('The supplied DART-MX8M guide is release-specific; verify kernel, carrier DTB and BSP layer revisions before adapting its update flow.');
 if(s.platform==='toradex'&&s.update!=='torizon')notes.push('This is an alternative integration study, not a claim of supported Torizon configuration. Check vendor support and boot ownership.');
 if(s.update==='torizon'&&s.platform!=='toradex')warnings.push('The Torizon preset is a vendor-integrated path, not a drop-in updater for an arbitrary BSP. Verify supported hardware/integration.');
 const invalid=Object.entries(numericFields).filter(([key,f])=>!Number.isFinite(s[key])||s[key]<f.min||s[key]>f.max).map(([,f])=>f.label);
 const valid=invalid.length===0;
 if(!valid)warnings.push(`Correct out-of-range or missing values: ${invalid.join(', ')}.`);
 const rawMiB=valid?s.rate*s.bytes*s.hours*3600/1048576:null,retentionGiB=valid?rawMiB/1024*(1+s.headroom/100):null;
 const copies=strategy.layout==='ab'?2:1;
 const estimatedGiB=valid?s.slot*copies+s.reserve+retentionGiB:null;
 if(valid&&estimatedGiB>s.capacity)warnings.push('The illustrative storage lower bound exceeds usable capacity. Resize the layout, retention policy or hardware.');
 if(strategy.layout==='tree')notes.push('Storage estimate includes one entered tree budget only. Measure shared objects, retained deployments and garbage-collection peaks separately.');
 if(strategy.layout==='app')notes.push('Storage estimate excludes retained container layers and the separate host-update layout; add both to the reserve or a detailed budget.');
 tests.push(s.network==='offline'?'Test the maximum offline interval, queue saturation, reconnect backoff and duplicate delivery.':'Test endpoint failure and interrupted delivery despite expected connectivity.');
 return {state:s,strategy,warnings,notes,tests,valid,rawMiB,retentionGiB,estimatedGiB,copies};
}
