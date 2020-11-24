document.addEventListener('DOMContentLoaded', function () {
  var urlParams = new URLSearchParams(window.location.search);
  // var isFromSaved = urlParams.get('saved');
  const id = urlParams.get('id');
  var save = document.getElementById('save');
  var unsave = document.getElementById('unsave');

  let item;
  getFavoriteStatus(id).then((favorite) => {
    if (favorite) {
      // Hide fab jika dimuat dari indexed db
      save.style.display = 'none';
      unsave.style.display = 'block';

      // ambil artikel lalu tampilkan
      item = getSavedTeamDetails();
      console.log(item);
    } else {
      save.style.display = 'block';
      unsave.style.display = 'none';
      item = getTeamDetails();
      console.log(item);
    }
  });

  save.onclick = function () {
    console.log('Tombol FAB di klik.');
    item.then(function (team) {
      saveForLater(team);
      save.style.display = 'none';
      unsave.style.display = 'block';
    });
  };
  unsave.onclick = function () {
    console.log('Tombol FAB di klik.');
    item.then(function (team) {
      unsaveTeam(team);
      save.style.display = 'block';
      unsave.style.display = 'none';
    });
  };
});
