# Генератор исходников карт sudden-strike/rwg из json-файла  

Библиотека позволяет генерировать исходники карт sudden-strike/rwg,
используя в качестве источника json-файл описанной ниже структуры.  
Это в перспективе даст возможность писать автоматические генераторы карт для
sudden-strike/rwg.

## Зависимости и установка  
Прежде чем устанавливать утилиту убедитесь, что в системе установлен Node.js.  
Для этого запустите консоль и введите команду
```
node -v
```
В случае получения сообщения об ошибке, перейдите на сайт [Node.js](https://nodejs.org/en/download/)
в раздел `downloads` и выполните установку.  
Далее, запустите команду установки утилиты:
```
npm i https://github.com/Separator/rwg-map.git -g
```
Если всё прошло успешно, запустите команду:
```
rwg -v
```
Вам должна вернуться текущая версия утилиты.

## Использование  
Утилита принимает следующие параметры:  
* **-action** Действие (generate);
* **-destination** Путь к папке для сохранения результата работы;
* **-source** Путь к json-файлу источнику данных (обязательный);
* **-v** или **-version** Вывод текущей версии утилиты.  

Пример:  
```
rwg -source=my-map.json -destination=C:\Games\RWG3.45\Editor\Maps.src\map.000
```

## Формат json-файла  
json-файл состоит из следующих секций:  
* **airFields** Аэродромы (необязательная);
* **cells** Ячейки карты (необязательная);
* **embeddings** Вставки (необязательная);
* **flags** Флаги (необязательная);
* **meta** Информация о карте;
* **objects** Объекты (необязательная).

#### **airFields** Аэродромы  
Представляет из себя массив из максимум 16ти элементов.  
Каждый элемент массива состоит из следующих полей:
* **takeoffPoint** Точка взлёта;
* **landingPoint** Точка посадки;
* **hangarPoints** Точки ангаров (массив точек из максимум 16ти элементов).  
Каждый объект точки состоит из следующих полей:
  * **x** X-координата по горизонтали (0-511);
  * **y** Y-координата по вертикали (0-511);
  * **direction** Направление (`"east", "south", "west", "north"`).

#### **cells** Ячейки карты  
Представляет из себя массив из максимум 512 на 512 элементов.
Каждый элемент массива состоит из следующих полей:
* **x** X-координата по горизонтали (0-511);
* **y** Y-координата по вертикали (0-511);
* **terrain** Тип почвы (`"grass", "arable", "asphalt", "soil", "drySoil", "water", "sand"`);
* **pieces** Распределение почвы по ячейке. Представляет собой массив из 4х элементов вида:
```json
[TOP_LEFT, TOP_RIGHT, BOTTOM_LEFT, BOTTOM_RIGHT]
```
Каждый из элементов массива может быть числом от 0 до 1:
  * **0** Почва не установлена;
  * **1** Почва установлена.  
Пример:
```json
[1, 1, 1, 1]
```
В этом случае вся ячейка будет заполнена почвой указанного типа.
* **brightness** Яркость (число от 0x00 до 0x1f0 с шагом изменения 0x10).
Значение по умолчанию: 0x100.

#### **embeddings** Вставки  
Используется для внедрения в карту шаблонов поверх основного содержимого.  
Каждый элемент массива состоит из следующих полей:
* **x** X-координата по горизонтали (0-511);
* **y** Y-координата по вертикали (0-511);
* **path** Путь к файлу карты (такого же формата, как и в указанном документе).  
Пример шаблона:
```json
{
  "x": 100,
  "y": 150,
  "path": "soviet-city.json"
}
```

#### **flags** Флаги  
Представляет из себя массив из максимум 512 на 512 элементов.
Каждый элемент массива состоит из следующих полей:
* **x** X-координата по горизонтали (0-511);
* **y** Y-координата по вертикали (0-511);
* **airFieldTerritory** Территория аэродрома;
* **withoutPontoons** Без понтонов (`true` или `false`);
* **withoutWaves** Без волн (`true` или `false`);
* **visibilityUp** Увеличенная видимость (`true` или `false`, либо 0 или 1);
* **visibilityDown** Уменьшенная видимость (`true` или `false`, либо 0 или 1);
* **obstruction** Непроходимость.
Представляет собой массив из 4х элементов вида:
```json
[TOP_LEFT, TOP_RIGHT, BOTTOM_LEFT, BOTTOM_RIGHT]
```
Каждый из элементов массива может быть числом от 0 до 1:
  * **0** Проходимо;
  * **1** Непроходимо.  
Пример:
```json
[1, 1, 1, 1]
```
В этом случае вся ячейка будет полностью непроходимой.
* **completeObstruction** Полная непроходимость (`true` или `false`, либо 0 или 1);
* **shallows** Отмели.
Представляет собой массив из 4х элементов вида:
```json
[TOP_LEFT, TOP_RIGHT, BOTTOM_LEFT, BOTTOM_RIGHT]
```
Каждый из элементов массива может быть числом от 0 до 1:
  * **0** Отсутствие отмели;
  * **1** Наличие отмели.  
Пример:
```json
[1, 0, 1, 0]
```
В этом случае, левая половина ячейки будет проходима даже будучи заполненной водой.

#### **meta** Информация о карте  
Представляет из себя объект со следующими свойствами:
* **author** Автор (Строка от 1 до 255 символов);
* **name** Название карты (Строка от 1 до 255 символов);
* **scheme** Схема (`"summer", "winter", "jungle", "desert"`).  
На данный момент поддерживается только схема `"summer"`;
* **size** Размер (`128, 256, 384, 512`);
* **version** Версия (`major.minor.patch`).

#### **objects** Объекты  
Представляет из себя объект со следующими свойствами:
* **free** Массив свободных объектов;
* **horizontal** Массив горизонтальных объектов;
* **vertical** Массив вертикальных объектов;
* **trees** Массив деревьев;
* **roads**  Массив отрезков дорог;
* **buildings** Массив зданий;
* **fences** Массив заборов;
* **cliff** Массив обрывов;
* **crates** Массив воронок;
* **bridges** Мосты.  
Каждое свойство представляет собой массив объектов.  
Сумма длин всех массивов не может превышать 50000.  
Длина массива **buildings** не может превышать 800 элементов.  
Длина массива **bridges** не может превышать 32 элементов.  
Каждый элемент массивов имеет следующие свойства:
  * **x** X-координата по горизонтали (0-511);
  * **y** Y-координата по вертикали (0-511);
  * **damage** Состояние объекта (число от 0 до 3);
  * **id** id-объекта (Число).
