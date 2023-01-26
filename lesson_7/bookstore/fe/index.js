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
                      <td style="width:10%">${object.isbn}</td>
                      <td style="width:20%">${object.title}</td>
                      <td style="width:45%;font-size:0.8em;">${object.description}</td>
                      <td style="width:5%;font-size:0.8em;">${object.price ? object.price : ""}</td>
                      <td style="width:5%;font-size:0.8em;">${object.quantity ? object.quantity : ""}</td>
                      <td style="width:15%"><button type="button" class="btn btn-outline-secondary" onclick="showBookEditBox(${object.isbn})">Edit</button>
                      <button type="button" class="btn btn-outline-danger" onclick="bookDelete(${object.isbn})">Del</button></td>
                  </tr>`;
          }

          document.getElementById("mytable").innerHTML = trHTML;
      } 
  }).catch(err => {
      alert(err.response.status + "\n\r" + err.response.data + "\n\r" + err.message);
  });
}

function showBookCreateBox() {
  Swal.fire({
    title: 'Create book',
    html:
      '<input id="isbn" class="swal2-input" placeholder="ISBN">' +
      '<input id="title" class="swal2-input" placeholder="Title">' +
      '<input id="description" class="swal2-input" placeholder="Description">' +
      '<input id="price" class="swal2-input" placeholder="Price">' +
      '<input id="quantity" class="swal2-input" placeholder="Quantity">',
    focusConfirm: false,
    preConfirm: () => {
      bookCreate();
    }
  })
}

async function bookCreate() {
  const book = {
    isbn: document.getElementById("isbn").value,
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    price: document.getElementById("price").value,
    quantity: document.getElementById("quantity").value
  };

  // POST http://localhost:3000/api/books
  await axios.post(`http://localhost:3000/api/books`, book
  ).then(res => {
      if (res.status === 201) {
        Swal.fire(`Successfully created new book '${res.data.title}'.`);
        loadTable();
      } 
  }).catch(err => {
      alert(err.response.status + "\n\r" + err.response.data + "\n\r" + err.message);
  });
}

async function showBookEditBox(isbn) {

  // 1. Read the book information from the server first
  await axios.get(`http://localhost:3000/api/books/${isbn}`, {}
  ).then(res => {
      if (res.status === 200) {
        // 2. Display the book information from the server
        const book = res.data;

        Swal.fire({
          title: 'Edit Book',
          html:
            `<input id="isbn" class="swal2-input" placeholder="ISBN" value="${book.isbn}" disabled>
            <input id="title" class="swal2-input" placeholder="Title" value="${book.title}">
            <input id="description" class="swal2-input" placeholder="Description" value="${book.description}">
            <input id="price" class="swal2-input" placeholder="Price" value="${book.price ? book.price : ""}">
            <input id="quantity" class="swal2-input" placeholder="Quantity" value="${book.quantity ? book.quantity : ""}">`,
          focusConfirm: false,
          preConfirm: () => { // 3. Perform the update, and call the server (call the PUT API)
            bookEdit();
          }
        })
      } 
  }).catch(err => {
    alert(err.response.status + "\n\r" + err.response.data + "\n\r" + err.message);
  });
}

async function bookEdit() {
  const book = {
    isbn: document.getElementById("isbn").value,
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    price: document.getElementById("price").value,
    quantity: document.getElementById("quantity").value
  };

  // PUT http://localhost:3000/api/books/9788532520056
  await axios.put(`http://localhost:3000/api/books/${book.isbn}`, book
  ).then(res => {
      if (res.status === 200) {
        Swal.fire(`Successfully updated book.`);
        loadTable();
      } 
  }).catch(err => {
      alert(err.response.status + "\n\r" + err.response.data + "\n\r" + err.message);
  });
}

async function bookDelete(isbn) {

  // DELETE http://localhost:3000/api/books/9788532520056
  await axios.delete(`http://localhost:3000/api/books/${isbn}`, {}
  ).then(res => {
      if (res.status === 204) {
        Swal.fire(`Successfully deleted book.`);
        loadTable();
      } 
  }).catch(err => {
      alert(err.response.status + "\n\r" + err.response.data + "\n\r" + err.message);
  });
}