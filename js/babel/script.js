'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
    var Book = function () {

        // создание новой книги
        function Book(title, author, year, pages) {
            _classCallCheck(this, Book);

            this.title = title;
            this.author = author;
            this.year = year;
            this.pages = pages;
        }

        _createClass(Book, [{
            key: 'show',


            // добавление книги в DOM
            value: function show() {
                var div = document.createElement('div');
                div.className = "books_catalog__item";

                div.innerHTML = '\n                        <p class="title">' + this.title + '</p>\n                        <p class="author">' + this.author + '</p>\n                        <i class="delete fa fa-trash"></i>\n                        <i class="edit fa fa-pencil"></i>';

                containerBooks.insertBefore(div, containerBooks.firstChild);

                div.dataset.year = '' + this.year;
                div.dataset.pages = '' + this.pages;
            }
        }, {
            key: 'addToLocalStorage',
            value: function addToLocalStorage() {
                localStorage.setItem(this.id, JSON.stringify(this));
            }
        }, {
            key: 'removeFromLocalStorage',
            value: function removeFromLocalStorage() {
                delete localStorage[this.id];
            }
        }, {
            key: 'id',
            get: function get() {
                return '' + this.title + this.author + this.year + this.pages;
            }
        }]);

        return Book;
    }();

    // :(


    var form = document.getElementsByClassName('add_books__form')[0];
    var fieldAddBooks = document.getElementsByClassName('add_books__form')[0].elements;
    var containerBooks = document.getElementsByClassName('books_catalog')[0];
    var currentEditableBook = void 0;

    var modal = document.getElementsByClassName('modal')[0];
    var close = document.getElementsByClassName('modal__close')[0];
    var yes = document.getElementsByClassName('modal__yes')[0];
    var no = document.getElementsByClassName('modal__no')[0];

    // загрузка книг из localStorage при обновлении страницы
    for (var i = 0; i < localStorage.length; i++) {
        var book = JSON.parse(localStorage.getItem(localStorage.key(i)));
        book = new Book(book.title, book.author, book.year, book.pages);
        book.show();
    }

    // открытие модального окна
    function showModal(bookTitle) {
        var modal = document.getElementsByClassName('modal')[0];
        document.getElementsByClassName('modal__book_title')[0].innerHTML = bookTitle + ' ?';
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
        var title = container.querySelector('.title').innerHTML;
        var author = container.querySelector('.author').innerHTML;
        var year = +container.dataset.year;
        var pages = +container.dataset.pages;

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
        var title = fieldAddBooks.title.value.trim().replace(/\s+/g, ' ');
        var author = fieldAddBooks.author.value.trim().replace(/\s+/g, ' ');
        var year = +fieldAddBooks.year.value;
        var pages = +fieldAddBooks.pages.value;

        return [title, author, year, pages];
    }

    // вывод сообшения об ошибке
    function showMessage(text, container) {
        if (!container.parentElement.lastElementChild.classList.contains('add_books__message')) {

            var msgElem = document.createElement('span');
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
        var resultValidate = true;
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
    document.addEventListener('click', function (event) {

        // нажатие на кнопку сохранить
        if (event.target.classList.contains('btnForm')) {

            // получили данные из формы
            var _readForm = readForm(),
                _readForm2 = _slicedToArray(_readForm, 4),
                title = _readForm2[0],
                author = _readForm2[1],
                year = _readForm2[2],
                pages = _readForm2[3];

            // валидация формы


            if (!validate(title, author, year, pages)) return 0;

            // создаем новую книгу
            var newBook = new Book(title, author, year, pages);

            // если происходит редактирование
            if (form.dataset.edit == "true") {

                // сохраняем старые данные книги
                var _serializeCatalogItem = serializeCatalogItem(currentEditableBook),
                    _serializeCatalogItem2 = _slicedToArray(_serializeCatalogItem, 4),
                    oldTitle = _serializeCatalogItem2[0],
                    oldAuthor = _serializeCatalogItem2[1],
                    oldYear = _serializeCatalogItem2[2],
                    oldPages = _serializeCatalogItem2[3];

                // обновляем данные в каталоге


                updateCatalogItem(currentEditableBook, title, author, year, pages);

                // обновляем данные в localStorage
                var oldBook = new Book(oldTitle, oldAuthor, oldYear, oldPages);
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
            var parent = event.target.parentElement;

            var _serializeCatalogItem3 = serializeCatalogItem(parent),
                _serializeCatalogItem4 = _slicedToArray(_serializeCatalogItem3, 4),
                _title = _serializeCatalogItem4[0],
                _author = _serializeCatalogItem4[1],
                _year = _serializeCatalogItem4[2],
                _pages = _serializeCatalogItem4[3];

            var idFind = '' + _title + _author + _year + _pages;

            // открыть модальное окно
            showModal(_title);

            // отлавливаем клики на нем
            close.onclick = function () {
                return modal.style.display = "none";
            };
            no.onclick = function () {
                return modal.style.display = "none";
            };

            yes.onclick = function () {
                modal.style.display = "none";
                delete localStorage[idFind];
                parent.style.display = "none";
            };

            window.onclick = function (event) {
                if (event.target == modal) {
                    modal.style.display = "none";
                }
            };
        }

        // нажатие на кнопку редактировать
        if (event.target.classList.contains('edit')) {

            // удалем сообщения об ошибках
            removeMessage(fieldAddBooks.title);
            removeMessage(fieldAddBooks.author);
            removeMessage(fieldAddBooks.year);
            removeMessage(fieldAddBooks.pages);

            var _parent = event.target.parentElement;

            // получение данных из каталога

            var _serializeCatalogItem5 = serializeCatalogItem(_parent),
                _serializeCatalogItem6 = _slicedToArray(_serializeCatalogItem5, 4),
                _title2 = _serializeCatalogItem6[0],
                _author2 = _serializeCatalogItem6[1],
                _year2 = _serializeCatalogItem6[2],
                _pages2 = _serializeCatalogItem6[3];

            // заполнить форму


            fillForm(_title2, _author2, _year2, _pages2);

            // вешаем на форму атрибут edit
            form.dataset.edit = "true";
            currentEditableBook = _parent;
        }
    });

    // отлавливаем фокус на форме
    fieldAddBooks.title.addEventListener('focus', function (event) {
        return removeMessage(fieldAddBooks.title);
    });
    fieldAddBooks.author.addEventListener('focus', function (event) {
        return removeMessage(fieldAddBooks.author);
    });
    fieldAddBooks.year.addEventListener('focus', function (event) {
        return removeMessage(fieldAddBooks.year);
    });
    fieldAddBooks.pages.addEventListener('focus', function (event) {
        return removeMessage(fieldAddBooks.pages);
    });
})();