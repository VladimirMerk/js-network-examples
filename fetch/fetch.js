(() => {
  const resultElement = document.getElementById('result');
  const userTemplate = document.getElementById('user-card');
  const fragment = document.createDocumentFragment();

  getUsers(['atom', 'electron', 'proton']).then(users => {
    for (user of users) {
      fragment.appendChild(createUserElement(user));
    }

    resultElement.dataset.status = "done";
    resultElement.innerHTML = "";
    resultElement.appendChild(fragment);
  });

  function createUserElement(user) {
    const userElement = userTemplate.content.cloneNode(true);
    const templateElements = {
      avatar: userElement.querySelector('.avatar img'),
      id: userElement.querySelector('.info .id span'),
      login: userElement.querySelector('.info .login span'),
      name: userElement.querySelector('.info .name span'),
      email: userElement.querySelector('.info .email span'),
      error: userElement.querySelector('.info .error span')
    }

    templateElements.login.innerText = user.login || 'Not found';
    if (!user.error) {
      templateElements.id.innerText = user.info.id || 'Not found';
      templateElements.name.innerText = user.info.name || 'Not found';
      templateElements.email.innerText = user.info.email || 'Not found';
      templateElements.avatar.src = user.info.avatar_url || templateElements.avatar.src;
    } else {
      userElement.querySelector('.user-card').classList.add('error');
      templateElements.error.innerText = user.error;
    }

    return userElement;
  }

  async function getUsers(loginsArray) {
    const baseUrl = new URL('https://api.github.com/users/USERNAME');
    const loginsPromises = loginsArray.map(login => getUser(login));
    const result = await Promise.all(loginsPromises);
    return result;
  }

  function getUser(login) {
    return new Promise(resolve => {
      // const url = new URL(login, baseUrl);
      const url = login === 'electron' ? 'http://httpstat.us/500' : new URL(login, baseUrl);
      fetch(url)
        .then(response => {
          if (!response.ok) throw new Error(response.statusText)
          return response.json()
        })
        .then(info => resolve({login, info}))
        .catch(error => resolve({login, error}))
    });
  }
})();
