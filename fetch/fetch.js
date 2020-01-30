(() => {
    const resultElement = document.getElementById('result');
    const userTemplate = document.getElementById('user-card');
    const fragment = document.createDocumentFragment();
    getUsers(['atom', 'electron', 'proton']).then(result => {
        for (user of result) {
            const userElement = userTemplate.content.cloneNode(true);
            userElement.querySelector('.info .login span').innerText = user.login || 'Not found';
            
            if (! user.error) {
                const avatarElement = userElement.querySelector('.avatar img');
                if (user.data.hasOwnProperty('avatar_url')) {
                    avatarElement.src = user.data.avatar_url;
                }
                userElement.querySelector('.info .id span').innerText = user.data.id || 'Not found';
                userElement.querySelector('.info .name span').innerText = user.data.name || 'Not found';
                userElement.querySelector('.info .email span').innerText = user.data.email || 'Not found';
            } else {
                userElement.querySelector('.user-card').classList.add('error');
                userElement.querySelector('.info .error span').innerText = user.error;
            }
            fragment.appendChild(userElement)
        }
        resultElement.dataset.status = "done";
        resultElement.innerHTML = "";
        resultElement.appendChild(fragment);
    });
    
    async function getUsers(logins) {
        const baseUrl = new URL('https://api.github.com/users/USERNAME');
        function getUser(login) {
            return new Promise(resolve => {
                const url = new URL(login, baseUrl);
                // const url = login === 'electron' ? 'http://httpstat.us/500' : new URL(login, baseUrl);
                fetch(url).then(response => {
                    if (response.ok) {
                        response.json().then(result => {
                            resolve({login: login, data: result});
                        }).catch(err => {
                            throw err;
                        });
                    } else {
                        throw Error(response.statusText);
                    }
                }).catch(err => {
                    resolve({login: login, error: err});
                });
            });
        }
        logins = logins.map(login => {
            return getUser(login);
        });
        const result = await Promise.all(logins);
        return result;
    }
})();