//  Создаем класс Game. Конструктор принимает два параметра - размеры игрового поля.

class Game {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.activeCells = [];                        // вспомогательный массив, содержащий активные ячейки (максимум содержит два элемента)
        this.openedCells = 0;                         // количество открытых ячеек
        this.app = document.getElementById('app');    // ссылка на игровое поле
    }

    // Метод, инициализирующий игру

    init() {
        this.showGameField();                         // отображаем игровое поле
        this.playGame();                              // запускаем игровой процесс
    }

    
    
    // Метод отображения игрового поля

    showGameField() {

        // Заполняем массив путями дублирующихся изображений

        let imageSources = [];
        let len = (this.width * this.height) / 2;    
        for (let i = 0; i < len; i++) {
            let path = `https://kde.link/test/${i % 10}.png`;
            imageSources.push(path, path);
        }

        // Алгоритм Фишера - Йетса перемешивания массива

        for (let i = 0; i < 2 * len; i++) {
            let j = Math.floor(Math.random() * (i + 1));
            [imageSources[i], imageSources[j]] = [imageSources[j], imageSources[i]];
        }

        // Формируем игровое поле для текущих размеров

        for (let i = 0; i < this.height; i++) {
            let row = document.createElement('tr');    //создаем в цикле строку таблицы
            for (let j = 0; j < this.width; j++) {
                let cell = document.createElement('td');   // в каждой строке создаем ячейки
                cell.classList.add('cell');
                let img = document.createElement('img');       // в каждй ячейке создаем изображение
                img.src = imageSources[i * this.width + j];
                let overlay = document.createElement('span');  // также в ячейке создаем вспомогательный элемент-заслонку
                overlay.classList.add('overlay');
                cell.appendChild(overlay);                      
                cell.appendChild(img);                         
                row.appendChild(cell);                         
            }
            this.app.appendChild(row);                         // добавляем созданную строку в заданную таблицу
        }
    }


    // Метод, запускющий игровой процесс

    playGame() {

        this.app.addEventListener('click', (event) => {      // Кликаем по полю
            let cell = event.target.parentNode;              // сохраняем нажатую ячейку
            if (cell.className !== 'cell complete') {        // если ячейка не открыта, то делаем для нее проверку
                this.checkSelectedCell(cell);
            }
        });
        
    }

    // Метод, проверяющий выбранную ячейку
    
    checkSelectedCell(cell) {
        switch (this.activeCells.length) {             // проверяем количество активных в данный момент элементов
            case 0:
                this.addActiveCell(cell);              // если активных ячеек нет, то добавляем в массив выбранную ячейку
                break;
            
            case 1:
                if (this.activeCells[0] === cell) {    // если выбранная ячейка уже активна, то ничего не делаем
                    return;
                } else if (this.isEqualCells(this.activeCells[0], cell)) {   // если выбранная ячейка совпадает с активной,
                    this.activeCells[0].classList.remove('active'); 
                    this.activeCells[0].classList.add('complete');           // то отмечаем обе, как открытые
                    cell.classList.add('complete');
                    this.activeCells = [];
                    this.openedCells += 2;                                  // и увеличиваем счетчик открытых ячеек на 2
                    if (this.openedCells === this.width * this.height){
                        this.finishGame();                                  // если кол-во открытых ячеек совпадает с общим числом ячеек, то завершаем игру
                    }
                } else {                                                    // если выбранная ячейка не совпадает с активной,
                    this.addActiveCell(cell);                               // то добавляем ее во вспомагательный массив;
                }                                                           
                break;
            
            case 2:
                this.hideActiveCells(this.activeCells);                    // при следующем клике предыдущие обе активные ячейки скрываем, чистим массив
                this.addActiveCell(cell);                                  // добавляем выбранную ячейку в массив активных
                break;

        }
    }


    // Метод добавления выбранной ячейки в массив активных ячеек

    addActiveCell(cell) {
        cell.classList.add('active');
        this.activeCells.push(cell);
    }


    // Метод сравнения двух ячеек; ячейки считаются равными, если совпадают изображения на них

    isEqualCells(firstCell, secondCell) {
        return firstCell.lastChild.src === secondCell.lastChild.src;      // одинаковые изображения содержат одинаковые пути
    }


    // Метод скрывающий две предыдущие активные ячейки; в метод передается массив, состоящий из двух ячеек

    hideActiveCells (arrayActiveCells) {
        arrayActiveCells.map(item => {
            item.classList.remove('active');        // удаляем класс-пометку с каждй ячейки
        });
        this.activeCells = [];                      // очищаем массив активных ячеек
    }


    // Метод, завершающий игру. При завершении отображаем модальное окно с сообщением

    finishGame() {
        const modal = document.getElementById('modal');
        const btnClose = document.getElementsByClassName('close')[0];

        modal.style.display = 'block';

        btnClose.onclick = () => modal.style.display = 'none';

        window.onclick = (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        };

    }

}

// const game = new Game(2, 3);    
// game.init();                                

const xhr = new XMLHttpRequest();                             // создаем запрос 
xhr.open('GET', 'https://kde.link/test/get_field_size.php');  // открываем соединение

xhr.onreadystatechange = () => {                              // вешаем обработчик 
    try {
        if (xhr.readyState === 4) {                           // данные с указанного сервера загружены
            if (xhr.status === 200) {                         //  статус ОК
                let sizes = JSON.parse(xhr.responseText);     // распарсенный объект имеет свойства width и height
                const game = new Game(sizes.width, sizes.height);    // создаем экземпляр игры с полученными размерами
                game.init();                                         // запускаем игру

            } else {
                alert(`Не удалось получить данные:\n ${xhr.statusText}`);
            }
        }
    }
    catch(e) {
        alert(`Ошибка: ${e.description}`);
    }
}

xhr.send(null);             // отправляем запрос










