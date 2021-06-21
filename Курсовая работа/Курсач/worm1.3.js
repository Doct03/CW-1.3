const canvas = document.getElementById("game"); //подтягиваем canvas в наш код через id "game"
const ctx = canvas.getContext("2d"); //тут указываем какой будет игра, 2 мерной 

const pg = new Image(); //игровой фон
pg.src = "pics/pg2.png";

const foodpic = new Image();//картинку еды
foodpic.src = "pics/food2.png"


const lose = new Image(); //экран проиграша
lose.src="pics/lose.png";



let playground = new Image(); //игровое поле 
playground.src = "pic/pg2.png"


let audioEat = new Audio("audio/eat.mp3") //звук употребления еды

let audioGameOver = new Audio('audio/lose.wav') //звук проигрыша

let retry=new Image();//картинка попробывать снова 
 retry.src="pics/retry.png";

let boxX =32; //ширина
let boxY =32;//высота
let score = 0;//стартовое количество очков

let food={                                       //рандом спавн еды
    x:Math.floor((Math.random() * 17+1))*boxX, //используем рандом с диапазоном до 17 по x,отступ 1 boxX округляем до целого и умножаем на размер квадрата по X
    y:Math.floor((Math.random() * 15+3))*boxY,//используем рандом с диапазоном до 15 по y,отступ 3 boxY округляем до целого и умножаем на размер квадрата по Y
    };
    
    let worm=[];
    worm[0]={      //место появления червяка(ровно по центру)
        x:9*boxX,       
       y:10*boxY,  
        
    };

  
    
function drawlose(){                      //функция появления надписи game over ,retry
    
        ctx.drawImage(lose, 0, 0);
        ctx.drawImage(retry, 0, 0);
        
}

    document.addEventListener("keydown",direction); //оброботчкик событий который будет обротатывать любые запросы на странице(нажатия клавиш)

    let bob; //переменная для помощи в управлении (в названии нет смысла)
   

    function direction(event) {                          //управление червяком с помощью стрелок
        if(event.keyCode == 37 && bob != "right")     //добавлено что нельзя нажать стрелку передвежения вправо пока червяк ползет влево
            bob = "left";
        else if(event.keyCode == 38 && bob != "down")   //добавлено что нельзя нажать стрелку передвежения вниз пока червяк ползет вверх
            bob = "up";
        else if(event.keyCode == 39 && bob != "left")   //добавлено что нельзя нажать стрелку передвежения влево пока червяк ползет вправо
            bob = "right";
        else if(event.keyCode == 40 && bob != "up")  //добавлено что нельзя нажать стрелку передвежения вверх пока червяк ползет вниз
            bob = "down";
    }
    function wormtail(head, arrworm)   //проработка взаимодействия с хвостом
    {
        for(let i=0;i<arrworm.length;i++) //перебераем все елементы червяка
        {
                if(head.x==arrworm[i].x && head.y==arrworm[i].y) //если координаты головы червя равны с его хвостом то значит он себя сьел 
                clearInterval(game,audioGameOver.play(),drawlose()); //проигрыш
               
               
        }
    }

    function drawpg(){              //функция отрисовки игры
    ctx.drawImage(pg, 0, 0);            //отрисовуем фон игры
    ctx.drawImage(playground, 0, 0);     //отрисовуем игровое поле
    ctx.drawImage(foodpic, food.x, food.y); //отображение еды
   

	for(let i = 0; i < worm.length; i++)                 //червяк
    {
        ctx.fillStyle = i == 0 ? "pink" : localStorage.getItem('wormcolor'); //если i=0 то голова розовая а иначе все остальные елементы будут цвета выбраного пользователем
        ctx.fillRect(worm[i].x, worm[i].y, boxX,boxY); //отображение червяка
    }
                                                //счетчик
    ctx.fillStyle="white";                      //цвет счетчика
    ctx.font="75px Arial";                      //шрифт и размер
    ctx.fillText(score, boxX*1.5, boxY*1.90);     //координаты размещения

                                 //отрисовка передвежения
    let wormX=worm[0].x;   //координата первого елемента червя
    let wormY=worm[0].y;

    if(wormX == food.x && wormY == food.y) {          //взаемодействие червя с едой
		score++;
        audioEat.play()
		food = {                                            //радном спавн еды после того как чевяк съел
            x:Math.floor((Math.random() * 17+1))*boxX, 
            y:Math.floor((Math.random() * 15+3))*boxY,
		};
	} else
		worm.pop();//возврат(удаляем) последнего елемента

	if(wormX < boxX || wormX > boxX * 17             //если вышли за поле проигрыш
		|| wormY < 3 * boxY || wormY > boxY * 17){
        
		clearInterval(game,audioGameOver.play(),); //очистка после проигриша
        drawlose();                                  //вывод на экран функции с картинкой "GameOver"
      
        
        }

    if(bob == "left") wormX -= boxX; //проверки
	if(bob == "right") wormX += boxX;
	if(bob == "up") wormY -= boxY;
	if(bob == "down") wormY += boxY;

    let newHead={  //отрисовка головы
        x:wormX,
        y:wormY
    };  

    document.addEventListener('keydown', function(event) {    //событие обновления страници при нажатии на пробел
        if (event.code == "Space" ) {
          location.reload();
        }
      })
    

    wormtail(newHead,worm);//вызываем функцию

    worm.unshift(newHead);//+ элемент
}

let game = setInterval(drawpg,localStorage.getItem('speedworm'));// вызываем функию "drawbg" каждые 100мс для появления в html(скорость перемещения змейки)

playground.setAttribute('src',localStorage.getItem('bgcolor'));//замена цвета игрового поля
foodpic.setAttribute('src',localStorage.getItem('foodcolor'));//замена картинки еды


