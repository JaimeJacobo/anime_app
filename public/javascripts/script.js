const spinner = document.getElementsByClassName("search-spinner")[0];

//Add load spinner when click on search
const searchButtons = document.getElementsByClassName("search-form__btn");

const searchButtonsList = [...searchButtons];

searchButtonsList.forEach((button) => {
  button.addEventListener("click", () => {
    spinner.style.display = "block";
  });
});

//Add load spinner when click on homepage or all anime tab
const menuOptions = document.getElementsByClassName("menu-options");

const menuOptionsList = [...menuOptions];

menuOptionsList.forEach((button) => {
  button.addEventListener("click", () => {
    spinner.style.display = "block";
  });
});

//Add fade out to error message after 5 seconds

[...document.getElementsByClassName("errorMsg")].forEach((message) => {
  setTimeout(() => {
    message.classList.add("fadeOut");
  }, 5000);
});
