const addPostValidator = ({ title, description, category, file }, step) => {
    const errors = {
        title: "",
        description: "",
        category: ""
    };

    if (step === 1) {
        if (!title) {
            errors.title = "title is required";
        }
    }

    if (step === 2) {
        if (!description || description.trim() === "") {
            errors.description = "Description is required";
        }
        if (!category) {
            errors.category = "category is required";
        }
    }

    return errors;
};

export default addPostValidator;
