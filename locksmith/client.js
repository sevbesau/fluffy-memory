(async () => {
  const rawResponse = await fetch('http://localhost:5001/login', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "email": "seppe@siliconminds.be",
      "password": "1234"
    })
  });
  const content = await rawResponse.json();

  console.log(content);
})();


const client = {
  login: function () {
    fetch('http://localhost:5001/login', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "email": "seppe@siliconminds.be",
        "password": "1234"
      })
    }).then(res => {
      this.access_token = res.headers.get('authorization');
    })
  },
  me: function () {
    fetch('http://localhost:5001/me', {
      credentials: 'omit',
      headers: {
        'Accept': 'application/json',
        'Authorization': this.access_token
      }
    })
      .then(res => res.json())
      .then(json => {
        console.log(json);
        if (json.success) {
          console.log('access token:', json)
        } else {
          fetch('http://localhost:5001/me', { headers: { 'Accept': 'application/json' } })
            .then(res => {
              this.access_token = res.headers.get('authorization');
              return res.json();
            })
            .then(json => {
              if (json.success) console.log('refresh token', json)
            })
        }
      })
  }
}
