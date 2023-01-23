// READ - Read the list of books from the API
async function loadTable() {

  await axios.get('http://localhost:3000/api/books', {}
  ).then(res => {
      if (res.status === 200) {
          console.log(res.data);
          var trHTML = ''; 

          for (let object of res.data) {
              trHTML += `
                  <tr> 
                      <td style="width:10%">${object.isbn}</td>;
                      <td style="width:25%">${object.title}</td>
                      <td style="width:50%;font-size:0.8em;">${object.description}</td>
                      <td style="width:15%"><button type="button" class="btn btn-outline-secondary" onclick="showUserEditBox(${object.isbn})">Edit</button>
                      <button type="button" class="btn btn-outline-danger" onclick="userDelete(${object.isbn})">Del</button></td>
                  </tr>`;
          }

          document.getElementById("mytable").innerHTML = trHTML;
      } 
  }).catch(err => {
      alert(err.response.status + "\n\r" + err.response.data + "\n\r" + err.message);
  });
}

function showUserCreateBox() {
  Swal.fire({
    title: 'Create user',
    html:
      '<input id="id" type="hidden">' +
      '<input id="fname" class="swal2-input" placeholder="First">' +
      '<input id="lname" class="swal2-input" placeholder="Last">' +
      '<input id="username" class="swal2-input" placeholder="Username">' +
      '<input id="email" class="swal2-input" placeholder="Email">',
    focusConfirm: false,
    preConfirm: () => {
      userCreate();
    }
  })
}

function userCreate() {
  const fname = document.getElementById("fname").value;
  const lname = document.getElementById("lname").value;
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
    
  const xhttp = new XMLHttpRequest();
  xhttp.open("POST", "https://www.mecallapi.com/api/users/create");
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(JSON.stringify({ 
    "fname": fname, "lname": lname, "username": username, "email": email, 
    "avatar": "https://www.mecallapi.com/users/cat.png"
  }));
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      const objects = JSON.parse(this.responseText);
      Swal.fire(objects['message']);
      loadTable();
    }
  };
}

function showUserEditBox(id) {
  console.log(id);
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", "https://www.mecallapi.com/api/users/"+id);
  xhttp.send();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      const objects = JSON.parse(this.responseText);
      const user = objects['user'];
      console.log(user);
      Swal.fire({
        title: 'Edit User',
        html:
          '<input id="id" type="hidden" value='+user['id']+'>' +
          '<input id="fname" class="swal2-input" placeholder="First" value="'+user['fname']+'">' +
          '<input id="lname" class="swal2-input" placeholder="Last" value="'+user['lname']+'">' +
          '<input id="username" class="swal2-input" placeholder="Username" value="'+user['username']+'">' +
          '<input id="email" class="swal2-input" placeholder="Email" value="'+user['email']+'">',
        focusConfirm: false,
        preConfirm: () => {
          userEdit();
        }
      })
    }
  };
}

function userEdit() {
  const id = document.getElementById("id").value;
  const fname = document.getElementById("fname").value;
  const lname = document.getElementById("lname").value;
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
    
  const xhttp = new XMLHttpRequest();
  xhttp.open("PUT", "https://www.mecallapi.com/api/users/update");
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(JSON.stringify({ 
    "id": id, "fname": fname, "lname": lname, "username": username, "email": email, 
    "avatar": "https://www.mecallapi.com/users/cat.png"
  }));
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      const objects = JSON.parse(this.responseText);
      Swal.fire(objects['message']);
      loadTable();
    }
  };
}

function userDelete(id) {
  const xhttp = new XMLHttpRequest();
  xhttp.open("DELETE", "https://www.mecallapi.com/api/users/delete");
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(JSON.stringify({ 
    "id": id
  }));
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4) {
      const objects = JSON.parse(this.responseText);
      Swal.fire(objects['message']);
      loadTable();
    } 
  };
}