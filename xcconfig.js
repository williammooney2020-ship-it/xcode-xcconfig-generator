"use strict";

// ── Build setting definitions ───────────────────────────────────────────────
const SETTINGS = [
  // Identity
  { key:"PRODUCT_BUNDLE_IDENTIFIER", label:"Bundle Identifier", group:"Identity",
    type:"text", placeholder:"com.example.MyApp", hint:"Must be unique on the App Store." },
  { key:"PRODUCT_NAME", label:"Product Name", group:"Identity",
    type:"text", placeholder:"MyApp", hint:"Used as the .app/.framework binary name." },
  { key:"MARKETING_VERSION", label:"Marketing Version (CFBundleShortVersionString)", group:"Identity",
    type:"text", placeholder:"1.0.0", hint:"Displayed in the App Store and on-device." },
  { key:"CURRENT_PROJECT_VERSION", label:"Build Number (CFBundleVersion)", group:"Identity",
    type:"text", placeholder:"1", hint:"Must be an integer ≥ 1 and strictly increasing for each upload." },
  { key:"DEVELOPMENT_TEAM", label:"Development Team ID", group:"Identity",
    type:"text", placeholder:"ABCD123456", hint:"10-character team ID from your Apple Developer account." },

  // Swift
  { key:"SWIFT_VERSION", label:"Swift Language Version", group:"Swift",
    type:"select", options:["6.0","5.10","5.9","5.8","5.7","5.6","5.5","5.4","5.3","5.2","5.1","5.0"], hint:"Must match the Swift toolchain bundled with your Xcode version." },
  { key:"SWIFT_OPTIMIZATION_LEVEL", label:"Swift Optimization Level", group:"Swift",
    type:"select",
    options:["None [-Onone]","Optimize Speed [-O]","Optimize Size [-Osize]","Whole Module [-Owhole-module]"],
    values:["-Onone","-O","-Osize","-Owhole-module"],
    hint:"Use -Onone for Debug, -O or -Osize for Release." },
  { key:"SWIFT_COMPILATION_MODE", label:"Swift Compilation Mode", group:"Swift",
    type:"select", options:["Incremental","Whole Module"],
    values:["incremental","wholemodule"],
    hint:"Whole Module enables cross-file optimisations at the cost of build speed." },

  // Deployment
  { key:"IPHONEOS_DEPLOYMENT_TARGET", label:"iOS Deployment Target", group:"Deployment",
    type:"select",
    options:["18.0","17.0","16.0","15.0","14.0","13.0","12.0"],
    hint:"Minimum iOS version your app supports." },
  { key:"TARGETED_DEVICE_FAMILY", label:"Targeted Device Family", group:"Deployment",
    type:"select",
    options:["iPhone only","iPad only","iPhone + iPad","Mac Catalyst"],
    values:["1","2","1,2","6"],
    hint:"1=iPhone, 2=iPad, 6=Mac Catalyst." },
  { key:"SUPPORTS_MACCATALYST", label:"Mac Catalyst", group:"Deployment",
    type:"bool", hint:"Set YES to enable running on macOS via Mac Catalyst." },

  // Code Signing
  { key:"CODE_SIGN_IDENTITY", label:"Code Sign Identity", group:"Code Signing",
    type:"select",
    options:["iPhone Developer (Development)","iPhone Distribution (Distribution)","Apple Development","Apple Distribution"],
    values:["iPhone Developer","iPhone Distribution","Apple Development","Apple Distribution"],
    hint:"Use 'Apple Development' / 'Apple Distribution' for modern Xcode automatic signing." },
  { key:"CODE_SIGN_STYLE", label:"Code Signing Style", group:"Code Signing",
    type:"select", options:["Automatic","Manual"],
    values:["Automatic","Manual"],
    hint:"Manual requires explicit provisioning profile." },
  { key:"PROVISIONING_PROFILE_SPECIFIER", label:"Provisioning Profile Specifier", group:"Code Signing",
    type:"text", placeholder:"match AppStore com.example.MyApp",
    hint:"Name or UUID of your provisioning profile. Used in Manual signing." },
  { key:"CODE_SIGN_ENTITLEMENTS", label:"Entitlements File Path", group:"Code Signing",
    type:"text", placeholder:"MyApp/MyApp.entitlements",
    hint:"Relative path to the .entitlements file from the project root." },

  // Build Paths
  { key:"CONFIGURATION_BUILD_DIR", label:"Build Directory", group:"Build Paths",
    type:"text", placeholder:"$(BUILD_DIR)/$(CONFIGURATION)$(EFFECTIVE_PLATFORM_NAME)",
    hint:"Override if your targets must share build artifacts." },
  { key:"SYMROOT", label:"Derived Data / sym root", group:"Build Paths",
    type:"text", placeholder:"$(SRCROOT)/build",
    hint:"Set to keep build artifacts inside the project for reproducibility." },

  // Preprocessor
  { key:"GCC_PREPROCESSOR_DEFINITIONS", label:"Preprocessor Definitions", group:"Preprocessor",
    type:"text", placeholder:"DEBUG=1 $(inherited)",
    hint:"Space-separated definitions. Always append $(inherited) to avoid overriding parent configs." },
  { key:"OTHER_SWIFT_FLAGS", label:"Other Swift Flags", group:"Preprocessor",
    type:"text", placeholder:"-DDEBUG $(inherited)",
    hint:"Extra swiftc flags. Use $(inherited) to merge with the project level." },
  { key:"OTHER_CFLAGS", label:"Other C Flags", group:"Preprocessor",
    type:"text", placeholder:"$(inherited)",
    hint:"Extra clang flags." },
  { key:"OTHER_LDFLAGS", label:"Other Linker Flags", group:"Preprocessor",
    type:"text", placeholder:"$(inherited) -ObjC",
    hint:"-ObjC is needed if any static lib exposes ObjC categories." },

  // Linker / Frameworks
  { key:"FRAMEWORK_SEARCH_PATHS", label:"Framework Search Paths", group:"Linker",
    type:"text", placeholder:"$(inherited) $(PROJECT_DIR)/Frameworks",
    hint:"Directories to search for .framework bundles." },
  { key:"LIBRARY_SEARCH_PATHS", label:"Library Search Paths", group:"Linker",
    type:"text", placeholder:"$(inherited) $(PROJECT_DIR)/Libraries",
    hint:"Directories to search for .a static libraries." },
  { key:"SWIFT_INCLUDE_PATHS", label:"Swift Include Paths", group:"Linker",
    type:"text", placeholder:"$(inherited) $(SRCROOT)/Modules",
    hint:"Directories for Swift module (.swiftmodule) imports." },

  // Testing
  { key:"ENABLE_TESTING_SEARCH_PATHS", label:"Enable Testing Search Paths", group:"Testing",
    type:"bool", hint:"Adds $(PLATFORM_DIR)/Developer/Library/Frameworks to the search path for XCTest." },
  { key:"TESTABILITY", label:"Enable Testability", group:"Testing",
    type:"bool", hint:"Adds -enable-testing swiftc flag so @testable import works in unit tests." },

  // Debug / Symbols
  { key:"DEBUG_INFORMATION_FORMAT", label:"Debug Information Format", group:"Debug",
    type:"select",
    options:["DWARF","DWARF with dSYM file"],
    values:["dwarf","dwarf-with-dsym"],
    hint:"Use 'dwarf-with-dsym' in Release for Crashlytics and Instruments." },
  { key:"GCC_GENERATE_DEBUGGING_SYMBOLS", label:"Generate Debugging Symbols", group:"Debug",
    type:"bool", hint:"Disable in Release if you want to strip all debug info." },
  { key:"COPY_PHASE_STRIP", label:"Strip Debug Symbols During Copy", group:"Debug",
    type:"bool", hint:"YES strips binaries during the copy build phase (Release only)." },
  { key:"STRIP_INSTALLED_PRODUCT", label:"Strip Linked Product", group:"Debug",
    type:"bool", hint:"Strips the final binary of debug symbols." },

  // Misc
  { key:"ALWAYS_SEARCH_USER_PATHS", label:"Always Search User Paths", group:"Misc",
    type:"bool", hint:"Should be NO in modern Xcode projects." },
  { key:"CLANG_ENABLE_MODULES", label:"Enable Clang Modules", group:"Misc",
    type:"bool", hint:"Enables @import syntax for Obj-C modules." },
  { key:"ENABLE_BITCODE", label:"Enable Bitcode", group:"Misc",
    type:"bool", hint:"Deprecated since Xcode 14. Leave off for modern projects." },
  { key:"ENABLE_STRICT_OBJC_MSGSEND", label:"Enable Strict Messaging", group:"Misc",
    type:"bool", hint:"YES (default) catches bad ObjC message-send function pointer casts." },
];

// Group settings
const GROUPS = {};
SETTINGS.forEach(s => {
  if (!GROUPS[s.group]) GROUPS[s.group] = [];
  GROUPS[s.group].push(s);
});

// ── State ───────────────────────────────────────────────────────────────────
const STATE = {
  configName: "Debug",
  includesEnabled: false,
  includes: [],          // array of { id, path }
  values: {},            // key → string (from user input)
  enabled: new Set(),    // keys the user has toggled on
};

let _uid = 1;
function uid() { return "s" + (_uid++); }

// ── Helpers ─────────────────────────────────────────────────────────────────
function el(id) { return document.getElementById(id); }

function setEnabled(key, on) {
  if (on) STATE.enabled.add(key);
  else STATE.enabled.delete(key);
  generate();
}
function setValue(key, val) {
  STATE.values[key] = val;
  generate();
}

function addInclude() {
  STATE.includes.push({ id: uid(), path: "" });
  renderIncludes();
}
function removeInclude(id) {
  STATE.includes = STATE.includes.filter(i => i.id !== id);
  renderIncludes();
  generate();
}
function updateInclude(id, val) {
  const inc = STATE.includes.find(i => i.id === id);
  if (inc) { inc.path = val; generate(); }
}

// ── Render ──────────────────────────────────────────────────────────────────
function renderIncludes() {
  const wrap = el("includesList");
  if (!wrap) return;
  wrap.innerHTML = STATE.includes.map(inc => `
    <div class="include-row" id="inc_${inc.id}">
      <span style="color:var(--muted);font-size:13px;flex:none">#include</span>
      <input type="text" value="${esc(inc.path)}" placeholder="Shared/Base.xcconfig"
        oninput="updateInclude('${inc.id}',this.value)" style="flex:1" />
      <button class="rm-btn" onclick="removeInclude('${inc.id}')">✕</button>
    </div>`).join("");
}

function renderGroups() {
  const container = el("groupsContainer");
  if (!container) return;
  container.innerHTML = "";
  Object.entries(GROUPS).forEach(([name, settings]) => {
    const div = document.createElement("div");
    div.className = "group-card";
    div.innerHTML = `<div class="group-head">${name}</div>
      <div class="group-body">
        ${settings.map(s => renderSetting(s)).join("")}
      </div>`;
    container.appendChild(div);
  });
}

function renderSetting(s) {
  const checked = STATE.enabled.has(s.key);
  const val = STATE.values[s.key] ?? "";

  let input = "";
  if (s.type === "text") {
    input = `<input type="text" id="inp_${s.key}" value="${esc(val)}"
      placeholder="${esc(s.placeholder||"")}"
      oninput="setValue('${s.key}',this.value)"
      ${checked ? "" : "disabled"} />`;
  } else if (s.type === "select") {
    const opts = s.options.map((o, i) => {
      const v = s.values ? s.values[i] : o;
      return `<option value="${esc(v)}" ${val === v ? "selected" : ""}>${esc(o)}</option>`;
    }).join("");
    input = `<select id="inp_${s.key}" onchange="setValue('${s.key}',this.value)" ${checked ? "" : "disabled"}>
      <option value="">-- pick --</option>${opts}</select>`;
  } else if (s.type === "bool") {
    const isYes = val === "YES";
    input = `<div class="bool-row" id="inp_${s.key}">
      <label class="bool-opt ${isYes ? "active" : ""}" onclick="setValue('${s.key}','YES');updateBool('${s.key}','YES')">YES</label>
      <label class="bool-opt ${!isYes && val ? "active" : ""}" onclick="setValue('${s.key}','NO');updateBool('${s.key}','NO')">NO</label>
    </div>`;
  }

  return `
    <div class="setting-row ${checked ? "enabled" : ""}">
      <label class="check-label">
        <input type="checkbox" ${checked ? "checked" : ""}
          onchange="toggleSetting('${s.key}',this.checked)" />
        <div>
          <span class="s-label">${esc(s.label)}</span>
          <span class="s-key">${esc(s.key)}</span>
        </div>
      </label>
      ${checked ? `<div class="s-input">${input}</div>` : ""}
      <div class="s-hint">${esc(s.hint||"")}</div>
    </div>`;
}

function toggleSetting(key, on) {
  const s = SETTINGS.find(x => x.key === key);
  if (on && s && s.type === "select" && !STATE.values[key]) {
    // default to first option value
    const firstVal = s.values ? s.values[0] : s.options[0];
    STATE.values[key] = firstVal;
  }
  setEnabled(key, on);
  // re-render only this setting's row
  const row = document.querySelector(`[data-key="${key}"]`);
  if (row) row.outerHTML = renderSetting(s);
  // actually just re-render full groups for simplicity
  renderGroups();
}

function updateBool(key, val) {
  STATE.values[key] = val;
  generate();
  // update active classes without full re-render
  const wrap = el("inp_" + key);
  if (!wrap) return;
  wrap.querySelectorAll(".bool-opt").forEach(l => {
    l.classList.toggle("active", l.textContent === val);
  });
}

// ── Generate ────────────────────────────────────────────────────────────────
function esc(s) { return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }

function generate() {
  const lines = [];

  // Header comment
  lines.push(`// ${STATE.configName}.xcconfig`);
  lines.push(`// Generated by Orb Intelligence — https://xcode-xcconfig-generator.vercel.app`);
  lines.push(``);

  // Includes
  if (STATE.includes.length > 0) {
    lines.push(`// ── Includes ──────────────────────────────────────────────────────────────`);
    STATE.includes.forEach(inc => {
      if (inc.path.trim()) lines.push(`#include "${inc.path.trim()}"`);
    });
    lines.push(``);
  }

  // Settings by group
  const groupNames = Object.keys(GROUPS);
  groupNames.forEach(gname => {
    const gSettings = GROUPS[gname].filter(s => STATE.enabled.has(s.key));
    if (gSettings.length === 0) return;
    lines.push(`// ── ${gname} ${"─".repeat(Math.max(0, 70 - gname.length))}`);
    gSettings.forEach(s => {
      const val = STATE.values[s.key] ?? "";
      if (val !== "") lines.push(`${s.key} = ${val}`);
    });
    lines.push(``);
  });

  if (STATE.enabled.size === 0 && STATE.includes.length === 0) {
    lines.push(`// Enable settings on the left to build your xcconfig file.`);
  }

  const text = lines.join("\n");
  el("xcOutput").textContent = text;

  // key count
  el("keyCount").textContent = `${STATE.enabled.size} setting${STATE.enabled.size!==1?"s":""}`;
}

// ── Clipboard / download ────────────────────────────────────────────────────
function copyXC() {
  const text = el("xcOutput").textContent;
  navigator.clipboard.writeText(text).then(() => {
    const b = el("copyBtn");
    const orig = b.textContent;
    b.textContent = "Copied!";
    setTimeout(() => { b.textContent = orig; }, 1500);
  });
}

function downloadXC() {
  const text = el("xcOutput").textContent;
  const name = (STATE.configName || "Config").replace(/[^a-zA-Z0-9_-]/g,"_") + ".xcconfig";
  const blob = new Blob([text], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
}

function clearAll() {
  STATE.values = {};
  STATE.enabled = new Set();
  STATE.includes = [];
  renderGroups();
  renderIncludes();
  generate();
}

// ── Init ────────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  el("configNameInput").addEventListener("input", e => {
    STATE.configName = e.target.value;
    generate();
  });
  renderGroups();
  renderIncludes();
  generate();
});
