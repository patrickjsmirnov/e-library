'use strict';
(function(){
    class Book {

        // создание новой книги
        constructor(title, author, year, pages) {
            this.title = title;
            this.author = author;
            this.year = year;
            this.pages = pages;
        }

        get id() {
            return `${this.title}${this.author}${this.year}${this.pages}`;
        }

        // добавление книги в DOM
        show() {
            let div = document.createElement('div');
            div.className = "books_catalog__item";

            div.innerHTML = `
                        <p class="title">${this.title}</p>
                        <p class="author">${this.author}</p>
                        <i class="delete fa fa-trash"></i>
                        <i class="edit fa fa-pencil"></i>`;

            containerBooks.insertBefore(div, containerBooks.firstChild);

            div.dataset.year = `${this.year}`;
            div.dataset.pages = `${this.pages}`;
        }

        addToLocalStorage() {
            localStorage.setItem(this.id, JSON.stringify(this));
        }

        removeFromLocalStorage() {
            delete localStorage[this.id];
        }
    }

    // form
    let form = document.getElementsByClassName('add_books__form')[0];
    let fieldAddBooks = document.getElementsByClassName('add_books__form')[0].elements;
    let containerBooks = document.getElementsByClassName('books_catalog')[0];
    let currentEditableBook;

    // modal
    let modal = document.getElementsByClassName('modal')[0];
    let close = document.getElementsByClassName('modal__close')[0];
    let yes = document.getElementsByClassName('modal__yes')[0];
    let no = document.getElementsByClassName('modal__no')[0];


// загрузка книг из localStorage при обновлении страницы
    for (let i = 0; i < localStorage.length; i++) {
        let book = JSON.parse(localStorage.getItem(localStorage.key(i)));
        book = new Book(book.title, book.author, book.year, book.pages);
        book.show();
    }

// открытие модального окна
    function showModal(bookTitle) {
        let modal = document.getElementsByClassName('modal')[0];
        document.getElementsByClassName('modal__book_title')[0].innerHTML = `${bookTitle} ?`;
        modal.style.display = "block";
    }


// Очистка формы
    function clearForm() {
        fieldAddBooks.title.value = "";
        fieldAddBooks.author.value = "";
        fieldAddBooks.year.value = "";
        fieldAddBooks.pages.value = "";
        form.dataset.edit = "false";
    }

// обновление данных в localStorage
    function replaceBooksLocalStorage(book1, book2) {
        book1.removeFromLocalStorage();
        book2.addToLocalStorage();
    }


// извелечение данных о книге из каталога
    function serializeCatalogItem(container) {
        let title = container.querySelector('.title').innerHTML;
        let author = container.querySelector('.author').innerHTML;
        let year = +container.dataset.year;
        let pages = +container.dataset.pages;

        return [title, author, year, pages];
    }

// обновление данных в каталоге
    function updateCatalogItem(container, title, author, year, pages) {
        container.querySelector('.title').innerHTML = title;
        container.querySelector('.author').innerHTML = author;
        container.dataset.year = year;
        container.dataset.pages = pages;
    }

// извлечение данных из формы
    function readForm() {
        let title = fieldAddBooks.title.value.trim().replace(/\s+/g,' ');
        let author = fieldAddBooks.author.value.trim().replace(/\s+/g,' ');
        let year = +fieldAddBooks.year.value;
        let pages = +fieldAddBooks.pages.value;

        return [title, author, year, pages];
    }


// вывод сообшения об ошибке
    function showMessage(text, container) {
        if (!container.parentElement.lastElementChild.classList.contains('add_books__message')) {
            let msgElem = document.createElement('span');
            msgElem.innerHTML = text;
            msgElem.className = "add_books__message";
            container.parentElement.appendChild(msgElem);
        }
    }



// удаление сообщения об ошибке
    function removeMessage(container) {
        if (container.parentElement.lastElementChild.classList.contains('add_books__message')) {
            container.parentNode.removeChild(container.parentNode.lastChild);
        }
    }



// валидация формы
    function validate(title, author, year, pages) {
        let resultValidate = true;
        if (title == "") {
            showMessage('Введите название', fieldAddBooks.title);
            resultValidate = false;
        }

        if (author == "") {
            showMessage('Введите автора', fieldAddBooks.author);
            resultValidate = false;
        }

        if (year == "") {
            showMessage('Введите год издания', fieldAddBooks.year);
            resultValidate = false;
        }

        if (pages == "") {
            showMessage('Введите кол-во страниц', fieldAddBooks.pages);
            resultValidate = false;
        }
        return resultValidate;
    }

// заполнение формы
    function fillForm(title, author, year, pages) {
        fieldAddBooks.title.value = title;
        fieldAddBooks.author.value = author;
        fieldAddBooks.year.value = year;
        fieldAddBooks.pages.value = pages;
        fieldAddBooks.title.focus();
    }



// отлавливаем клики на документе
    document.addEventListener('click', (event) => {

        // нажатие на кнопку сохранить
        if (event.target.classList.contains('btnForm')) {

            // получили данные из формы
            let [title, author, year, pages] = readForm();

            // валидация формы
            if (!validate(title, author, year, pages)) return 0;

            // создаем новую книгу
            let newBook = new Book(title, author, year, pages);

            // если происходит редактирование
            if (form.dataset.edit == "true") {

                // сохраняем старые данные книги
                let [oldTitle, oldAuthor, oldYear, oldPages] = serializeCatalogItem(currentEditableBook);

                // обновляем данные в каталоге
                updateCatalogItem(currentEditableBook, title, author, year, pages);

                // обновляем данные в localStorage
                let oldBook = new Book(oldTitle, oldAuthor, oldYear, oldPages);
                replaceBooksLocalStorage(oldBook, newBook);

            }
            // книга новая
            else {
                // если такой книги нет
                // добавляем в localStorage и на страницу
                if (localStorage[newBook.id] == undefined) {
                    newBook.addToLocalStorage();
                    newBook.show();
                }
            }

            // очищаем форму
            clearForm();

            // закончили редактировать
            form.dataset.edit = "false";
            currentEditableBook = undefined;
        }

        // нажатие на кнопку удалить
        if (event.target.classList.contains('delete')) {

            // удалить из localStorage
            let parent = event.target.parentElement;

            let [title, author, year, pages] = serializeCatalogItem(parent);
            let idFind = `${title}${author}${year}${pages}`;

            // открыть модальное окно
            showModal(title);

            // отлавливаем клики на нем
            close.onclick = () => modal.style.display = "none";
            no.onclick = () => modal.style.display = "none";

            yes.onclick = () => {
                modal.style.display = "none";
                delete localStorage[idFind];
                parent.style.display = "none";
            };


            window.onclick = (event) => {
                if (event.target == modal) {
                    modal.style.display = "none";
                }
            }
        }

        // нажатие на кнопку редактировать
        if (event.target.classList.contains('edit')) {

            // удаляем сообщения об ошибках
            removeMessage(fieldAddBooks.title);
            removeMessage(fieldAddBooks.author);
            removeMessage(fieldAddBooks.year);
            removeMessage(fieldAddBooks.pages);

            let parent = event.target.parentElement;

            // получение данных из каталога
            let [title, author, year, pages] = serializeCatalogItem(parent);

            // заполнить форму
            fillForm(title, author, year, pages);

            // вешаем на форму атрибут edit
            form.dataset.edit = "true";
            currentEditableBook = parent;
        }
    });


// отлавливаем фокус на форме
    fieldAddBooks.title.addEventListener('focus', (event) => removeMessage(fieldAddBooks.title));
    fieldAddBooks.author.addEventListener('focus', (event) => removeMessage(fieldAddBooks.author));
    fieldAddBooks.year.addEventListener('focus', (event) => removeMessage(fieldAddBooks.year));
    fieldAddBooks.pages.addEventListener('focus', (event) => removeMessage(fieldAddBooks.pages));

})();





