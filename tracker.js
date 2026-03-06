

const trackerItems = document.getElementById("tracker-items");

// Priority → DaisyUI color
const getPriorityColor = (priority) => {
  const p = priority?.toLowerCase();
  if (p === "high") return "error"; // red
  if (p === "medium") return "warning"; // yellow
  return "success"; // green
};

// Render issues
const renderIssues = (data) => {
  if (!trackerItems) return;

  if (!data.length) {
    trackerItems.innerHTML = `<p class="text-center text-gray-500">No issues found</p>`;
    return;
  }

  const cards = data
    .map((item) => {
      const {
        id,
        status,
        title,
        description,
        priority,
        author,
        createdAt,
        labels,
      } = item;
      const color = getPriorityColor(priority);

      return `
        <div class="p-4 shadow-md rounded-md border-t-3 border-${color}">
          <div class="flex py-3 flex-wrap items-center justify-between">
            <img
              class="w-10 h-10 cursor-pointer"
              src="${
                status === "open"
                  ? "./assets/Open-Status.png"
                  : status === "closed"
                    ? "./assets/Closed-Status.png"
                    : "not status"
              }"
              alt="${status}"
            />
            <button class="btn btn-sm bg-${color}/30 text-${color} rounded-full border border-${color}">
              ${priority}
            </button>
          </div>

          <h3 class="text-2xl font-semibold mt-2">${title}</h3>
          <p class="text-gray-400 mt-2 mb-4">${description}</p>

          <div class="flex flex-wrap gap-2 mb-2">
            ${labels
              .map(
                (label) =>
                  `<span class="badge bg-gray-100 text-gray-700 rounded-full border border-gray-300">${label}</span>`,
              )
              .join("")}
          </div>

          <hr class="my-4 text-gray-300" />

          <div class="flex flex-col gap-1 text-gray-400 text-sm">
            <p>#${id} by ${author}</p>
            <p>${new Date(createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      `;
    })
    .join("");

  trackerItems.innerHTML = cards;
};

// Fetch API
const trackerFetchData = async () => {
  try {
    const response = await fetch(
      "https://phi-lab-server.vercel.app/api/v1/lab/issues",
    );
    if (!response.ok) throw new Error("Failed to fetch issues");

    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error("Error fetching tracking data:", error);
    return [];
  }
};

// Initialize tracker
const initTracker = async () => {
  trackerItems.innerHTML =
    '<p class="text-center text-gray-500">Loading issues...</p>';

  const data = await trackerFetchData();
  renderIssues(data);
};

initTracker();
