import { toast } from "sonner"

export const toastError = (error) => {
        if(error.response){
            const response = error.response
            const data = response.data
            toast.error(data.message)
        } else {
            return null
        }
}

export const toastSuccess = (data) => {
    if(data){
        toast.success(data.message)
    } else {
        return null
    }
}