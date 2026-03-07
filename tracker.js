// Elements
const allBtn = document.getElementById("all");
const openBtn = document.getElementById("open");
const closedBtn = document.getElementById("closed");
const issueCount = document.getElementById("issue-count");
const trackerItems = document.getElementById("tracker-items");
const searchInput = document.getElementById("search-input");

// Open modal with issue details
const openModal = (id) => {
  const item = issuesData.find((item) => item.id === id);
  if (!item) {
    alert("Issue not found");
    return;
  }

  const {
    status,
    title,
    description,
    priority,
    author,
    createdAt,
    labels = [],
  } = item;

  const color = getPriorityColor(priority);

  const div = document.createElement("div");

  div.innerHTML = `
    <dialog id="issue_modal" class="modal">
      <div class="modal-box">

        <div class="p-4 shadow-md rounded-md border-t-4 border-${color}">
          
          <div class="flex py-3 flex-wrap items-center justify-between">
            <img
              class="w-10 h-10"
              src="${
                status === "open"
                  ? "./assets/Open-Status.png"
                  : "./assets/Closed-Status.png"
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
            ${
              labels.length
                ? labels
                    .map(
                      (label) =>
                        `<span class="badge bg-gray-100 text-gray-700 rounded-full border border-gray-300">${label}</span>`,
                    )
                    .join("")
                : `<span class="text-gray-400 text-sm">No labels</span>`
            }
          </div>

          <hr class="my-4 text-gray-300" />

          <div class="flex flex-col gap-1 text-gray-400 text-sm">
            <p>#${id} by ${author}</p>
            <p>${
              createdAt
                ? new Date(createdAt).toLocaleDateString()
                : "Unknown date"
            }</p>
          </div>

        </div>

        <div class="modal-action">
          <form method="dialog">
            <button class="btn">Close</button>
          </form>
        </div>

      </div>
    </dialog>
  `;

  document.body.appendChild(div);

  const modal = div.querySelector("#issue_modal");

  if (modal) {
    modal.showModal();

    modal.addEventListener("close", () => {
      div.remove();
    });
  }
};

let issuesData = [];

// Priority → DaisyUI color
const getPriorityColor = (priority) => {
  const p = priority?.toLowerCase();
  if (p === "high") return "error";
  if (p === "medium") return "warning";
  return "success";
};

// Render issues
const renderIssues = (data) => {
  issueCount.textContent = data.length || 0;

  if (!data.length) {
    trackerItems.innerHTML = `<p class="text-center text-gray-500">No issues found</p>`;
    return;
  }

  trackerItems.innerHTML = data
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
      <div class="p-4 shadow-md rounded-md border-t-4 border-${color} cursor-pointer" onclick="openModal(${id})">
      
        <div class="flex py-3 flex-wrap items-center justify-between">
          <img
            class="w-10 h-10 cursor-pointer"
            src="${
              status === "open"
                ? "./assets/Open-Status.png"
                : "./assets/Closed-Status.png"
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
};

// Filter functions
const filterIssues = (status) => {
  if (status === "all") return renderIssues(issuesData);

  const filtered = issuesData.filter((item) => item.status === status);
  renderIssues(filtered);
};

// Search
searchInput.addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase();

  const filtered = issuesData.filter(
    (item) =>
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query),
  );

  renderIssues(filtered);
});

// Button events
allBtn.addEventListener("click", () => filterIssues("all"));
openBtn.addEventListener("click", () => filterIssues("open"));
closedBtn.addEventListener("click", () => filterIssues("closed"));

// Fetch API
const trackerFetchData = async () => {
  try {
    const res = await fetch(
      "https://phi-lab-server.vercel.app/api/v1/lab/issues",
    );

    if (!res.ok) throw new Error("Failed to fetch issues");

    const result = await res.json();
    issuesData = result.data || [];

    renderIssues(issuesData);
  } catch (error) {
    console.error(error);
    trackerItems.innerHTML = `<p class="text-center text-red-500">Failed to load issues</p>`;
  }
};

// Initialize
const initTracker = () => {
  trackerItems.innerHTML = `<p class="text-center text-gray-500">Loading issues...</p>`;

  trackerFetchData();
};

initTracker();
