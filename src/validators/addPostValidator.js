const addPostValidator = ({title, category, description}) => {
    const errors = {
        title: "",
        category: "",
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


    return errors;
};

export default addPostValidator;