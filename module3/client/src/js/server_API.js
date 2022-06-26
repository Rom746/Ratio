export function ServerAPI () {
    this.url = 'http://localhost:3040/api/v1/';
}

ServerAPI.prototype.checkConnect = async function (url) {

}

ServerAPI.prototype.get = async function (url) {
    try {
        const response = await fetch(this.url + url, {
            method: 'GET'
        });
        
        const record = await response.json();

        return record;
    } catch (error) { 
        return error;
    }
}


ServerAPI.prototype.post = async function (url, data) {
    try {
        const response = await fetch(this.url + url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const record = await response.json();

        return record;
    } catch (error) {
        return error;
    }
} 
