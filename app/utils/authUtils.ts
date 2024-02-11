export let storedData: any;
export let menu: any;
export let user: any;

try {
    storedData = localStorage.getItem('userSession');
} catch (error) {
    console.error('Error accessing localStorage:', error);
}
let userData = undefined;
if (typeof storedData !== 'undefined' && storedData !== null) {
    try {
        userData = JSON.parse(storedData);
        user = userData?.user || null;
        menu = userData?.menu || null;
    } catch (error) {
        console.error('Error parsing JSON from localStorage:', error);
    }
}