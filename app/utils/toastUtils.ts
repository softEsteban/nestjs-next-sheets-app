import { toast } from 'react-toastify';

export const handleSuccessfulAction = (message: string) => {
    toast.success(message);
};

export const handleInfoAction = (message: string) => {
    toast.info(message);
};

export const handleFailedAction = (message: string) => {
    toast.error(message);
};