const isEmail = (email) => {
    return String(email)
    .toLowerCase()
    .match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/) !== null;
}

const signUpValidator = ({name, email, password, confirmPassword}) => {
    const errors = {
        name : "",
        email : "",
        password : "",
        confirmPassword : ""
    }

    if(!name){
        errors.name = "Name is required"
    }

    if(!email){
        errors.email = "Email is required"
    }else if(!isEmail){
        errors.email = "Invalid email"
    }

    if (!password) {
        errors.password = "Password is required";
    } else if (password.length < 6) {
        errors.password = "Password should be at least 6 characters long";
    } else if (!/[A-Z]/.test(password)) {
        errors.password = "Password must contain at least one uppercase letter";
    } else if (!/[a-z]/.test(password)) {
        errors.password = "Password must contain at least one lowercase letter";
    } else if (!/\d/.test(password)) {
        errors.password = "Password must contain at least one number";
    } else if (!/[^A-Za-z0-9]/.test(password)) {
        errors.password = "Password must contain at least one symbol";
    }

    if (!confirmPassword) {
        errors.confirmPassword = "Confirm password is required";
    } else if (confirmPassword !== password) {
        errors.confirmPassword = "Passwords do not match";
    }

    return errors

}

export default signUpValidator