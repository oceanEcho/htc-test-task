(function() {
    var username = document.querySelector('.username');
    var userPhone = document.querySelector('.phone-link');
    var userEmail = document.querySelector('.email-link');

    var interestContainer = document.querySelector('.interest-container');

    // если есть данные в localstorage, то выводим их
    function setUserData(item) {
        if (localStorage.getItem(item.className) != null) {
            item.innerHTML = (localStorage.getItem(item.className));
        }
    }

    setUserData(username);
    setUserData(userPhone);
    setUserData(userEmail);
    setUserData(interestContainer);

    // навешиваем обработчик на уже существующие интересы
    for (var i = 0; i < document.querySelectorAll('.interest').length; i++) {
        document.querySelectorAll('.interest')[i].addEventListener('click', removeItem, false);
    }

    // навешиваем обработчик на кнопку добавления интереса
    document.querySelector('#btnAddItem').addEventListener('click', addItem, false);
    document.querySelector('#interest-input-form').addEventListener('submit', addItem, false);

    // обработчик добавления интереса
    function addItem() {
        var interestField = document.querySelector('.interest-field');
        var newInterest = document.createElement('input');

        if (interestField.value != '') {
            newInterest.type = 'button';
            newInterest.className = 'btn btn-default interest';
            newInterest.style.marginRight = '3px'; // без этого кнопки прилипают друг к другу, а если прописывать в css появляется невидимый отступ
            newInterest.value = interestField.value;
            interestField.value = '';
            newInterest.addEventListener( 'click', removeItem, false);

            interestContainer.insertBefore(newInterest, interestContainer.children[0]);
            localStorage.setItem(interestContainer.className, interestContainer.innerHTML);
        }
        else {
            alert('Поле ввода не должно быть пустым!')
        }
    }

    // remove() для старых браузеров
    if (!Element.prototype.remove) {
        Element.prototype.remove = function remove() {
            if (this.parentNode) {
                this.parentNode.removeChild(this);
            }
        }
    }

    // обработчик удаления интереса
    function removeItem () {
        this.remove();
        localStorage.setItem(interestContainer.className, interestContainer.innerHTML);
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////

    username.addEventListener('click', editElement, false);
    userPhone.addEventListener('click', editElement, false);
    userEmail.addEventListener('click', editElement, false);

    // замена блока текстовым инпутом
    function editElement() {
        var parent = this.parentNode;
        var elemIndex = getElementIndex(this);
        var elemClass = this.className;

        var field = document.createElement('input');

        field.type = 'text';
        field.className = 'form-control subfield';
        field.value = this.innerHTML;
        field.addEventListener('blur', saveElem(elemClass), false);

        if (elemClass == 'username') {
            field.maxLength = '200';
        }
        else if (elemClass == 'phone-link') {
            field.maxLength = '20';
        }
        else if (elemClass == 'email-link') {
            field.maxLength = '255';
        }

        this.remove();
        parent.insertBefore(field, parent.children[elemIndex]);
        parent.children[elemIndex].focus();
    }

    // замента текстового инпута блоком с измененным значением и сохранение его в local storage
    function saveElem(elemClass) {
        return function() {
            var parent = this.parentNode;
            var elemIndex = getElementIndex(this);
        
            var newElem = document.createElement('div');

            newElem.className = elemClass;
            newElem.innerHTML = this.value;
            newElem.addEventListener('click', editElement, false);

            if (validate(elemClass, this.value)) {
                localStorage.setItem(elemClass, this.value);

                this.remove();
                parent.insertBefore(newElem, parent.children[elemIndex]);
            }
            else {
                this.placeholder = 'Поле должно быть заполнено';
                this.style.backgroundColor = "#fdb8b8";
                this.focus();
            }
        }
    }

    // получаем индекс узла в родителе
    function getElementIndex(elem) {
        if (!elem.tagName) {
            elem = document.querySelector(elem);
        }

        return [].indexOf.call(elem.parentNode.children, elem)
    }

    function validateEmail(email) {
        var reg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        return reg.test(email);
    }

    function validatePhone(phone) {
        var reg = /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/;

        return reg.test(phone);
    }

    function validateName(name) {
        var reg = /^[A-ЯЁ][а-яё]+\s[A-ЯЁ][а-яё]+$/;

        return reg.test(name);
    }

    function validate(elemClass, value) {
        if ((elemClass == 'phone-link') && validatePhone(value) && (value != '')) {
            return true;
        }

        if ((elemClass == 'email-link') && validateEmail(value) && (value != '')) {
            return true;
        }

        if ((elemClass == 'username') && validateName(value) && (value != '')) {
            return true;
        }
    }


}());