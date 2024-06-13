const fName = document.querySelector(`#fname`);
const lName = document.querySelector(`#lname`);
const email = document.querySelector(`#email`);
const signUp = document.querySelector(`#signup`);

signUp.addEventListener("click", () => {
  if (fName === "") {
    ferror.textContent = "You need to enter your first name";
  } else if (lName === "") {
    lerror.textContent = "You need to enter your last name";
  } else if (email === "") {
    merror.textContent = "You need to enter your email";
  }
});
