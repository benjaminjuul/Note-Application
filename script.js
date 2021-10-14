const list = document.querySelector('ul');
const searchBar = document.querySelector('form.search-bar');
const form = document.querySelector('form.add-books');
const checkbox = document.querySelector('input[type="checkbox"]');

const popup = document.querySelector('.popup-wrapper');
const popupForm = document.querySelector('.edit-add-books');
const close = document.querySelector('div.popup-close');


const addRecipe = (recipe, id) => {
    let time = recipe.created_at.toDate();
    let html =
    `<li data-id="${id}">
    <div name="title">${recipe.title}</div>
    <div name="body">${recipe.body}</div>
    <input id="check_${id}" type="checkbox" active="${recipe.important}" name="important" data-id="${id}" data-click="${recipe.important}">
    <div name="time">${time}</div>
    <button id="applcationDelete" class="btn btn-danger btn-sm my-2" value="delete">delete</button>
    <button id="applcationEdit" class="btn btn-warning btn-sm my-2" value="edit">edit</button>
    </li>`;

    list.innerHTML += html;

}

//get documents
//db.collection('recipes').get().then((snapshot) => {
    //when we have the data
    //snapshot.docs.forEach(doc => {
        //addRecipe(doc.data(), doc.id);
    //});
//}).catch(err => {
    //console.log(err);
//});

//get documents - real time listener

const deleteRecipe = (id) => {
   const recipes = document.querySelectorAll('li');
   recipes.forEach(recipe => {
       if(recipe.getAttribute('data-id') === id){
       recipe.remove();
       }
   });
}

db.collection('recipes').onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
        const doc = change.doc;
        if(change.type === 'added'){
            addRecipe(doc.data(), doc.id);
        } else if(change.type === 'removed'){
           deleteRecipe(doc.id);
        }
    })
});

//add documents

form.addEventListener('submit', e => {
    e.preventDefault();
    const now = new Date();
    const recipe = {
        title: form.title.value,
        body: form.body.value,
        important: form.important.checked,
        created_at: firebase.firestore.Timestamp.fromDate(now)
        //firestore method fordi timestamp er speciel
    };
    db.collection('recipes').add(recipe).then(() => { //indsætter object recipe
        console.log('recipe added');
    }).catch(err => {
       console.log(err);
    });
});

//deleting data

list.addEventListener('click', e => {
    if(e.target.value === 'delete'){ //if we click on a button inside lsit
       const id = e.target.parentElement.getAttribute('data-id'); //vælger det unikke data-id hvor hver
       db.collection('recipes').doc(id).delete().then(() => {
           console.log('recipe deleted');
       });
    }
});

//edit data

list.addEventListener('click', e => {
    console.log('edited')
    const id = e.target.parentElement.getAttribute('data-id'); 
    console.log(id);
    if(e.target.value === 'edit'){ //if we click on a button inside lsit
       //vælger det unikke data-id hvor hver
       db.collection('recipes').doc(id).get().then(snapshot => {
       popup.style.display = 'block';
       popupForm.title.value = snapshot.data().title,
       popupForm.body.value = snapshot.data().body,
       popupForm.important.value = snapshot.data().important
       popupForm.fireid.value = id
       }

    )
    }
});

//edit data - save changes

popupForm.addEventListener('submit', e => { 
    e.preventDefault();
    let id = popupForm.fireid.value //opmærksom
    console.log(e.target.tagName);
    if(e.target.tagName === 'FORM') { 
    
    db.collection('recipes').doc(id).update({
        title: popupForm.title.value,
        body: popupForm.body.value,
        important: popupForm.important.value
    
    });
    popup.classList.remove();


};
});



list.addEventListener('click', e => {
    if(e.target.id === 'edit'){ //if we click on a button inside lsit
       const id = e.target.parentElement.getAttribute('data-id'); //vælger det unikke data-id hvor hver
       db.collection('recipes').doc(id).delete().then(() => {
           console.log('recipe edited');
       });
    }
});

//search bar

searchBar.addEventListener('keyup', function (e){
    const term = e.target.value.toLowerCase();
    const books = list.getElementsByTagName('li');
    Array.from(books).forEach(function(book){
        const title = book.firstElementChild.textContent;
        if(title.toLowerCase().indexOf(term) != -1){
            book.style.display = 'block';
        } else {
            book.style.display = 'none';
        }
    })
})

//checkbox - important notes

checkbox.addEventListener('change', e => {
if(checkbox.checked){
    list.style.display = 'none';
}
else {
    list.style.display = 'block';
}

});


//if(checkbox.checked == true){
    //list.style.display = 'block';
//} else {
     //list.style.display = 'none'
//}