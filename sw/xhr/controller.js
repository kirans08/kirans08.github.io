

class Controller {

    constructor() {

    }

    init() {

        this._initServiceWorker();
        this._initListeners();
        this._setNetwork(navigator.onLine);

    }

    _initServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('sw.js');
        }
    }

    _initListeners() {


        document.getElementById("fetch-cached")
            .addEventListener('click', (event) => {

                this._testCached();

            });

        document.getElementById("fetch-uncached")
            .addEventListener('click', (event) => {

                this._testUncached();

            });
        navigator.serviceWorker.addEventListener('message', event => {
            alert(event.data.state);
        });
        window.addEventListener('online', () => this._setNetwork(true));
        window.addEventListener('offline', () => this._setNetwork(false));

    }

    _setNetwork(status) {

        this.statusIcon = document.getElementById("status-icon");
        this.statusText = document.getElementById("status-text");

        if (status) {
            this.statusText.innerText = "Online";
            this.statusIcon.className = "online";
        }
        else {
            this.statusText.innerText = "Offline";
            this.statusIcon.className = "offline";
        }

    }

    _testCached() {

        this._fetchAndShowResult('https://ens51h5tapq2a.x.pipedream.net/');

    }

    _testUncached() {

        this._fetchAndShowResult('https://ens51h5tapq2a.x.pipedream.net/?nocache=' + Date.now());

    }

    _fetchAndShowResult(url) {

        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        fetch(url, requestOptions)
            .then(response => response.text())
            .then(result => this._showSuccess(url, result))
            .catch(error => this._showFailure(url, error));

    }

    _showSuccess(url, result) {

        alert(`
            Success
            URL: ${url},
            Result: ${result}
        `);

    }

    _showFailure(url, error) {

        alert(`
            Failure
            URL: ${url},
            Error: ${error}
        `);

    }


}

window.addEventListener('load', () => {
    controller = new Controller();
    controller.init();
})
