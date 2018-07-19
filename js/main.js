class Game {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.activeCells = [];
        this.openedCells = 0;
        this.app = document.getElementById('app');    // ссылка на игровое поле
    }

    init() {
        this.showGameField();
        this.playGame();
    }

    // Отобразить игровое поле

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
        // const app = document.getElementById('app');

        for (let i = 0; i < this.height; i++) {
            let row = document.createElement('tr');
            for (let j = 0; j < this.width; j++) {
                let cell = document.createElement('td');
                cell.classList.add('cell');
                let img = document.createElement('img');
                img.src = imageSources[i * this.width + j];
                let overlay = document.createElement('span');
                overlay.classList.add('overlay');
                cell.appendChild(overlay);
                cell.appendChild(img);
                row.appendChild(cell);
            }
            this.app.appendChild(row);
        }
    }

    playGame() {

        // Кликаем по полю
        this.app.addEventListener('click', (event) => {
            // сохраняем нажатую ячейку
            let cell = event.target.parentNode;
            // если ячейка не "заиграна", то делаем для нее проверку
            if (cell.className !== 'cell complete') {
                this.checkSelectedCell(cell);
            }
        });
        
    }
    
    checkSelectedCell(cell) {
        switch (this.activeCells.length) {
            case 0:
                this.addActiveCell(cell);
                break;
            
            case 1:
                if (this.activeCells[0] === cell) {
                    return;
                } else if (this.isEqualCells(this.activeCells[0], cell)) {
                    this.activeCells[0].classList.remove('active');
                    this.activeCells[0].classList.add('complete');
                    cell.classList.add('complete');
                    this.activeCells = [];
                    this.openedCells += 2;
                    if (this.openedCells === this.width * this.height){
                        this.finishGame();
                    }
                } else {
                    this.addActiveCell(cell);
                }
                break;
            
            case 2:
                this.hideActiveCells(this.activeCells);
                this.addActiveCell(cell);
                break;

        }
    }

    addActiveCell(cell) {
        cell.classList.add('active');
        this.activeCells.push(cell);
    }

    isEqualCells(firstCell, secondCell) {
        return firstCell.lastChild.src === secondCell.lastChild.src;
    }

    hideActiveCells (arrayActiveCells) {
        arrayActiveCells.map(item => {
            item.classList.remove('active');
        });
        this.activeCells = [];
    }

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

const game = new Game(2, 3);

game.init();

