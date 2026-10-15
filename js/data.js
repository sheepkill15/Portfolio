/*
 * All site content lives here. Both the full page and the Quick look are rendered from this file.
 *
 * Screenshots / recordings: drop a file into assets/shots/ and set `shot` on the project,
 * e.g. shot: 'altdwm.png' or shot: 'piyano.mp4' (.png .jpg .webp .gif .mp4 .webm all work).
 */
window.PORTFOLIO = {
  person: {
    name: 'Simon Aron',
    role: 'Full-Stack Software Engineer',
    spec: 'B2B Products & AI Systems',
    location: 'Târgu Mureș, Romania',
    email: 'simonarons15@gmail.com',
    resume: 'assets/Simon_Aron_Resume.pdf',
    links: [
      { label: 'LinkedIn', url: 'https://www.linkedin.com/in/simon-%C3%A1ron-62a75a194/' },
      { label: 'GitHub', url: 'https://github.com/sheepkill15' },
      { label: 'GitLab', url: 'https://gitlab.com/sheepkill15' },
    ],
    summary:
      'Full-stack software engineer building B2B products with Ruby on Rails, React, TypeScript and PostgreSQL. ' +
      'End-to-end product ownership and direct client collaboration, with experience in AI agents, integrations and real-time systems.',
    languages: [
      ['Hungarian', 'C2'],
      ['English', 'C1'],
      ['Romanian', 'C1'],
    ],
  },

  // Formspree (or similar) endpoint, e.g. 'https://formspree.io/f/abcdwxyz'.
  // Leave empty and the contact form falls back to opening the visitor's mail app.
  formEndpoint: '',

  highlights: [
    { big: '1.5 yrs', text: 'as the sole full-stack engineer on an AI-first B2B CRM/ERP: Rails, React, TypeScript and PostgreSQL, end to end' },
    { big: '10th', text: 'internationally at the Nemes Tihamér programming competition (2022)' },
    { big: '38th', text: 'globally at the Cloudflight Coding Contest (2024)' },
  ],

  experience: [
    {
      company: 'TakeOffLabs',
      role: 'Software Engineer',
      dates: 'Oct 2024 – Present',
      active: true,
      bullets: [
        'Served as the sole full-stack developer for 1.5 years on an AI-first B2B CRM/ERP, owning Rails, React, TypeScript and PostgreSQL end-to-end and working directly with clients.',
        'Built a sandboxed AI agent able to perform any action available to the current user; generated its callable TypeScript/JavaScript API from YARD-documented Rails services.',
        'Implemented customizable role-based access control (RBAC) and interactive approval for state-changing actions across background processes and foreground WebSockets using IPC.',
        'Improved AI-agent performance by replacing web API communication between the agent worker and main server with IPC and pipes, eliminating the need for networking.',
        'Optimized AI latency and inference cost through prompt/context design, code-based tool execution, caching and regular cross-model benchmarks.',
        'Built multi-account AI email automation for Gmail, Outlook and IMAP/SMTP, plus real-time private, group and announcement messaging.',
      ],
      quick: [0, 1, 2],
    },
    {
      company: 'Accenture Industry X',
      role: 'Software Engineering Intern',
      dates: 'Jun 2024 – Aug 2024',
      bullets: [
        'Built a demonstration manufacturing execution and operations management (MES/MOM) application with Angular and ASP.NET Core, modelling industrial manufacturing workflows.',
      ],
      quick: [0],
    },
    {
      company: 'ACard (KMDSZ)',
      role: 'Lead Developer',
      dates: 'Nov 2022 – Jun 2023',
      bullets: [
        'Implemented every major feature of a Flutter and Directus student-card app used by hundreds of students at its peak.',
        'Delivered most core features in a three-developer team, covering registration and access to public transport, events and partner discounts.',
      ],
      quick: [0],
    },
  ],

  skills: {
    primary: ['Ruby', 'Ruby on Rails', 'JavaScript', 'TypeScript', 'React', 'PostgreSQL'],
    ai: ['AI agents', 'RAG', 'Prompt / context engineering', 'Model benchmarking', 'Sandboxed code execution', 'WebSockets', 'IPC', 'RBAC', 'Caching'],
    additional: ['Python', 'C / C++', 'C#', 'Java', 'Kotlin', 'Dart', 'Lua', 'Rust', 'Angular', 'ASP.NET Core', 'Flutter', 'MongoDB'],
  },

  education: [
    { title: 'MSc Computer Science', where: 'Sapientia University', dates: '2025 – Present' },
    { title: 'BSc Computer Science', where: 'Babeș-Bolyai University', dates: '2022 – 2025' },
  ],

  achievements: [
    { title: '10th internationally', where: 'Nemes Tihamér', dates: '2022' },
    { title: '38th globally', where: 'Cloudflight Coding Contest', dates: '2024' },
  ],

  // Worlds are ordered top (closest to the user) to bottom (closest to the hardware).
  worlds: [
    {
      id: 'cloud', n: 1, name: 'The Cloud', plain: 'AI & product', color: '#b794ff',
      projects: [
        {
          id: 'omnidesign', name: 'OmniDesign', boss: true, shot: 'omnidesign.webp',
          pitch: 'An AI design tool that turns prompts into multi-page UI designs, powered by the AI coding agents people already pay for.',
          loot: [
            'Drives locally installed Claude Code, Codex and similar tools, so users bring their existing subscriptions instead of another API bill.',
            'Electron, React and TypeScript desktop app for Windows and macOS (Apple Silicon and Intel).',
            'Every pull request runs typechecking, unit and component tests, a production build and an Electron end-to-end suite.',
            'Every green push to main ships versioned installers to GitHub Releases, picked up by the app’s built-in auto-updater.',
          ],
          tags: ['Electron', 'React', 'TypeScript', 'GitHub Actions'],
          links: [{ label: 'Source', url: 'https://github.com/sheepkill15/OmniDesign' }],
        },
        {
          id: 'bluedom', name: 'Bluedom',
          pitch: 'Gamified employee engagement: post and complete quests through a type-racer minigame, earn tokens, climb the leaderboard and spend them in the shop.',
          tags: ['React', 'TypeScript', 'Bootstrap', 'Web API'],
          links: [{ label: 'Source', url: 'https://github.com/sheepkill15/bluedom' }],
        },
      ],
    },
    {
      id: 'desktop', n: 2, name: 'The Desktop', plain: 'Desktop & mobile apps', color: '#6fb7ff',
      projects: [
        {
          id: 'woc', name: 'Windows Orphan Cleaner', boss: true, shot: 'woc.webp',
          pitch: 'Ownership-aware cleanup for Windows 10/11 that links leftover application data to the software that created it.',
          loot: [
            'Explains every conclusion and never deletes directly: cleanup goes to a restorable quarantine, only after review.',
            'One Rust engine, two front-ends: a Tauri desktop app and a browser UI backed by a loopback-only local agent, sharing a single command dispatcher.',
            'Live scan progress over Server-Sent Events, with snapshot reconciliation after reconnects and dropped events.',
            'Its folder analyzer also runs entirely in the browser through the File System Access API.',
          ],
          tags: ['Rust', 'Tauri', 'TypeScript', 'SSE'],
          links: [{ label: 'Source', url: 'https://github.com/sheepkill15/WOC' }],
        },
        {
          id: 'memlib', name: 'Memlib', boss: true, shot: 'memlib.webp',
          pitch: 'A personal sticker and GIF library for Windows and Android that pastes right where you are already typing.',
          loot: [
            'Global Ctrl+Alt+V picker on Windows: type to search, Enter to paste back into the previously focused app.',
            'Ships as a custom Android keyboard that inserts library items or KLIPY search results into any app.',
            'Drag-and-drop and clipboard import, folders, favourites, tray mode and launch at sign-in.',
          ],
          tags: ['Flutter', 'Dart', 'Windows', 'Android'],
          links: [{ label: 'Source', url: 'https://github.com/sheepkill15/MemLib' }],
        },
        {
          id: 'tvtorrent', name: 'TVTorrent',
          pitch: 'An episode-oriented BitTorrent client for following shows, built on libtorrent and gtkmm.',
          tags: ['C++', 'gtkmm', 'libtorrent'],
          links: [{ label: 'Source', url: 'https://github.com/sheepkill15/tvtorrent' }],
        },
        {
          id: 'notebookshelf', name: 'Notebookshelf',
          pitch: 'A simple diary app for Android, built natively in Kotlin.',
          tags: ['Kotlin', 'Android'],
          links: [{ label: 'Source', url: 'https://github.com/sheepkill15/notebookshelf' }],
        },
      ],
    },
    {
      id: 'shell', n: 3, name: 'The Shell', plain: 'Operating systems & window managers', color: '#4ff0cc',
      projects: [
        {
          id: 'altdwm', name: 'AltDWM', boss: true, shot: 'altdwm.webp',
          pitch: 'An experimental Windows 11 shell and tiling window manager, proving Explorer can be replaced without touching dwm.exe.',
          loot: [
            'Event-driven tiling through SetWinEventHook and atomic DeferWindowPos batches, per monitor.',
            'Master-stack, grid, monocle and floating layouts, plus custom layouts scripted in Rhai.',
            'Handles cloaked, minimized and tool windows correctly; new windows are placed instantly while event bursts are coalesced.',
            'Declarative panels to stand in for the taskbar and desktop.',
          ],
          tags: ['Rust', 'Win32', 'DWM', 'Rhai'],
          links: [{ label: 'Source', url: 'https://github.com/sheepkill15/AltDWM' }],
        },
        {
          id: 'compander', name: 'Compander',
          pitch: 'A minimal X11 compositor written in C++, based on xcompmgr.',
          tags: ['C++', 'X11'],
          links: [{ label: 'Source', url: 'https://github.com/sheepkill15/compander' }],
        },
        {
          id: 'osd', name: 'OSD',
          pitch: 'A tiny on-screen indicator for volume-style values, icons and text, built with Rust and GTK3.',
          tags: ['Rust', 'GTK3'],
          links: [{ label: 'Source', url: 'https://github.com/sheepkill15/osd' }],
        },
        {
          id: 'trayed', name: 'Trayed',
          pitch: 'Hides any running program to the system tray.',
          tags: ['C++'],
          links: [{ label: 'Source', url: 'https://github.com/sheepkill15/trayed' }],
        },
      ],
    },
    {
      id: 'tool', n: 4, name: 'The Toolchain', plain: 'Developer tools & compilers', color: '#8dff6e',
      projects: [
        {
          id: 'projcpp', name: 'ProjCpp', boss: true, shot: 'projcpp.webp',
          pitch: 'A VS Code extension that takes beginners from zero to a running C++ program with one click.',
          loot: [
            'Published on the Visual Studio Code Marketplace.',
            'Finds an installed compiler, or downloads and configures MinGW-w64 for you.',
            'A project manager for creating and browsing C/C++ projects, plus a one-click build-and-run button.',
          ],
          tags: ['TypeScript', 'VS Code API'],
          links: [
            { label: 'Marketplace', url: 'https://marketplace.visualstudio.com/items?itemName=simonaron.projcpp' },
            { label: 'Source', url: 'https://github.com/sheepkill15/projcpp' },
          ],
        },
        {
          id: 'langron', name: 'Langron', boss: true, shot: 'langron.webp',
          pitch: 'My own programming language, written from scratch in C++ with an LLVM backend.',
          loot: [
            'Hand-written lexer and parser producing an abstract syntax tree.',
            'Type checking and code generation through LLVM, compiled for the host machine.',
            'A small runtime library alongside the compiler.',
          ],
          tags: ['C++', 'LLVM', 'Compilers'],
          links: [{ label: 'Source', url: 'https://github.com/sheepkill15/langron' }],
        },
        {
          id: 'cypresshelper', name: 'Cypress Helper',
          pitch: 'A VS Code extension for Cypress tests: code lenses to fold blocks and toggle .only / .skip, plus diagnostics for stray .only calls.',
          tags: ['TypeScript', 'VS Code API'],
          links: [{ label: 'Source', url: 'https://gitlab.com/sheepkill15/cypress-helper' }],
        },
      ],
    },
    {
      id: 'gpu', n: 5, name: 'The GPU', plain: 'Graphics & simulation', color: '#ff6ad5',
      projects: [
        {
          id: 'slimesim', name: 'Slime Sim',
          pitch: 'A slime-mould simulation running on GPU shaders, with live ImGui controls.',
          tags: ['C++', 'OpenGL', 'GLSL', 'ImGui'],
          links: [{ label: 'Source', url: 'https://github.com/sheepkill15/slimesim' }],
        },
        {
          id: 'fluidsim', name: 'Fluid Sim',
          pitch: 'A real-time fluid simulation written with OpenGL shaders.',
          tags: ['C', 'OpenGL', 'GLSL'],
          links: [{ label: 'Source', url: 'https://github.com/sheepkill15/fluidsim' }],
        },
        {
          id: 'doomcopy', name: 'Doom Copy',
          pitch: 'A Doom-inspired game engine experiment in C++.',
          tags: ['C++', 'Game engine'],
          links: [{ label: 'Source', url: 'https://github.com/sheepkill15/doomcopy' }],
        },
      ],
    },
    {
      id: 'metal', n: 6, name: 'The Metal', plain: 'Embedded & hardware', color: '#ff9147',
      projects: [
        {
          id: 'piyano', name: 'Piyano', boss: true, shot: 'piyano.webp',
          pitch: 'ESP32 firmware that turns any USB MIDI keyboard into a standalone synthesizer, built to see how cheaply a playable instrument can be made.',
          loot: [
            'Acts as a USB MIDI host and renders stereo audio over I²S to a DAC.',
            'Polyphonic software synth with subtractive and FM patches, an optional resonator and transient exciter, and a drum-kit mode.',
            'The real-time audio task is pinned to its own core under FreeRTOS, with MIDI handled separately.',
            'Presets, sustain-pedal semantics, pitch bend and MIDI CCs mapped to live parameters.',
          ],
          tags: ['C++17', 'ESP-IDF', 'FreeRTOS', 'DSP'],
          links: [{ label: 'Source', url: 'https://github.com/sheepkill15/piyano' }],
        },
      ],
    },
    {
      id: 'bonus', n: 'B', name: 'Side Quests', plain: 'Games & other experiments', color: '#ffd34d',
      projects: [
        {
          id: 'reflect', name: 'Reflect the Spirit Within',
          pitch: 'A visual novel made with Ren’Py.',
          tags: ['Ren’Py', 'Python'],
          links: [{ label: 'Source', url: 'https://github.com/sheepkill15/Reflect_The_Spirit_Within' }],
        },
        {
          id: 'roleplay', name: 'Roleplay Tabletop',
          pitch: 'A web app for running tabletop roleplaying sessions.',
          tags: ['C#', 'Blazor'],
          links: [{ label: 'Source', url: 'https://gitlab.com/sheepkill15/roleplay-tabletop' }],
        },
        {
          id: 'unity', name: 'Unity projects',
          pitch: 'A collection of small games built in Unity.',
          tags: ['C#', 'Unity'],
          links: [{ label: 'Source', url: 'https://github.com/sheepkill15/unity-projects' }],
        },
        {
          id: 'pixeljump', name: 'Pixel Jump',
          pitch: 'A small arcade game written in Java.',
          tags: ['Java'],
          links: [{ label: 'Source', url: 'https://github.com/sheepkill15/pixel-jump' }],
        },
      ],
    },
  ],
};
