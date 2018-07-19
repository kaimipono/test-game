class Game {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.activeCells = [];
        this.openedCells = 0;
    }

    init() {
        this.showGameField();
        // this.playGame();
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
        const app = document.getElementById('app');

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
            app.appendChild(row);
        }
    }

    

}

const game = new Game(8, 3);

game.init();

