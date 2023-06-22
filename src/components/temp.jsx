<div class="space-y-12">
<form>
  <div class="border-b border-gray-900/10 pb-12">
    <h2 class="text-base font-semibold leading-7 text-gray-900">
      Tasks
    </h2>

    <div class="relative inline-block text-left">
    <div>
      <button type="button" class="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50" id="menu-button" aria-expanded="true" aria-haspopup="true">
        Options
        <svg class="-mr-1 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>
    </div>
    <p class="mt-1 text-sm leading-6 text-gray-600">{tasks[0]}</p>

    <div class="col-span-full">
      <label
        for="about"
        class="block text-sm font-medium leading-6 text-gray-900"
      >
        Input
      </label>
      <div class="mt-2">
        <textarea
          id="about"
          name="about"
          rows="3"
          class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        ></textarea>
      </div>
      <p class="mt-3 text-sm leading-6 text-gray-600">
        {text}
      </p>
    </div>
  </div>
</form>
</div>