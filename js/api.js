const base_url = 'https://api.football-data.org/v2/';
const apiKey = '95238bad7c48460bb11add802fffbe53';

// Blok kode yang akan di panggil jika fetch berhasil
const status = (response) => {
  if (response.status !== 200) {
    console.log('Error : ' + response.status);
    // Method reject() akan membuat blok catch terpanggil
    return Promise.reject(new Error(response.statusText));
  } else {
    // Mengubah suatu objek menjadi Promise agar bisa "di-then-kan"
    return Promise.resolve(response);
  }
};

// Blok kode untuk memparsing json menjadi array JavaScript
const json = (response) => {
  return response.json();
};

// Blok kode untuk meng-handle kesalahan di blok catch
const error = (error) => {
  // Parameter error berasal dari Promise.reject()
  console.log('Error : ' + error);
};

const updateStandingsHTML = (data) => {
  let standingsHTML = `<table class="striped">
              <thead>
                <tr>
                  <th>Pos</th>
                  <th></th>
                  <th>Team Name</th>
                  <th>P</th>
                  <th>Pts</th>
                  <th>W</th>
                  <th>D</th>
                  <th>L</th>
                  <th>GD</th>
                </tr>
              </thead>
            <tbody>`;

  data.standings[0].table.forEach((team) => {
    standingsHTML += `
                <tr>
                  <td>${team.position}</td>
                  <td><img width="20" src="${team.team.crestUrl}"></td>
                  <td><a class="black-text" href="./teams.html?id=${team.team.id}">${team.team.name}</a></td>
                  <td>${team.playedGames}</td>
                  <td>${team.points}</td>
                  <td>${team.won}</td>
                  <td>${team.draw}</td>
                  <td>${team.lost}</td>
                  <td>${team.goalDifference}</td>
                </tr>
            `;
  });

  standingsHTML += '</tbody>';
  // Sisipkan komponen card ke dalam elemen dengan id #content
  document.getElementById('standings').innerHTML = standingsHTML;
};

// Blok kode untuk melakukan request data json
const getStandings = () => {
  if ('caches' in window) {
    caches.match(base_url + 'competitions/2021/standings').then((response) => {
      if (response) {
        response.json().then(updateStandingsHTML);
      }
    });
  }

  fetch(base_url + 'competitions/2021/standings', {
    method: 'GET', // or 'PUT'
    headers: {
      'X-Auth-Token': apiKey,
    },
  })
    .then(status)
    .then(json)
    .then(updateStandingsHTML)
    .catch(error);
};

const updateFixturesHTML = (data) => {
  let fixturesHTML = `<table class="striped centered">
              <thead>
                <tr>
                  <th></th>
                  <th>Home team</th>
                  <th>Date</th>
                  <th>Away team</th>
                  <th></th>
                </tr>
              </thead>
            <tbody>`;
  let date = '';
  let month = '';
  let year = '';
  let hour = '';
  let minute = '';
  data.matches.forEach((match) => {
    let utcDate = new Date(match.utcDate);
    date = utcDate.getDate();
    month = utcDate.getMonth();
    year = utcDate.getFullYear();
    hour = utcDate.getHours();
    minute = utcDate.getMinutes();
    if (date < 10) {
      date = '0' + date;
    }
    if (month < 10) {
      month = '0' + month;
    }
    if (hour < 10) {
      hour = '0' + hour;
    }
    if (minute < 10) {
      minute = '0' + minute;
    }
    fixturesHTML += `
                <tr>
                  <td><img width="20" src="https://crests.football-data.org/${match.homeTeam.id}.svg"></td>
                  <td>${match.homeTeam.name}</td>
                  <td>${year}-${month}-${date}, ${hour}:${minute}</td>
                  <td>${match.awayTeam.name}</td>
                  <td><img width="20" src="https://crests.football-data.org/${match.awayTeam.id}.svg"></td>
                </tr>
            `;
  });

  fixturesHTML += '</tbody>';
  // Sisipkan komponen card ke dalam elemen dengan id #content
  document.getElementById('fixtures').innerHTML = fixturesHTML;
};

const getFixtures = () => {
  if ('caches' in window) {
    caches.match(base_url + 'competitions/2021/matches').then((response) => {
      if (response) {
        response.json().then((data) => updateFixturesHTML(data));
      }
    });
  }

  fetch(base_url + 'competitions/2021/matches', {
    method: 'GET', // or 'PUT'
    headers: {
      'X-Auth-Token': apiKey,
    },
  })
    .then(status)
    .then(json)
    .then((data) => updateFixturesHTML(data))
    .catch(error);
};

const updateTeamDetailsHTML = (data) => {
  let teamHTML = `
          <h3>${data.name}</h3>
          <table>
            <tr><img src="${data.crestUrl}"/><tr>
            <tr>
              <th>Stadium</th>
              <td>${data.venue}</td>
            </tr>
            <tr>
              <th>Founded</th>
              <td>${data.founded}</td>
            </tr>
            <tr>
              <th>Address</th>
              <td>${data.address}</td>
            </tr>
            <tr>
              <th>Phone number</th>
              <td>${data.phone}</td>
            </tr>
            <tr>
              <th>Website</th>
              <td>${data.website}</td>
            </tr>
        `;
  teamHTML += '<tr><th>Active Competitions</th><td><ul>';
  data.activeCompetitions.forEach((item) => {
    teamHTML += `<li>${item.name}</li>`;
  });
  teamHTML += '</ul></td></tr></table><h5>Squad</h5><table>';
  data.squad.forEach((item) => {
    teamHTML += `
    <tr>
      <td>${item.name}</td>
      <td>${item.position}</td>
      <td>${item.nationality}</td>
    </tr>`;
  });
  teamHTML += '</table>';
  // Sisipkan komponen card ke dalam elemen dengan id #content
  document.getElementById('body-content').innerHTML = teamHTML;
};

const getTeamDetails = () => {
  return new Promise((resolve, reject) => {
    // Ambil nilai query parameter (?id=)
    const urlParams = new URLSearchParams(window.location.search);
    const idParam = urlParams.get('id');

    if ('caches' in window) {
      caches.match(base_url + 'teams/' + idParam).then((response) => {
        if (response) {
          response.json().then((data) => {
            updateTeamDetailsHTML(data);
            // Kirim objek data hasil parsing json agar bisa disimpan ke indexed db
            resolve(data);
          });
        }
      });
    }

    fetch(base_url + 'teams/' + idParam, {
      method: 'GET', // or 'PUT'
      headers: {
        'X-Auth-Token': apiKey,
      },
    })
      .then(status)
      .then(json)
      .then((data) => {
        updateTeamDetailsHTML(data);
        // Kirim objek data hasil parsing json agar bisa disimpan ke indexed db
        resolve(data);
      });
  });
};

const getSavedTeamDetails = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const idParam = urlParams.get('id');
  return new Promise((resolve, reject) => {
    getTeamById(idParam).then((data) => {
      updateTeamDetailsHTML(data);
      resolve(data);
    });
  });
};

const getSavedTeams = () => {
  getAll().then((teams) => {
    // Menyusun komponen card artikel secara dinamis
    let standingsHTML = '';
    teams.forEach((team) => {
      standingsHTML += `
      <div class="col s12 m6 l4">
        <div class="card horizontal hoverable">
          <div class="card-image">
            <img width="20" src="${team.crestUrl}">
          </div>
          <div class="card-stacked">
            <div class="card-content">
              <p>${team.name}</p>
            </div>
            <div class="card-action">
              <a href="./teams.html?id=${team.id}&saved=true">Detail</a>
            </div>
          </div>
        </div>
      </div>
      `;
    });
    // Sisipkan komponen card ke dalam elemen dengan id #content
    document.getElementById('teams').innerHTML = standingsHTML;
  });
};
