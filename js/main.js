var bookmarkName = document.getElementById("bookmarkName");
var bookmarkURL = document.getElementById("bookmarkURL");
var submitBtn = document.getElementById("submitBtn");
var tabelcontent = document.getElementById("tabelcontent");
var bookmarksearch = document.getElementById("bookmarksearch");
var visitButton;
var deleteButton;
var updateButton;
var Modal = document.querySelector(".model");
var closeBtn = document.getElementById("closeBtn");
var websiteNameRegex = /^[a-zA-Z0-9_]{3,}( [a-zA-Z0-9_]{3,})*$/;
var websiteUrlRegex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}(:\d+)?(\/[a-zA-Z0-9\-_.~]*)*(\?[a-zA-Z0-9\-_.~&=]*)?(#[a-zA-Z0-9\-_.~]*)?$/;
var bookmarkers = [];
var isEditing = false;
var currentIndex = null;

const AddBookmarks = () => {
  var bookmark = {
    name: capitalize(bookmarkName.value),
    url: bookmarkURL.value,
  };
  bookmarkers.push(bookmark);
  localStorage.setItem("bookmarkList", JSON.stringify(bookmarkers));
  bookmarksearch.value = "";
  display(bookmarkers);
  clear();
};

const UpdateBookmarks = () => {
  bookmarkers[currentIndex].name = capitalize(bookmarkName.value);
  bookmarkers[currentIndex].url = bookmarkURL.value;
  localStorage.setItem("bookmarkList", JSON.stringify(bookmarkers));
  bookmarksearch.value = "";
  display(bookmarkers);
  clear();
  submitBtn.innerHTML = "Submit";
  submitBtn.classList.remove("btn-success");
  submitBtn.classList.add("btn-submit");
  isEditing = false;
};

const clear = () => {
  bookmarkName.value = "";
  bookmarkURL.value = "";
  bookmarkName.classList.remove("is-valid");
  bookmarkURL.classList.remove("is-valid");
};

const display = (bookmarkers) => {
  var item = "";
  for (var i = 0; i < bookmarkers.length; i++) {
    item += ` <tr>
              <th scope="row">${bookmarkers[i].index ? bookmarkers[i].index : i}</th>
              <td>${bookmarkers[i].name}</td>
              <td>
                <button class="btn btn-visit" data-index="${bookmarkers[i].index ? bookmarkers[i].index : i}"><i class="fa-solid fa-eye pe-2"></i>Visit</button>
              </td>
              <td>
                <button class="btn btn-delete" data-index="${bookmarkers[i].index ? bookmarkers[i].index : i}"><i class="fa-solid fa-trash-can pe-2"></i>Delete</button>
              </td>
              <td>
                <button class="btn btn-update btn-primary" data-index="${bookmarkers[i].index ? bookmarkers[i].index : i}"><i class="fa-solid fa-trash-can pe-2"></i>Update</button>
              </td>
            </tr>`;
  }
  tabelcontent.innerHTML = item;

  visitButton = document.querySelectorAll(".btn-visit");
  if (visitButton) {
    visitButton.forEach((btn) => {
      btn.addEventListener("click", (e) => Visit(e));
    });
  }

  deleteButton = document.querySelectorAll(".btn-delete");
  if (deleteButton) {
    deleteButton.forEach((btn) => {
      btn.addEventListener("click", (e) => Delete(e));
    });
  }

  updateButton = document.querySelectorAll(".btn-update");
  if (updateButton) {
    updateButton.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        Update(e);
        scroll(0, 0);
      });
    });
  }
};

if (localStorage.getItem("bookmarkList")) {
  bookmarkers = JSON.parse(localStorage.getItem("bookmarkList"));
  display(bookmarkers);
}

const Visit = (e) => {
  var visitIndex = e.target.dataset.index;
  var httpsRegex = /^https?:\/\//;
  if (httpsRegex.test(bookmarkers[visitIndex].url)) {
    open(bookmarkers[visitIndex].url);
  } else {
    open(`https://${bookmarkers[visitIndex].url}`);
  }
};

const Delete = (e) => {
  var deleteIndex = e.target.dataset.index;
  bookmarkers.splice(deleteIndex, 1);
  localStorage.setItem("bookmarkList", JSON.stringify(bookmarkers));
  display(bookmarkers);
};

const Update = (e) => {
  var updateIndex = e.target.dataset.index;
  currentIndex = updateIndex;
  bookmarkName.value = bookmarkers[updateIndex].name;
  bookmarkURL.value = bookmarkers[updateIndex].url;
  validateInput(bookmarkName, websiteNameRegex);
  validateInput(bookmarkURL, websiteUrlRegex);
  submitBtn.innerHTML = "Update";
  submitBtn.classList.remove("btn-submit");
  submitBtn.classList.add("btn-success");
  isEditing = true;
};

const validateInput = (input, regx) => {
  if (regx.test(input.value)) {
    input.classList.add("is-valid");
    input.classList.remove("is-invalid");
  } else {
    input.classList.add("is-invalid");
    input.classList.remove("is-valid");
  }
};

const searchElement = (e) => {
  var searchWord = e.target.value.toLowerCase();
  var filteredBookmarks = bookmarkers.map((bookmark, index) => ({ ...bookmark, index })).filter((bookmark) => bookmark.name.toLowerCase().includes(searchWord));
  console.log(filteredBookmarks);

  display(filteredBookmarks);
};

const capitalize = (str) => str[0].toUpperCase() + str.slice(1);
submitBtn.addEventListener("click", () => {
  if (bookmarkName.classList.contains("is-valid") && bookmarkURL.classList.contains("is-valid")) {
    if (isEditing) {
      UpdateBookmarks();
    } else {
      AddBookmarks();
    }
  } else {
    Modal.classList.remove("d-none");
  }
});

bookmarkName.addEventListener("input", (e) => {
  validateInput(bookmarkName, websiteNameRegex);
});

bookmarkURL.addEventListener("input", () => {
  validateInput(bookmarkURL, websiteUrlRegex);
});

closeBtn.addEventListener("click", () => {
  Modal.classList.add("d-none");
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    Modal.classList.add("d-none");
  }
});

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("model")) {
    Modal.classList.add("d-none");
  }
});

bookmarksearch.addEventListener("input", (e) => {
  searchElement(e);
});
