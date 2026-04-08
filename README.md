# TakeUForward Calendar Tracker

This project was built as part of the first round of an internship task.

The initial task was to recreate a calendar UI from a reference image. I used that as the base, and then expanded it into a more complete learning tracker with notes, streaks, module-based progress, export support, and responsive interactions.

## What this project is

At its core, this is a calendar-driven study tracker for three modules:

- `DSA`
- `LLD`
- `SQL`

Instead of treating the calendar as a static design, I treated it like a real product surface where a user can:

- track daily progress
- maintain separate learning streaks
- write notes for specific days
- keep monthly notes
- export their current progress as an image

## Main features

### Module-based tracking

The tracker supports three separate modules: `DSA`, `LLD`, and `SQL`.

Each module keeps its own:

- active days
- streaks
- day notes
- monthly notes
- color theme

So if a user marks progress in `DSA`, it affects only `DSA` and not `LLD` or `SQL`.

### Calendar navigation

The header allows the user to:

- move to the previous month
- move to the next month
- jump back to today
- open a year picker

The year picker is designed to behave properly on both desktop and mobile.

### Interactive day cells

Each day in the calendar can show:

- today state
- note indicator
- streak indicator
- holiday marker
- selected range state

This makes the grid much more useful than a standard calendar layout.

### Date range selection

Users can select a range of dates directly from the calendar.

That selection is then used to:

- highlight the chosen period
- show the range summary
- surface notes that belong to those selected days

### Day notes

Right-clicking a day opens a note popup where the user can:

- write a note
- save it
- delete it

This makes the calendar useful not just for tracking activity, but also for recording what was actually done on a given day.

### Monthly notes

Along with day notes, the project also supports monthly notes.

This is useful for:

- monthly goals
- learning plans
- reflections
- reminders

### Streak tracking

Each module has its own streak calculation based on active learning days.

There is also a `Mark Today` action which updates the streak for the currently selected module only.

When a streak milestone is reached, the app gives visual feedback using confetti.

### Export / share

The current calendar state can be exported as an image.

That exported image includes:

- current module
- selected month
- marked active days
- streak state
- selected range

This makes the tracker something a user can actually share.

### Theme and visual identity

The project supports:

- light mode
- dark mode
- module-based visual themes
- month-based hero images

The month hero images are taken from local assets inside the project rather than external placeholder URLs.

## USP

What makes this project different from a basic UI replication:

- it starts from a static design reference, but turns it into a functional product
- it treats each learning module as its own tracking space
- it combines calendar interaction, note-taking, streak logic, and export into one flow
- it includes responsive handling for overlays and interactions, not just page layout
- it was refactored into a cleaner structure instead of staying as a quick demo build

## Tech stack

- `React`
- `Vite`
- `Tailwind CSS`
- `Framer Motion`
- `date-fns`
- `lucide-react`

## Project structure

```text
src/
  components/
    Calendar/
    Export/
    Modules/
    Notes/
    Streak/
    ui/
  context/
  data/
  utils/
```

### Folder overview

- `components/Calendar`
  main calendar shell, header, grid, day cells, overlays
- `components/Notes`
  monthly notes, range notes, day note popup
- `components/Export`
  export button and export rendering logic
- `components/Modules`
  module switching UI
- `components/Streak`
  streak-related UI actions
- `components/ui`
  shared UI elements
- `context`
  shared app state, helpers, and storage logic
- `data`
  static module configuration and month image mapping
- `utils`
  shared date helpers and constants

## State management

Shared state is managed through a calendar context.

It handles:

- current month
- active module
- dark mode
- selected date range
- day notes
- monthly notes
- active days
- streak state
- popup state
- confetti state

To keep the code easier to maintain, the logic is split across:

- `CalendarContext.jsx`
- `calendarHelpers.js`
- `calendarStorage.js`
- `useCalendar.js`

## Persistence

The app uses `localStorage` to preserve:

- selected module
- dark mode preference
- day notes
- monthly notes
- active learning days

So progress remains available after refresh.

## Responsive behavior

Special attention was given to smaller screens.

Some of the mobile-specific improvements include:

- responsive top action layout
- mobile-friendly note popup
- mobile-safe year picker
- better handling of overlays using viewport-safe positioning

## Running the project

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

## Final note

This project was built to show more than just the ability to match a design visually.

The focus was also on:

- making the interface interactive
- organizing the code properly
- thinking about real usage
- making the experience work across devices

So while the starting point was a calendar image, the final result is a usable learning tracker with a stronger product feel.
