export default function authHeader() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.token) {
        return { Authorization: `${user.type || 'Bearer'} ${user.token}` };
    } else {
        return {};
    }
}
