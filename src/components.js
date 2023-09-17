class Navbar extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
    <style>
    .retract {
      transform: translateY(-100%);
    }
    </style>
    <nav class="sticky top-0 z-[100] drop-shadow-md px-4 py-4 flex justify-between items-center transition-all bg-white">
      <a class="text-2xl font-bold leading-none" href="/">
        Counseling Check-In
      </a>
      <ul class="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2  mx-auto flex items-center w-auto space-x-6">
        <li><a class="text-sm text-slate-400 hover:text-slate-500 hover:font-bold" href="/">Home</a></li>
        <li class="text-slate-300">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" class="w-4 h-4 current-fill" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v0m0 7v0m0 7v0m0-13a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </li>
        <li><a class="text-sm text-slate-400 hover:text-slate-500 hover:font-bold" href="/login/">Reports</a></li>

    </nav>
    `;
  }
}

customElements.define("navbar-component", Navbar);
