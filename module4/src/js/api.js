export const API = function () {
    this.API_URL = 'https://course.7t33n.ru/rest/v1';

    API.prototype.get = async (src) => {
        try {
            const response = await fetch(this.API_URL + src, {
                method: 'GET'
            });
            
            const rec = await response.json();
    
            return rec;
        } catch (error) { 
            return error;
        }
    }
}