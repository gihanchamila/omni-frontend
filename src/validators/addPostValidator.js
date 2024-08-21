const addPostValidator = ({title, category, description, file}) => {
    const errors = {
        title: "",
        category: "",
        file: "",
        description: ""
    };

    if (!title) {
        errors.title = "Title is required";
    }

    if (!description || description.trim() === "") {  // Additional check for empty or whitespace-only descriptions
        errors.description = "Description is required";
    }

    if (!category) {
        errors.category = "Category is required";
    }

    // If `file` is not mandatory, you might need to adjust this validation rule
    if (!file) {
        errors.file = "File is required";  // Remove or adjust this line if file is not always required
    }

    return errors;
};

export default addPostValidator;