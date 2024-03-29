export let storedData: any;
export let menu: any;
export let user: any;
export let token: any;

try {
    storedData = localStorage.getItem('userSession');
} catch (error) {
    console.error('Error accessing localStorage');
}
let userData = undefined;
if (typeof storedData !== 'undefined' && storedData !== null) {
    try {
        userData = JSON.parse(storedData);
        user = userData?.user || null;
        menu = userData?.menu || null;
        token = userData?.token || null;
    } catch (error) {
        console.error('Error parsing JSON from localStorage');
    }
}