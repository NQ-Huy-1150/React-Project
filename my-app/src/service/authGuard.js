import { redirect } from 'react-router-dom';

export const requireAuth = () => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user?.token) {
        throw redirect('/');
    }

    return user;
};
