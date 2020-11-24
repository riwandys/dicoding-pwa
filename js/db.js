var dbPromised = idb.open('premier-league', 1, (upgradeDb) => {
  var teamsObjectStore = upgradeDb.createObjectStore('teams', {
    keyPath: 'id',
  });
  teamsObjectStore.createIndex('name', 'name', {
    unique: true,
  });
});

const saveForLater = (team) => {
  dbPromised
    .then((db) => {
      var tx = db.transaction('teams', 'readwrite');
      var store = tx.objectStore('teams');

      store.add(team);
      return tx.complete;
    })
    .then(() => {
      console.log('Data berhasil di simpan.');
    });
};

const unsaveTeam = (team) => {
  dbPromised
    .then((db) => {
      var tx = db.transaction('teams', 'readwrite');
      var store = tx.objectStore('teams');

      store.delete(team.id);
      return tx.complete;
    })
    .then(() => {
      console.log('Data berhasil dihapus');
    });
};

const getAll = () => {
  return new Promise((resolve, reject) => {
    dbPromised
      .then((db) => {
        var tx = db.transaction('teams', 'readonly');
        var store = tx.objectStore('teams');
        return store.getAll();
      })
      .then((teams) => {
        resolve(teams);
      });
  });
};

const getTeamById = (id) => {
  return new Promise((resolve, reject) => {
    dbPromised
      .then((db) => {
        var tx = db.transaction('teams', 'readonly');
        var store = tx.objectStore('teams');

        return store.get(parseInt(id));
      })
      .then((team) => {
        resolve(team);
      })
      .catch((error) => console.log(error));
  });
};

const getFavoriteStatus = (id) => {
  return new Promise((resolve, reject) => {
    dbPromised
      .then((db) => {
        var tx = db.transaction('teams', 'readonly');
        var store = tx.objectStore('teams');

        return store.get(parseInt(id));
      })
      .then((team) => {
        if (team) {
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .catch((error) => console.log(error));
  });
};
