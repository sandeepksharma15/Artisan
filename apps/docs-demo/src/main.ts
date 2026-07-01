import "@craftcss/artisan/styles.css";
import "./app.css";

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("Missing #app root element.");
}

app.innerHTML = `
  <main class="demo-shell l-container l-flow">
    <header class="demo-hero">
      <p class="c-badge">CraftCss v1 Demo</p>
      <h1>Artisan Theme Integration App</h1>
      <p class="u-text-muted">
        Live documentation by example. All styles come from <span class="demo-kbd">@craftcss/artisan</span>.
      </p>
      <div class="l-cluster">
        <button id="theme-default" class="c-button" type="button">Default Theme Scope</button>
        <button id="theme-artisan" class="c-button" type="button">Force Artisan Scope</button>
      </div>
    </header>

    <section class="demo-section l-flow">
      <h2>Layout + Utility Primitives</h2>
      <div class="l-grid demo-grid">
        <article class="demo-panel l-stack" data-space="sm">
          <h3>Stack + Cluster</h3>
          <div class="l-cluster">
            <span class="c-badge">alpha</span>
            <span class="c-badge" data-tone="success">beta</span>
            <span class="c-badge" data-tone="danger">gamma</span>
          </div>
          <p class="u-text-muted">Spacing and wrapping come from layout primitives only.</p>
        </article>
        <article class="demo-panel l-sidebar">
          <aside class="u-text-muted">Sidebar content</aside>
          <div>
            <h3>Sidebar Pattern</h3>
            <p>Primary content grows while side content keeps a stable basis.</p>
          </div>
        </article>
      </div>
    </section>

    <section class="demo-section l-flow">
      <h2>Wave 1: Form + Action</h2>
      <div class="l-grid demo-grid">
        <form class="c-card l-flow" aria-label="Wave 1 form">
          <label class="c-field-label" for="name">Name</label>
          <input id="name" class="c-input" type="text" placeholder="Jane Artisan" />

          <label class="c-field-label" for="role">Role</label>
          <select id="role" class="c-select">
            <option>Designer</option>
            <option>Engineer</option>
          </select>

          <label class="c-field-label" for="notes">Notes</label>
          <textarea id="notes" class="c-textarea" placeholder="Container-first layouts are live in this demo."></textarea>

          <label class="c-choice"><input class="c-checkbox" type="checkbox" /> Receive updates</label>
          <label class="c-choice"><input class="c-radio" type="radio" name="mode" checked /> Compact mode</label>
          <label class="c-choice"><input class="c-radio" type="radio" name="mode" /> Spacious mode</label>
          <label class="c-choice"><input class="c-switch" type="checkbox" checked /> Enable motion</label>

          <div class="l-cluster">
            <button class="c-button" type="submit">Save</button>
            <button class="c-button" type="button" disabled>Disabled Action</button>
          </div>
        </form>
      </div>
    </section>

    <section class="demo-section l-flow">
      <h2>Wave 2: Surface + Navigation</h2>
      <div class="l-grid demo-grid">
        <article class="c-card l-flow">
          <div class="c-card-header">
            <h3>Card Header</h3>
            <span class="c-badge" data-tone="success">Healthy</span>
          </div>
          <p>Cards, badges, and alerts share semantic/component token contracts.</p>
          <div class="c-alert" data-tone="danger" role="alert">
            <strong class="c-alert-title">Action Needed</strong>
            <span>Rotate API key before Friday.</span>
          </div>
        </article>

        <article class="c-card l-flow">
          <ul class="c-menu" role="menu" aria-label="Project menu">
            <li><button class="c-menu-item" role="menuitem" aria-current="page">Overview</button></li>
            <li><button class="c-menu-item" role="menuitem">Deployments</button></li>
            <li><button class="c-menu-item" role="menuitem" aria-disabled="true">Billing</button></li>
          </ul>

          <div class="c-tabs">
            <div class="c-tab-list" role="tablist" aria-label="Analytics tabs">
              <button class="c-tab" role="tab" aria-selected="true">Traffic</button>
              <button class="c-tab" role="tab" aria-selected="false">Conversion</button>
              <button class="c-tab" role="tab" aria-selected="false">Revenue</button>
            </div>
            <section class="c-tab-panel" role="tabpanel">
              <div class="c-table-wrap">
                <table class="c-table">
                  <caption>Traffic Sources</caption>
                  <thead><tr><th>Source</th><th>Visits</th></tr></thead>
                  <tbody>
                    <tr><td>Organic</td><td>42,180</td></tr>
                    <tr><td>Email</td><td>8,221</td></tr>
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </article>
      </div>
    </section>

    <section class="demo-section l-flow">
      <h2>Wave 3: Overlay + Advanced</h2>
      <div class="demo-responsive-card c-card l-container">
        <div class="l-flow">
          <button id="open-dialog" class="c-button" type="button">Open Dialog</button>
          <div class="c-popover-wrap">
            <button id="toggle-popover" class="c-button" type="button" aria-expanded="false">Toggle Popover</button>
            <div id="popover" class="c-popover" hidden>
              <p class="u-m-0">Popover content uses structural overlay styles only.</p>
            </div>
          </div>
        </div>
        <div class="c-accordion" role="presentation">
          <section class="c-accordion-item">
            <button class="c-accordion-trigger" type="button" aria-expanded="true">Accordion Item A</button>
            <div class="c-accordion-panel">Panel content for item A.</div>
          </section>
          <section class="c-accordion-item">
            <button class="c-accordion-trigger" type="button" aria-expanded="false">Accordion Item B</button>
            <div class="c-accordion-panel" hidden>Panel content for item B.</div>
          </section>
        </div>
      </div>

      <dialog id="demo-dialog" class="c-dialog" aria-label="CraftCss dialog example">
        <header class="c-dialog-header">
          <h3 class="u-m-0">Dialog Title</h3>
          <button id="close-dialog" class="c-button" type="button">Close</button>
        </header>
        <div class="c-dialog-body l-flow">
          <p>Keyboard test: use <span class="demo-kbd">Tab</span> to move through controls.</p>
          <p>Container-query demo card on this page switches columns below 38rem container width.</p>
        </div>
      </dialog>

      <div class="c-toast-region" aria-live="polite" aria-atomic="true">
        <article class="c-toast" data-tone="success"><strong>Saved</strong><span>Theme preferences updated.</span></article>
        <article class="c-toast" data-tone="danger"><strong>Warning</strong><span>Token mismatch detected in preview branch.</span></article>
      </div>
    </section>

    <section class="demo-section l-flow">
      <h2>Copy-Paste Starter Snippets</h2>
      <pre class="demo-snippet"><code>&lt;link rel="stylesheet" href="@craftcss/artisan/styles.css" /&gt;

&lt;main class="l-container l-flow"&gt;
  &lt;button class="c-button"&gt;Primary Action&lt;/button&gt;
  &lt;div class="c-card l-flow"&gt;
    &lt;h2&gt;Card Title&lt;/h2&gt;
    &lt;p&gt;Token-driven content block&lt;/p&gt;
  &lt;/div&gt;
&lt;/main&gt;</code></pre>
    </section>
  </main>
`;

const root = document.documentElement;

document.querySelector<HTMLButtonElement>("#theme-default")?.addEventListener("click", () => {
  root.removeAttribute("data-craftcss-theme");
});

document.querySelector<HTMLButtonElement>("#theme-artisan")?.addEventListener("click", () => {
  root.setAttribute("data-craftcss-theme", "artisan");
});

const dialog = document.querySelector<HTMLDialogElement>("#demo-dialog");
document.querySelector<HTMLButtonElement>("#open-dialog")?.addEventListener("click", () => {
  dialog?.showModal();
});
document.querySelector<HTMLButtonElement>("#close-dialog")?.addEventListener("click", () => {
  dialog?.close();
});

const popover = document.querySelector<HTMLDivElement>("#popover");
const popoverToggle = document.querySelector<HTMLButtonElement>("#toggle-popover");
popoverToggle?.addEventListener("click", () => {
  const isOpen = popover?.hasAttribute("hidden") === false;
  if (popover) {
    if (isOpen) {
      popover.setAttribute("hidden", "");
      popoverToggle.setAttribute("aria-expanded", "false");
    } else {
      popover.removeAttribute("hidden");
      popoverToggle.setAttribute("aria-expanded", "true");
    }
  }
});
