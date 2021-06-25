

class UiController {

    constructor() {

    }

    init() {

        this.dataTable = document.getElementById("sw-list-table");
        this._initListeners();
        this._loadData();

    }

    _initListeners() {

        document.getElementById("fetch-sw")
        .addEventListener('click', (event) => {

            this._loadData();

        });

        document.getElementById("test-xhr")
        .addEventListener('click', (event) => {

            this._testXhr();

        });


    }

    async _loadData() {

        let workers = [];

        try {
            workers = await navigator.serviceWorker.getRegistrations();
            console.log(workers);
        }
        catch(e) {
            console.error(e);
        }

        this.dataTable.innerHTML = this._generateTable(workers);

    }

    _testXhr() {

        var requestOptions = {
          method: 'GET',
          redirect: 'follow'
        };

        fetch("https://reqres.in/api/users?page=2", requestOptions)
        .then(response => response.text())
        .then(result => alert("SUCCESS\n\n" + result))
        .catch(error => alert("ERROR\n\n" + error));

    }

    _generateTable(workers) {

        if (workers.length == 0) {

            return this.constructor.templateNoData;

        }

        return workers.filter(worker => worker && (worker.active || worker.installing))
        .reduce((result, worker, index) => {

            worker = worker.active || worker.installing;

            return result + `
                <tr>
                    <td>${index + 1}</td>
                    <td>${worker.scriptURL}</td>
                    <td>${worker.state}</td>
                </tr>`

        }, this.constructor.templateHeaders)


    }

    static get templateHeaders() {

        return `<tr>
                    <th>No</th>
                    <th>URL</th>
                    <th>State</th>
                </tr>`;

    }

    static get templateNoData() {

        return `<tr>
                    <td colspan="2" class="no-data-message">No Service Workers available</td>
                </tr>`;

    }

}

window.addEventListener('load', () => {

a = new UiController();
a.init();
})
