const addCommentValidator = ({content}) => {
    const errors = {
        content : ""
    }

    if(!content){
        errors.content("Content is required")
    }

    return errors
}

export default addCommentValidator