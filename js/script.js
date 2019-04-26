if (location.hash.indexOf("#access_token=") === 0) {
    localStorage.token = location.hash.substring(14, 99);
    localStorage.session = Date.now() + 86400;
    location.hash = "";
    console.log(location.hash);
  }
  console.log(location.hash); 