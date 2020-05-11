const appContainer = document.querySelector('#app');
let data = {};
fetchData();

appContainer.addEventListener('click', function (e) {
    const target = e.target;
    const dataset = target.dataset;
    const parentDataset = target.parentElement && target.parentElement.dataset;
    const userID = parentDataset.userId;

    if (dataset.columnName == 'firstName') {
        const sortedList = sortByFirstName();
        renderList(sortedList);
    }

    if (dataset.columnName == 'lastName') {
        const sortedList = sortByLastName();
        renderList(sortedList);
    }

    if (userID) {
        fetchUserDesc(userID).then(userFullDesc => {
            const usersTable = getData().map(user => {
                const userListItem = renderUser(user);

                if (user.userId == userID) {
                    return userListItem + renderUserDesc(userFullDesc);
                }
                return userListItem;
            }).join("");

            appContainer.innerHTML = getTableWrap(usersTable);
        })
    }
})

function renderUser(user) {
    return `<tr data-user-id=${user.userId}><td>${user.firstName}</td><td>${user.lastName}</td></tr>`;
}

function renderUserDesc(user) {
    return (
        `<tr class="user-desc">
            <td colspan="2">${user.title} ${user.firstName} ${user.lastName};
            Login: ${user.login}; 
            Email: ${user.email}; 
            Gender: ${user.gender}; 
            Address: ${user.address}</td>
        </tr>`
    );
}

function renderList(data) {
    const tableContent = data.map(user => renderUser(user)).join("");
    appContainer.innerHTML = getTableWrap(tableContent);
}

function getTableWrap(tableContent) {
    return `<table><tr><th data-column-name="firstName">First Name</th><th data-column-name="lastName">Last Name</th></tr>${tableContent}</table>`;
}

function sortByFirstName() {
    return this.data.sort((u1, u2) => {
        if (u1.firstName < u2.firstName) return -1;
        if (u1.firstName > u2.firstName) return 1;
        return 0;
    })
}

function sortByLastName() {
    return this.data.sort((u1, u2) => {
        if (u1.lastName < u2.lastName) return -1;
        if (u1.lastName > u2.lastName) return 1;
        return 0;
    })
}

function getData() {
    return this.data;
}


function fetchData() {
    return fetch('https://hr.oat.taocloud.org/v1/users')
        .then(resp => {
            if (!resp.ok) throw Error(resp.status + ': ' + resp.statusText);
            return resp.json();
        })
        .then(data => {
            this.data = data;
            this.renderList(data);
        })
        .catch(err => console.error(err))
}

function fetchUserDesc(userId) {
    return fetch('https://hr.oat.taocloud.org/v1/user/' + userId)
        .then(resp => {
            if (!resp.ok) throw Error(resp.status + ': ' + resp.statusText);
            return resp.json();
        })
        .catch(err => console.error(err))
}
