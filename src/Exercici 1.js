document.getElementById('searchForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const username = document.getElementById('usernameInput').value.trim();
    if (!username) return;

    // Referències als elements del DOM
    const spinner = document.getElementById('loadingSpinner');
    const errorMsg = document.getElementById('errorMessage');
    const userCard = document.getElementById('userCard');
    const reposCard = document.getElementById('reposCard');
    const reposList = document.getElementById('reposList');

    // Amagar resultats posteriors i activar indicador de càrrega
    errorMsg.classList.add('d-none');
    userCard.classList.add('d-none');
    reposCard.classList.add('d-none');
    spinner.classList.remove('d-none');

    try {
        // 1. Obtenir informació del perfil d'usuari
        const userResponse = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`);

        if (!userResponse.ok) {
            throw new Error('Usuari no trobat');
        }

        const user = await userResponse.json();

        // 2. Obtenir els repositoris de l'usuari
        const reposResponse = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated`);
        const repos = await reposResponse.json();

        // Omplir dades del perfil
        document.getElementById('userAvatar').src = user.avatar_url;
        document.getElementById('userName').textContent = user.name || user.login;
        document.getElementById('userHandle').textContent = `@${user.login}`;
        document.getElementById('userFollowers').textContent = user.followers.toLocaleString();

        // Netejar i omplir la taula de repositoris
        reposList.innerHTML = '';

        if (repos.length === 0) {
            reposList.innerHTML = '<tr><td colspan="3" class="text-center text-muted py-3">Aquest usuari no té repositoris públics.</td></tr>';
        } else {
            repos.forEach(repo => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
          <td>
            <a href="${repo.html_url}" target="_blank" class="text-success fw-bold text-decoration-none">
              ${repo.name}
            </a>
          </td>
          <td class="small text-secondary">${repo.description || '<em>Sense descripció</em>'}</td>
          <td class="text-center fw-bold">${repo.stargazers_count}</td>
        `;
                reposList.appendChild(tr);
            });
        }

        // Mostrar les seccions amb informació
        userCard.classList.remove('d-none');
        reposCard.classList.remove('d-none');

    } catch (error) {
        // Mostrar missatge d'error si l'usuari no existeix
        errorMsg.classList.remove('d-none');
    } finally {
        // Amagar l'spinner de càrrega
        spinner.classList.add('d-none');
    }
});