let REPOS = [];
// const reposApi = 'https://api.github.com/users/TheSrinathKamath/repos';
const reposApi = 'assets/data/repos.json';
const includeHTML = () => {
    var z, i, elmnt, file, xhttp;
    z = document.getElementsByTagName("*");
    for (i = 0; i < z.length; i++) {
        elmnt = z[i];
        file = elmnt.getAttribute("w3-include-html");
        if (file) {
            xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4) {
                    if (this.status == 200) { elmnt.innerHTML = this.responseText; }
                    if (this.status == 404) { elmnt.innerHTML = "Page not found."; }
                    elmnt.removeAttribute("w3-include-html");
                    includeHTML();
                }
            }
            xhttp.open("GET", file, true);
            xhttp.send();
            return;
        }
    }
}
const autoplay = () => {
    $('.carousel').carousel('next');
    setTimeout(autoplay, 4500);
}

const getRepos = async () => {
    let response = await fetch(reposApi, {
        headers: {
            Authorization: "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"
        }
    });
    const data = await response.json();
    REPOS = data.map((repo) => {
        return {
            id: repo.id,
            name: repo.name,
            description: repo.description,
            url: repo.html_url,
            forks: repo.forks,
            forkUrl: repo.forks_url,
            stargazersCount: repo.stargazers_count,
            watchersCount: repo.watchers_count,
            topics: repo.topics,
            languagesUrl: repo.languages_url,
            cloneUrl: repo.clone_url,
            license: repo.license,
            visibility: repo.visibility,
            watchers: repo.watchers
        }
    });
    return REPOS;
}

const filterRepos = (id) => {
    try {
        const filteredRepos = REPOS.filter(repo => { return repo.topics.includes(id) });
        return filteredRepos;
    } catch (error) {
        console.log(error);
        return null;
    }
}
const renderRepoCardsHTML = (repo) => {
    const getLanguageIconClass = (language) => {
        const languageIconClassMap = [
            { name: 'angular', class: ['fa-brands', 'fa-angular'] },
            { name: 'css', class: ['fa-brands', 'fa-css3-alt'] },
            { name: 'html', class: ['fa-brands', 'fa-html5'] },
            { name: 'nodejs', class: ['fa-brands', 'fa-node-js'] },
            { name: 'ionic', class: ['fa-solid fa-atom'] },
            { name: 'js', class: ['fa-brands', 'fa-js'] },
            { name: 'crypto', class: ['fa-brands', 'fa-bitcoin'] },
            { name: 'nft-marketplace', class: ['fa-solid', 'fa-coins'] },
            { name: 'ejs', class: ['fa-brands', 'fa-js-square'] },
            { name: 'ssr', class: ['fa-solid', 'fa-server'] },
        ];

        const languageMapClass = languageIconClassMap.find(languageMap => { return languageMap.name.toLowerCase() === language.toLowerCase() })?.class || '_';
        const languageBadge = document.createElement('i');
        languageBadge.classList.add(...languageMapClass);

        return languageBadge;
    };
    const card = document.createElement('div');
    card.classList.add('card', 'border-gradient', 'border-gradient-purple', 'p-1');

    const cardHeader = document.createElement('div');
    cardHeader.classList.add('card-header');

    const cardHeaderLinks = document.createElement('div');
    cardHeaderLinks.classList.add('links');

    const repoLink = document.createElement('a');
    repoLink.href = repo.url;
    repoLink.target = '_blank';
    repoLink.innerHTML = '<i class="fa-brands fa-github"></i>';

    const forkLink = document.createElement('a');
    forkLink.href = repo.forkUrl;
    forkLink.target = '_blank';
    forkLink.innerHTML = '<i class="fa-solid fa-code-fork"></i>';

    const cloneLink = document.createElement('a');
    cloneLink.addEventListener("click", () => copyToClipboard(repo.cloneUrl, `tooltip-${repo.id}`));
    cloneLink.addEventListener("onmouseout", resetToolTipOnMouseOut);
    cloneLink.innerHTML = '<i class="fa-solid fa-copy"></i>';

    const tooltip = document.createElement('span');
    tooltip.classList.add('tooltiptext');
    tooltip.id = `tooltip-${repo.id}`;
    tooltip.innerText = 'Clone';

    const cloneContainer = document.createElement('div');
    cloneContainer.classList.add('tooltip');
    cloneContainer.append(cloneLink, tooltip);

    cardHeaderLinks.append(repoLink, forkLink, cloneContainer);

    const cardTitle = document.createElement('h6');
    cardTitle.innerText = repo.name;

    cardHeader.append(cardTitle, cardHeaderLinks);

    const cardDescription = document.createElement('p');
    cardDescription.innerText = repo.description;

    const languageList = document.createElement('div');
    languageList.classList.add('languages');

    if (!!repo?.topics) {
        const languages = repo?.topics?.map(lan => {
            const language = document.createElement('div');
            language.classList.add('language');
            const languageBadge = document.createElement('div');
            languageBadge.appendChild(getLanguageIconClass(lan));
            const languageName = document.createElement('div');
            languageName.innerText = lan;
            language.append(languageBadge, languageName)
            return language;
        });
        languageList.append(...languages);
    }

    card.append(cardHeader, cardDescription, languageList);
    card.addEventListener("click", () => embedGist(repo.gistUrl || 'https://gist.github.com/TheSrinathKamath/f8e5ddb829107aca8c38eeb0e97017fe.js'));
    return card;

}
const renderShimmerCards = () => {
    const shimmeringCards = '<box class="shine"></box><div class="shine-wrapper"><lines class="shine"></lines><lines class="shine"></lines><lines class="shine"></lines></div><photo class="shine"></photo><br><box class="shine"></box><div class="shine-wrapper"><lines class="shine"></lines><lines class="shine"></lines><lines class="shine"></lines></div><photo class="shine"></photo>';
    return shimmeringCards;
}
const renderRepos = (id) => {
    document.getElementById('repo-list-01').innerHTML = renderShimmerCards();
    const filteredRepos = filterRepos(id);
    if (!filteredRepos) return;


    const renderedHTML = filteredRepos.map(repo => {
        return renderRepoCardsHTML(repo)
    });
    renderedHTML.forEach(html => {
        document.getElementById('repo-list-01').replaceChildren(html);
    })
}
const embedGist = (gistUrl) => {
    const gistContainer = document.getElementById('gist');
    gistContainer.innerHTML = renderShimmerCards();

    const iframe = document.createElement('iframe');
    iframe.setAttribute("style", "min-width: 200px; width: 100%; height: 500px;");
    iframe.setAttribute("scrolling", "no");
    iframe.setAttribute("frameborder", 0);
    iframe.setAttribute("allowtransparency", "true");
    iframe.setAttribute("seamless", "seamless");
    iframe.srcdoc = `<html><body><style type="text/css">.gist .gist-data { height: 400px; }</style><script src="${gistUrl}"></script></body></html>`

    gistContainer.replaceChildren(iframe);
}